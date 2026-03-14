"use client"

import { CopyIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  hoverPreviewCloseDelay,
  hoverPreviewDelay,
} from "@/lib/hover"
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

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const textarea = document.createElement("textarea")
  textarea.value = value
  textarea.setAttribute("readonly", "")
  textarea.style.position = "fixed"
  textarea.style.opacity = "0"
  document.body.appendChild(textarea)
  textarea.select()

  try {
    const copied = document.execCommand("copy")
    if (!copied) {
      throw new Error("copy command failed")
    }
  } finally {
    document.body.removeChild(textarea)
  }
}

export function AuditMetadataPreview({
  metadata,
}: {
  metadata: Record<string, unknown>
}) {
  const formatted = formatMetadata(metadata)

  async function copyMetadata() {
    try {
      await copyText(formatted.full)
      toast.success("Metadata copied.")
    } catch {
      toast.error("Metadata copy failed.")
    }
  }

  return (
    <HoverCard>
      <HoverCardTrigger
        delay={hoverPreviewDelay}
        closeDelay={hoverPreviewCloseDelay}
        render={<span className="block w-full" />}
      >
        <code className="line-clamp-2 break-all text-xs text-muted-foreground">
          {formatted.preview}
        </code>
      </HoverCardTrigger>
      <HoverCardContent className="w-96 max-w-[90vw]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold">Metadata</p>
            <Button
              variant="ghost"
              size="xs"
              onClick={copyMetadata}
            >
              <CopyIcon data-icon="inline-start" />
              Copy
            </Button>
          </div>
          <pre className="max-h-72 overflow-auto rounded-md bg-muted/40 p-2 text-xs leading-5 text-foreground">
            {formatted.full}
          </pre>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
