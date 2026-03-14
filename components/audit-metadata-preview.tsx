"use client"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

function formatMetadata(metadata: Record<string, unknown>) {
  try {
    return {
      preview: JSON.stringify(metadata),
      full: JSON.stringify(metadata, null, 2),
    }
  } catch {
    const fallback = String(metadata)
    return {
      preview: fallback,
      full: fallback,
    }
  }
}

export function AuditMetadataPreview({
  metadata,
}: {
  metadata: Record<string, unknown>
}) {
  const formatted = formatMetadata(metadata)

  return (
    <HoverCard>
      <HoverCardTrigger
        delay={100}
        closeDelay={100}
        render={<span className="block w-full cursor-help" />}
      >
        <code className="line-clamp-2 break-all text-xs text-muted-foreground">
          {formatted.preview}
        </code>
      </HoverCardTrigger>
      <HoverCardContent className="w-96 max-w-[90vw]">
        <div className="flex flex-col gap-2">
          <p className="font-medium">Metadata</p>
          <pre className="overflow-x-auto rounded-md bg-muted/40 p-3 text-xs leading-5 text-foreground">
            {formatted.full}
          </pre>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
