const DID = "did:plc:vmqt4a4pf5jxvtalzjz2zsqk"
const COLLECTION = "site.standard.document"

// Resolve PDS endpoint from DID via the PLC directory
async function resolvePds(did: string): Promise<string> {
  const res = await fetch(`https://plc.directory/${did}`)
  if (!res.ok) throw new Error(`Failed to resolve DID: ${res.status}`)
  const doc = await res.json()
  const service = doc.service?.find(
    (s: { type: string; serviceEndpoint: string }) =>
      s.type === "AtprotoPersonalDataServer"
  )
  if (!service) throw new Error("No PDS service found in DID document")
  return service.serviceEndpoint
}

export interface ATProtoFacet {
  index: { byteStart: number; byteEnd: number }
  features: { $type: string }[]
}

export interface ATProtoBlock {
  $type: string
  block: {
    $type: string
    plaintext: string
    facets: ATProtoFacet[]
    level?: number
  }
}

export interface ATProtoDocument {
  rkey: string
  uri: string
  cid: string
  title: string
  description: string
  publishedAt: string
  tags: string[]
  path: string
  blocks: ATProtoBlock[]
}

function extractBlocks(value: Record<string, unknown>): ATProtoBlock[] {
  const content = value.content as { pages?: { blocks?: ATProtoBlock[] }[] } | undefined
  return content?.pages?.[0]?.blocks ?? []
}

function parseRecord(record: { uri: string; cid: string; value: Record<string, unknown> }): ATProtoDocument {
  const { uri, cid, value } = record
  const rkey = uri.split("/").pop()!
  return {
    rkey,
    uri,
    cid,
    title: value.title as string,
    description: value.description as string,
    publishedAt: value.publishedAt as string,
    tags: (value.tags as string[]) ?? [],
    path: value.path as string,
    blocks: extractBlocks(value),
  }
}

export async function listDocuments(): Promise<ATProtoDocument[]> {
  const pds = await resolvePds(DID)
  const url = `${pds}/xrpc/com.atproto.repo.listRecords?repo=${DID}&collection=${COLLECTION}`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`listRecords failed: ${res.status}`)
  const data = await res.json()
  return (data.records as { uri: string; cid: string; value: Record<string, unknown> }[])
    .map(parseRecord)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export async function getDocument(rkey: string): Promise<ATProtoDocument | null> {
  const pds = await resolvePds(DID)
  const url = `${pds}/xrpc/com.atproto.repo.getRecord?repo=${DID}&collection=${COLLECTION}&rkey=${rkey}`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) return null
  const record = await res.json()
  return parseRecord(record)
}
