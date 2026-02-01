"use client"

import { cn } from "@/lib/utils"

interface ComparisonTableProps {
  headers: string[]
  rows: string[][]
  className?: string
}

export function ComparisonTable({ headers, rows, className }: ComparisonTableProps) {
  return (
    <div className={cn("my-6 overflow-hidden rounded-lg border border-border", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-secondary/80">
            {headers.map((header, i) => (
              <th 
                key={i} 
                className={cn(
                  "px-4 py-3 text-left font-mono text-xs font-semibold uppercase tracking-wider",
                  i === 0 ? "text-primary" : "text-accent"
                )}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-sm text-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
