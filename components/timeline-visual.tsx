"use client"

import { cn } from "@/lib/utils"

interface TimelineItem {
  label: string
  duration: number
  color?: "primary" | "accent" | "destructive" | "muted"
  blocked?: boolean
}

interface TimelineVisualProps {
  items: TimelineItem[]
  title?: string
  maxDuration?: number
  className?: string
}

export function TimelineVisual({ items, title, maxDuration = 100, className }: TimelineVisualProps) {
  const colorClasses = {
    primary: "bg-primary",
    accent: "bg-accent",
    destructive: "bg-destructive",
    muted: "bg-muted-foreground",
  }

  return (
    <div className={cn("my-6", className)}>
      {title && (
        <div className="mb-4 font-mono text-sm font-medium text-primary">{title}</div>
      )}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-32 shrink-0 truncate font-mono text-xs text-muted-foreground sm:w-40">
              {item.label}
            </div>
            <div className="relative h-6 flex-1 overflow-hidden rounded bg-secondary/50">
              <div
                className={cn(
                  "absolute left-0 top-0 h-full rounded transition-all duration-500",
                  colorClasses[item.color || "primary"],
                  item.blocked && "animate-pulse"
                )}
                style={{ width: `${(item.duration / maxDuration) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-end pr-2">
                <span className="font-mono text-xs text-foreground/80">
                  {item.duration}ms {item.blocked && "(BLOCKED)"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
