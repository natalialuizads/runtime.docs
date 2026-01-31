"use client"

import React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw, Target } from "lucide-react"

interface LayoutElement {
  id: string
  name: string
  height: number
  loaded: boolean
  loadDelay: number
  finalHeight: number
  color: string
}

export function LayoutShiftDemo() {
  const [isRunning, setIsRunning] = useState(false)
  const [elements, setElements] = useState<LayoutElement[]>([])
  const [clickTarget, setClickTarget] = useState<{ top: number } | null>(null)
  const [missClicks, setMissClicks] = useState(0)
  const [clsScore, setClsScore] = useState(0)
  const [mode, setMode] = useState<"bad" | "good">("bad")

  const initElements = useCallback(() => {
    const badLayout: LayoutElement[] = [
      { id: "header", name: "Header", height: 60, loaded: true, loadDelay: 0, finalHeight: 120, color: "bg-chart-1" },
      { id: "banner", name: "Banner MFE", height: 0, loaded: false, loadDelay: 500, finalHeight: 200, color: "bg-chart-4" },
      { id: "content", name: "Content", height: 200, loaded: true, loadDelay: 0, finalHeight: 200, color: "bg-primary" },
      { id: "sidebar", name: "Sidebar MFE", height: 0, loaded: false, loadDelay: 800, finalHeight: 150, color: "bg-chart-3" },
      { id: "footer", name: "Footer", height: 40, loaded: true, loadDelay: 0, finalHeight: 40, color: "bg-muted" },
    ]

    const goodLayout: LayoutElement[] = [
      { id: "header", name: "Header", height: 120, loaded: true, loadDelay: 0, finalHeight: 120, color: "bg-chart-1" },
      { id: "banner", name: "Banner MFE (reserved)", height: 200, loaded: false, loadDelay: 500, finalHeight: 200, color: "bg-chart-4" },
      { id: "content", name: "Content", height: 200, loaded: true, loadDelay: 0, finalHeight: 200, color: "bg-primary" },
      { id: "sidebar", name: "Sidebar MFE (reserved)", height: 150, loaded: false, loadDelay: 800, finalHeight: 150, color: "bg-chart-3" },
      { id: "footer", name: "Footer", height: 40, loaded: true, loadDelay: 0, finalHeight: 40, color: "bg-muted" },
    ]

    return mode === "bad" ? badLayout : goodLayout
  }, [mode])

  const reset = useCallback(() => {
    setIsRunning(false)
    setElements(initElements())
    setClickTarget(null)
    setMissClicks(0)
    setClsScore(0)
  }, [initElements])

  useEffect(() => {
    reset()
  }, [mode, reset])

  const start = () => {
    reset()
    setIsRunning(true)
    
    // Set click target position (where the button should be)
    const contentTop = elements.slice(0, 3).reduce((sum, el) => sum + el.height, 0)
    setClickTarget({ top: contentTop + 50 })
  }

  useEffect(() => {
    if (!isRunning) return

    const timers: NodeJS.Timeout[] = []

    elements.forEach(el => {
      if (!el.loaded && el.loadDelay > 0) {
        const timer = setTimeout(() => {
          setElements(prev => prev.map(e => {
            if (e.id === el.id) {
              // Calculate CLS contribution
              if (mode === "bad") {
                const shift = (el.finalHeight - el.height) / 600 // viewport approximation
                setClsScore(prev => prev + shift * 0.5) // impact fraction
              }
              return { ...e, height: e.finalHeight, loaded: true }
            }
            return e
          }))
        }, el.loadDelay)
        timers.push(timer)
      }
    })

    return () => timers.forEach(clearTimeout)
  }, [isRunning, mode])

  const handleLayoutClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isRunning || !clickTarget) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const clickY = e.clientY - rect.top
    const targetY = clickTarget.top

    // Check if click missed the intended target due to layout shift
    if (Math.abs(clickY - targetY) > 30) {
      setMissClicks(prev => prev + 1)
    }
  }

  const totalHeight = elements.reduce((sum, el) => sum + el.height, 0)

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-mono text-sm font-semibold text-primary">Layout Shift (CLS) Demo</h3>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={mode === "bad" ? "destructive" : "outline"}
            onClick={() => setMode("bad")}
            className="h-7 text-xs"
          >
            Sem Reserva
          </Button>
          <Button
            size="sm"
            variant={mode === "good" ? "default" : "outline"}
            onClick={() => setMode("good")}
            className="h-7 text-xs"
          >
            Com Reserva
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded border border-border bg-background p-2 text-center">
          <div className="font-mono text-xs text-muted-foreground">CLS Score</div>
          <div className={`font-mono text-lg font-bold ${clsScore > 0.1 ? "text-destructive" : "text-accent"}`}>
            {clsScore.toFixed(3)}
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            {clsScore > 0.25 ? "Ruim" : clsScore > 0.1 ? "Precisa Melhorar" : "Bom"}
          </div>
        </div>
        <div className="rounded border border-border bg-background p-2 text-center">
          <div className="font-mono text-xs text-muted-foreground">Mis-clicks</div>
          <div className={`font-mono text-lg font-bold ${missClicks > 0 ? "text-destructive" : "text-foreground"}`}>
            {missClicks}
          </div>
        </div>
        <div className="rounded border border-border bg-background p-2 text-center">
          <div className="font-mono text-xs text-muted-foreground">Google Threshold</div>
          <div className="font-mono text-lg font-bold text-chart-4">{"< 0.1"}</div>
        </div>
      </div>

      {/* Layout Preview */}
      <div 
        className="relative mb-4 min-h-[400px] rounded border border-border bg-background overflow-hidden cursor-pointer"
        onClick={handleLayoutClick}
      >
        <div className="absolute right-2 top-2 z-10 rounded bg-background/80 px-2 py-1 font-mono text-xs text-muted-foreground">
          Viewport: 600px
        </div>
        
        {clickTarget && isRunning && (
          <div 
            className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 rounded bg-accent px-2 py-1 font-mono text-xs text-accent-foreground transition-all duration-300"
            style={{ top: clickTarget.top }}
          >
            <Target className="h-3 w-3" />
            Clique aqui!
          </div>
        )}

        <div className="flex flex-col">
          {elements.map(el => (
            <div
              key={el.id}
              className={`flex items-center justify-center border-b border-border/30 transition-all duration-300 ${el.color} ${
                !el.loaded ? "opacity-30" : "opacity-100"
              }`}
              style={{ height: el.height }}
            >
              <span className="font-mono text-xs text-foreground">
                {el.name} {!el.loaded && "(loading...)"}
                {el.height > 0 && <span className="text-muted-foreground ml-2">{el.height}px</span>}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button onClick={start} disabled={isRunning} className="flex-1">
          <Play className="mr-2 h-4 w-4" />
          Simular Carregamento
        </Button>
        <Button onClick={reset} variant="outline">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className={`mt-4 rounded p-3 ${mode === "bad" ? "bg-destructive/10" : "bg-accent/10"}`}>
        <p className={`font-mono text-xs ${mode === "bad" ? "text-destructive" : "text-accent"}`}>
          {mode === "bad" ? (
            <>
              <strong>Modo Sem Reserva:</strong> MFEs carregam assincronamente sem espaco reservado.
              Elementos aparecem e empurram o conteudo, causando layout shift.
              Tente clicar no botao durante a simulacao!
            </>
          ) : (
            <>
              <strong>Modo Com Reserva:</strong> Espacos pre-reservados para cada MFE.
              Mesmo que o conteudo carregue depois, nenhum shift acontece.
              Use CSS aspect-ratio ou min-height para reservar espaco.
            </>
          )}
        </p>
      </div>
    </div>
  )
}
