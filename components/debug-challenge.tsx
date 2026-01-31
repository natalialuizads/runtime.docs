"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronUp, Terminal, Lightbulb } from "lucide-react"

interface DebugChallengeProps {
  title: string
  scenario: string
  backendApproach: string
  problem: string
  hints: string[]
  solution: string
  className?: string
}

export function DebugChallenge({
  title,
  scenario,
  backendApproach,
  problem,
  hints,
  solution,
  className,
}: DebugChallengeProps) {
  const [showHints, setShowHints] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [userAnswer, setUserAnswer] = useState("")

  return (
    <div className={cn("my-8 rounded-lg border-2 border-primary/30 bg-primary/5", className)}>
      <div className="flex items-center gap-3 border-b border-primary/20 bg-primary/10 px-4 py-3">
        <Terminal className="h-5 w-5 text-primary" />
        <span className="font-mono text-sm font-semibold text-primary">DESAFIO DE DEBUG</span>
        <span className="ml-auto rounded bg-primary/20 px-2 py-1 font-mono text-xs text-primary">
          {title}
        </span>
      </div>
      
      <div className="space-y-4 p-4 sm:p-6">
        <div>
          <h4 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Cenario
          </h4>
          <p className="text-sm leading-relaxed text-foreground">{scenario}</p>
        </div>

        <div className="rounded-lg border border-accent/30 bg-accent/10 p-4">
          <h4 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-accent">
            Abordagem Backend
          </h4>
          <pre className="whitespace-pre-wrap font-mono text-xs text-accent/80">{backendApproach}</pre>
        </div>

        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
          <h4 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-destructive">
            O Problema
          </h4>
          <p className="text-sm text-destructive/80">{problem}</p>
        </div>

        <div>
          <h4 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sua Solucao
          </h4>
          <Textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Descreva sua estrategia aqui..."
            className="min-h-[100px] font-mono text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHints(!showHints)}
            className="gap-2"
          >
            <Lightbulb className="h-4 w-4" />
            {showHints ? "Esconder Dicas" : "Ver Dicas"}
            {showHints ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSolution(!showSolution)}
            className="gap-2"
          >
            <Terminal className="h-4 w-4" />
            {showSolution ? "Esconder Solucao" : "Ver Solucao"}
            {showSolution ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {showHints && (
          <div className="rounded-lg border border-chart-4/30 bg-chart-4/10 p-4">
            <h4 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-chart-4">
              Dicas
            </h4>
            <ul className="space-y-2">
              {hints.map((hint, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-chart-4/80">
                  <span className="font-mono text-chart-4">{i + 1}.</span>
                  {hint}
                </li>
              ))}
            </ul>
          </div>
        )}

        {showSolution && (
          <div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
            <h4 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              Solucao
            </h4>
            <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-primary/80">
              {solution}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
