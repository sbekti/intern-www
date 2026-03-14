"use client"

import { cn } from "@/lib/utils"
import {
  formatCompactLocalTimestamp,
  formatExactLocalTimestamp,
} from "@/lib/date-time"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function LocalTimestamp({
  value,
  emptyLabel = "Never",
  className,
}: {
  value?: string | null
  emptyLabel?: string
  className?: string
}) {
  if (!value) {
    return <span className={className}>{emptyLabel}</span>
  }

  const compactTimestamp = formatCompactLocalTimestamp(value)
  const exactTimestamp = formatExactLocalTimestamp(value)

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <time
            dateTime={value}
            className={cn("inline-flex w-fit cursor-default", className)}
            suppressHydrationWarning
          />
        }
      >
        {compactTimestamp}
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Local time</p>
          <p className="text-xs opacity-80">{exactTimestamp}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
