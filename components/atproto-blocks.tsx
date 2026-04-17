import type { ATProtoBlock, ATProtoFacet } from "@/lib/atproto"

// Apply rich text facets to plaintext using UTF-8 byte offsets
function renderRichText(plaintext: string, facets: ATProtoFacet[]): React.ReactNode {
  if (!facets?.length) return plaintext

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const bytes = encoder.encode(plaintext)

  const boundaries = new Set([0, bytes.length])
  for (const f of facets) {
    boundaries.add(f.index.byteStart)
    boundaries.add(f.index.byteEnd)
  }

  const sorted = [...boundaries].sort((a, b) => a - b)

  return sorted.slice(0, -1).map((start, i) => {
    const end = sorted[i + 1]
    const text = decoder.decode(bytes.slice(start, end))
    const activeFeatures = new Set<string>()

    for (const f of facets) {
      if (f.index.byteStart <= start && f.index.byteEnd >= end) {
        for (const feat of f.features) {
          activeFeatures.add(feat.$type.split("#")[1])
        }
      }
    }

    let node: React.ReactNode = text
    if (activeFeatures.has("highlight")) node = <mark key={`m${i}`} className="bg-black/10 dark:bg-white/10 px-0.5">{node}</mark>
    if (activeFeatures.has("bold")) node = <strong key={`b${i}`} className="font-semibold">{node}</strong>
    if (activeFeatures.has("italic")) node = <em key={`e${i}`}>{node}</em>
    if (activeFeatures.has("underline")) node = <u key={`u${i}`}>{node}</u>
    return <span key={`s${i}`}>{node}</span>
  })
}

export function RenderBlocks({ blocks }: { blocks: ATProtoBlock[] }) {
  return (
    <>
      {blocks.map((item, i) => {
        const { block } = item
        const type = block.$type.split(".").pop()
        const content = renderRichText(block.plaintext, block.facets)

        if (!block.plaintext) return null

        if (type === "header") {
          const level = block.level ?? 2
          const cls = level === 2
            ? "mt-10 mb-4 font-serif text-xl font-normal text-black dark:text-white md:text-2xl"
            : "mt-6 mb-2 font-serif text-lg font-normal text-black dark:text-white"
          if (level === 2) return <h2 key={i} className={cls}>{content}</h2>
          return <h3 key={i} className={cls}>{content}</h3>
        }

        if (type === "blockquote") {
          return (
            <blockquote key={i} className="my-4 border-l-2 border-black/20 pl-4 font-sans text-sm italic leading-relaxed text-black/60 dark:border-white/20 dark:text-white/60">
              {content}
            </blockquote>
          )
        }

        return (
          <p key={i} className="mb-4 font-sans text-base leading-relaxed text-black/70 dark:text-white/70">
            {content}
          </p>
        )
      })}
    </>
  )
}
