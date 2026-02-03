"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw } from "lucide-react"

type Stage = "idle" | "html" | "css-block" | "css-download" | "dom" | "cssom" | "render" | "layout" | "paint" | "complete"

const stages: { id: Stage; name: string; duration: number; color: string; description: string }[] = [
  { id: "html", name: "HTML Parse", duration: 300, color: "bg-chart-1", description: "Lendo HTML, construindo DOM incrementalmente" },
  { id: "css-block", name: "CSS Encontrado", duration: 100, color: "bg-chart-4", description: "<link> encontrado - RENDER BLOCKED" },
  { id: "css-download", name: "CSS Download", duration: 800, color: "bg-destructive", description: "Aguardando I/O de rede... nada pode ser pintado" },
  { id: "dom", name: "DOM Tree", duration: 200, color: "bg-chart-1", description: "Finalizando arvore DOM" },
  { id: "cssom", name: "CSSOM Build", duration: 300, color: "bg-chart-3", description: "Construindo arvore de estilos" },
  { id: "render", name: "Render Tree", duration: 200, color: "bg-primary", description: "Combinando DOM + CSSOM" },
  { id: "layout", name: "Layout", duration: 150, color: "bg-accent", description: "Calculando geometria (x, y, width, height)" },
  { id: "paint", name: "Paint", duration: 100, color: "bg-accent", description: "Rasterizando pixels na tela" },
]

export function CRPPipeline() {
  const [currentStage, setCurrentStage] = useState<Stage>("idle")
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [blockedTime, setBlockedTime] = useState(0)

  const reset = useCallback(() => {
    setCurrentStage("idle")
    setIsRunning(false)
    setProgress(0)
    setTotalTime(0)
    setBlockedTime(0)
  }, [])

  const start = useCallback(() => {
    reset()
    setIsRunning(true)
    setCurrentStage("html")
  }, [reset])

  useEffect(() => {
    if (!isRunning || currentStage === "idle" || currentStage === "complete") return

    const stageIndex = stages.findIndex(s => s.id === currentStage)
    const stage = stages[stageIndex]
    
    if (!stage) {
      setCurrentStage("complete")
      setIsRunning(false)
      return
    }

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const stageProgress = Math.min((elapsed / stage.duration) * 100, 100)
      setProgress(stageProgress)
      setTotalTime(prev => prev + 16)
      
      if (stage.id === "css-download") {
        setBlockedTime(prev => prev + 16)
      }

      if (elapsed >= stage.duration) {
        clearInterval(interval)
        const nextStage = stages[stageIndex + 1]
        if (nextStage) {
          setCurrentStage(nextStage.id)
          setProgress(0)
        } else {
          setCurrentStage("complete")
          setIsRunning(false)
        }
      }
    }, 16)

    return () => clearInterval(interval)
  }, [isRunning, currentStage])

  const getCurrentStageInfo = () => {
    if (currentStage === "idle") return { name: "Aguardando...", description: "Clique em Iniciar para ver o pipeline", color: "bg-muted" }
    if (currentStage === "complete") return { name: "Completo!", description: "First Paint alcancado", color: "bg-accent" }
    return stages.find(s => s.id === currentStage) || { name: "", description: "", color: "bg-muted" }
  }

  const stageInfo = getCurrentStageInfo()

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-mono text-sm font-semibold text-primary">Critical Rendering Path Visualizer</h3>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-muted-foreground">Total: <span className="text-foreground">{totalTime}ms</span></span>
          <span className="text-destructive">Blocked: <span>{blockedTime}ms</span></span>
        </div>
      </div>

      {/* Pipeline Visual */}
      <div className="mb-6 flex items-center gap-1 overflow-x-auto pb-2">
        {stages.map((stage, i) => {
          const stageIndex = stages.findIndex(s => s.id === currentStage)
          const isComplete = i < stageIndex || currentStage === "complete"
          const isCurrent = stage.id === currentStage
          const isPending = i > stageIndex && currentStage !== "complete"

          return (
            <div key={stage.id} className="flex items-center">
              <div 
                className={`relative flex h-12 min-w-[80px] flex-col items-center justify-center rounded px-2 transition-all ${
                  isComplete ? stage.color : isCurrent ? `${stage.color} animate-pulse` : "bg-muted/30"
                }`}
              >
                <span className={`font-mono text-xs ${isComplete || isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                  {stage.name}
                </span>
                <span className="font-mono text-xs text-muted-foreground">{stage.duration}ms</span>
                {isCurrent && (
                  <div 
                    className="absolute bottom-0 left-0 h-1 bg-foreground/50 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </div>
              {i < stages.length - 1 && (
                <div className={`mx-1 h-0.5 w-4 ${isComplete ? "bg-accent" : "bg-muted/30"}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Current Stage Info */}
      <div className={`mb-4 rounded-lg border p-4 ${stageInfo.color}/20 border-${stageInfo.color?.replace('bg-', '')}/30`}>
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${stageInfo.color} ${isRunning ? "animate-pulse" : ""}`} />
          <span className="font-mono text-sm font-semibold text-foreground">{stageInfo.name}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{stageInfo.description}</p>
      </div>

      {/* Timeline */}
      <div className="mb-4 rounded border border-border bg-background p-3">
        <div className="mb-2 font-mono text-xs text-muted-foreground">Timeline Visual</div>
        <div className="flex h-8 gap-0.5 overflow-hidden rounded">
          {stages.map((stage, i) => {
            const stageIndex = stages.findIndex(s => s.id === currentStage)
            const isComplete = i < stageIndex || currentStage === "complete"
            const isCurrent = stage.id === currentStage
            const width = (stage.duration / 2150) * 100

            return (
              <div
                key={stage.id}
                className={`flex items-center justify-center transition-all ${
                  isComplete ? stage.color : isCurrent ? `${stage.color} animate-pulse` : "bg-muted/20"
                }`}
                style={{ width: `${width}%` }}
              >
                {width > 8 && (
                  <span className="truncate font-mono text-xs text-foreground/80">{stage.name}</span>
                )}
              </div>
            )
          })}
        </div>
        <div className="mt-1 flex justify-between font-mono text-xs text-muted-foreground">
          <span>0ms</span>
          <span className="text-destructive">CSS Download (render blocked)</span>
          <span>~2150ms</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button onClick={start} disabled={isRunning} className="flex-1">
          <Play className="mr-2 h-4 w-4" />
          Iniciar Pipeline
        </Button>
        <Button onClick={reset} variant="outline">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 rounded bg-destructive/10 p-3">
        <p className="font-mono text-xs text-destructive">
          <strong>Render Blocking:</strong> Note que durante os 800ms de CSS Download, 
          nenhum pixel pode ser pintado. O usuario ve uma tela branca. 
          Isso e equivalente a uma query SQL bloqueando toda a thread.
        </p>
      </div>
    </div>
  )
}
