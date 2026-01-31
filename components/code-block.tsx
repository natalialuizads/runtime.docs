"use client"

import { cn } from "@/lib/utils"
import { Check, Copy } from "lucide-react"
import { useState, useMemo } from "react"

interface CodeBlockProps {
  children: string
  language?: string
  filename?: string
  className?: string
  highlights?: number[]
}

// Tokenização simples para syntax highlighting
function tokenize(code: string, language: string) {
  const keywords: Record<string, string[]> = {
    javascript: ['const', 'let', 'var', 'function', 'async', 'await', 'return', 'if', 'else', 'for', 'while', 'class', 'new', 'import', 'export', 'from', 'default', 'try', 'catch', 'throw', 'typeof', 'instanceof', 'true', 'false', 'null', 'undefined', 'this'],
    typescript: ['const', 'let', 'var', 'function', 'async', 'await', 'return', 'if', 'else', 'for', 'while', 'class', 'new', 'import', 'export', 'from', 'default', 'try', 'catch', 'throw', 'typeof', 'instanceof', 'true', 'false', 'null', 'undefined', 'this', 'interface', 'type', 'extends', 'implements'],
    python: ['def', 'async', 'await', 'return', 'if', 'else', 'elif', 'for', 'while', 'class', 'import', 'from', 'try', 'except', 'raise', 'True', 'False', 'None', 'self', 'with', 'as', 'lambda', 'yield'],
    sql: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'DROP', 'ALTER', 'INDEX', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'AND', 'OR', 'NOT', 'NULL', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'CONSTRAINT', 'BLOCKS'],
    html: ['html', 'head', 'body', 'div', 'span', 'p', 'h1', 'h2', 'h3', 'a', 'link', 'script', 'style', 'meta', 'title', 'rel', 'href', 'src', 'class', 'id'],
    css: ['display', 'none', 'block', 'flex', 'grid', 'position', 'absolute', 'relative', 'fixed', 'margin', 'padding', 'border', 'width', 'height', 'color', 'background', 'font', 'text'],
  }

  const lang = language.toLowerCase()
  const keywordList = keywords[lang] || keywords.javascript || []
  
  return code.split('\n').map(line => {
    const tokens: { type: string; value: string }[] = []
    let remaining = line
    
    while (remaining.length > 0) {
      // Comentários
      if (remaining.startsWith('//') || remaining.startsWith('#') || remaining.startsWith('--')) {
        tokens.push({ type: 'comment', value: remaining })
        remaining = ''
        continue
      }
      
      // Strings
      const stringMatch = remaining.match(/^(['"`]).*?\1/)
      if (stringMatch) {
        tokens.push({ type: 'string', value: stringMatch[0] })
        remaining = remaining.slice(stringMatch[0].length)
        continue
      }
      
      // Números
      const numberMatch = remaining.match(/^\d+(\.\d+)?(ms|px|KB|MB|GB|%)?/)
      if (numberMatch) {
        tokens.push({ type: 'number', value: numberMatch[0] })
        remaining = remaining.slice(numberMatch[0].length)
        continue
      }
      
      // Palavras-chave e identificadores
      const wordMatch = remaining.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/)
      if (wordMatch) {
        const word = wordMatch[0]
        const isKeyword = keywordList.includes(word) || keywordList.includes(word.toUpperCase())
        tokens.push({ type: isKeyword ? 'keyword' : 'identifier', value: word })
        remaining = remaining.slice(word.length)
        continue
      }
      
      // Operadores e pontuação
      const operatorMatch = remaining.match(/^[=<>!+\-*/&|^~%]+|^[{}[\]();,.:?]/)
      if (operatorMatch) {
        tokens.push({ type: 'operator', value: operatorMatch[0] })
        remaining = remaining.slice(operatorMatch[0].length)
        continue
      }
      
      // Espaços
      const spaceMatch = remaining.match(/^\s+/)
      if (spaceMatch) {
        tokens.push({ type: 'space', value: spaceMatch[0] })
        remaining = remaining.slice(spaceMatch[0].length)
        continue
      }
      
      // Caractere desconhecido
      tokens.push({ type: 'unknown', value: remaining[0] })
      remaining = remaining.slice(1)
    }
    
    return tokens
  })
}

export function CodeBlock({ children, language = "javascript", filename, className, highlights = [] }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  
  const tokenizedLines = useMemo(() => tokenize(children, language), [children, language])
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const getTokenClass = (type: string) => {
    switch (type) {
      case 'keyword': return 'text-primary font-semibold'
      case 'string': return 'text-accent'
      case 'number': return 'text-chart-4'
      case 'comment': return 'text-muted-foreground/60 italic'
      case 'operator': return 'text-muted-foreground'
      default: return 'text-foreground'
    }
  }

  return (
    <div className={cn("my-4 overflow-hidden rounded-lg border border-border", className)}>
      {filename && (
        <div className="flex items-center gap-2 border-b border-border bg-secondary/80 px-4 py-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-destructive/60" />
            <span className="h-3 w-3 rounded-full bg-chart-4/60" />
            <span className="h-3 w-3 rounded-full bg-accent/60" />
          </div>
          <span className="ml-2 font-mono text-xs text-muted-foreground">{filename}</span>
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
      <pre className="overflow-x-auto bg-card p-4">
        <code className="font-mono text-xs leading-relaxed sm:text-sm">
          {tokenizedLines.map((lineTokens, lineIndex) => (
            <div 
              key={lineIndex} 
              className={cn(
                "flex",
                highlights.includes(lineIndex + 1) && "bg-primary/10 -mx-4 px-4 border-l-2 border-primary"
              )}
            >
              <span className="mr-4 select-none text-muted-foreground/40 w-6 text-right">
                {lineIndex + 1}
              </span>
              <span>
                {lineTokens.map((token, tokenIndex) => (
                  <span key={tokenIndex} className={getTokenClass(token.type)}>
                    {token.value}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}
