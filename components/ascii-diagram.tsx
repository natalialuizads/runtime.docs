"use client"

import { cn } from "@/lib/utils"

interface AsciiDiagramProps {
  children: string
  title?: string
  className?: string
}

export function AsciiDiagram({ children, title, className }: AsciiDiagramProps) {
  return (
    <div className={cn("my-6 overflow-x-auto", className)}>
      {title && (
        <div className="mb-2 text-sm font-medium text-primary">{title}</div>
      )}
      <pre className="rounded-lg border border-border bg-secondary/50 p-4 font-mono text-xs leading-relaxed text-muted-foreground sm:text-sm">
        {children}
      </pre>
    </div>
  )
}
