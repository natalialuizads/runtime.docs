"use client"

import { cn } from "@/lib/utils"

interface ComparisonTableProps {
  headers: [string, string]
  rows: [string, string][]
  className?: string
}

export function ComparisonTable({ headers, rows, className }: ComparisonTableProps) {
  return (
    <div className={cn("my-6 overflow-hidden rounded-lg border border-border", className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/80">
            <th className="px-4 py-3 text-left font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              {headers[0]}
            </th>
            <th className="px-4 py-3 text-left font-mono text-xs font-semibold uppercase tracking-wider text-accent">
              {headers[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0">
              <td className="px-4 py-3 text-sm text-foreground">{row[0]}</td>
              <td className="px-4 py-3 text-sm text-foreground">{row[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
