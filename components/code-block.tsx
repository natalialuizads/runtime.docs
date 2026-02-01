"use client"

import { cn } from "@/lib/utils"
import { Check, Copy } from "lucide-react"
import { useEffect, useState } from "react"
import { codeToHtml } from "shiki"

interface CodeBlockProps {
  children: string
  language?: string
  filename?: string
  className?: string
  highlights?: number[]
}

export function CodeBlock({ children, language = "javascript", filename, className, highlights = [] }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [highlightedCode, setHighlightedCode] = useState<string>("")
  
  useEffect(() => {
    async function highlight() {
      try {
        const html = await codeToHtml(children, {
          lang: language,
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
          defaultColor: false,
        })
        setHighlightedCode(html)
      } catch (error) {
        console.error("Failed to highlight code:", error)
        setHighlightedCode(`<pre><code>${children}</code></pre>`)
      }
    }
    highlight()
  }, [children, language])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("my-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm dark:bg-[#0d1117]", className)}>
      {(filename || language) && (
        <div className="flex items-center gap-2 border-b border-border bg-secondary/80 px-4 py-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-destructive/60" />
            <span className="h-3 w-3 rounded-full bg-chart-4/60" />
            <span className="h-3 w-3 rounded-full bg-accent/60" />
          </div>
          {filename && <span className="ml-2 font-mono text-xs text-muted-foreground">{filename}</span>}
          <span className="ml-auto rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="ml-2 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Copiar código"
          >
            {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      )}
      <div 
        className="shiki-container overflow-x-auto p-4 font-mono text-xs leading-relaxed sm:text-sm"
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
      <style jsx global>{`
        .shiki-container pre {
          background-color: transparent !important;
          margin: 0;
          padding: 0;
        }
        .shiki-container code {
          background-color: transparent !important;
        }
      `}</style>
    </div>
  )
}
