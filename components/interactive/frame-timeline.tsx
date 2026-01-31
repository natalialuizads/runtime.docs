"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { Play, Pause, RotateCcw } from "lucide-react"

interface Frame {
  id: number
  jsTime: number
  status: "smooth" | "jank" | "dropped"
}

const FRAME_BUDGET = 16.67 // ms for 60fps
const FRAME_COUNT = 20

export function FrameTimeline() {
  const [jsBlockingTime, setJsBlockingTime] = useState(10)
  const [frames, setFrames] = useState<Frame[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)
  const animationRef = useRef<HTMLDivElement>(null)

  const generateFrames = (blockingTime: number): Frame[] => {
    const result: Frame[] = []
    let accumulatedJank = 0
    
    for (let i = 0; i < FRAME_COUNT; i++) {
      // Frame 5-7 tem o blocking JS
      const isBlockingFrame = i >= 5 && i <= 5 + Math.floor(blockingTime / FRAME_BUDGET)
      
      if (isBlockingFrame && accumulatedJank < blockingTime) {
        const frameJsTime = Math.min(FRAME_BUDGET + (blockingTime - accumulatedJank), blockingTime)
        accumulatedJank += FRAME_BUDGET
        
        if (frameJsTime > FRAME_BUDGET * 2) {
          result.push({ id: i, jsTime: frameJsTime, status: "dropped" })
        } else if (frameJsTime > FRAME_BUDGET) {
          result.push({ id: i, jsTime: frameJsTime, status: "jank" })
        } else {
          result.push({ id: i, jsTime: frameJsTime, status: "smooth" })
        }
      } else {
        result.push({ id: i, jsTime: Math.random() * 8 + 2, status: "smooth" })
      }
    }
    
    return result
  }

  useEffect(() => {
    setFrames(generateFrames(jsBlockingTime))
  }, [jsBlockingTime])

  const runAnimation = async () => {
    setIsRunning(true)
    setCurrentFrame(0)
    
    for (let i = 0; i < FRAME_COUNT; i++) {
      setCurrentFrame(i)
      const frame = frames[i]
      
      // Simula a duração do frame
      await new Promise(resolve => 
        setTimeout(resolve, frame.status === "dropped" ? 50 : FRAME_BUDGET)
      )
    }
    
    setIsRunning(false)
  }

  const droppedFrames = frames.filter(f => f.status === "dropped").length
  const jankFrames = frames.filter(f => f.status === "jank").length

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6">
        <h4 className="font-mono text-sm font-semibold text-foreground">
          Simulador de Frame Budget (60 FPS)
        </h4>
        <p className="text-xs text-muted-foreground">
          Ajuste o tempo de JS blocking e veja o impacto nos frames
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-muted-foreground">Tempo de JS Blocking:</span>
            <span className="font-mono text-foreground">{jsBlockingTime}ms</span>
          </div>
          <Slider
            value={[jsBlockingTime]}
            onValueChange={([v]) => setJsBlockingTime(v)}
            min={5}
            max={100}
            step={5}
            disabled={isRunning}
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>5ms (suave)</span>
            <span className="text-chart-4">16.67ms (limite)</span>
            <span className="text-destructive">100ms (muito jank)</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={runAnimation} disabled={isRunning} size="sm" className="gap-2">
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isRunning ? "Executando..." : "Rodar Animação"}
          </Button>
          <Button 
            onClick={() => setFrames(generateFrames(jsBlockingTime))} 
            variant="outline" 
            size="sm"
            disabled={isRunning}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Animation Preview */}
      <div className="mb-6 overflow-hidden rounded-lg border border-border bg-background p-4">
        <p className="mb-2 text-xs text-muted-foreground">Preview da Animação:</p>
        <div className="relative h-16 rounded bg-secondary">
          <div
            ref={animationRef}
            className={cn(
              "absolute top-1/2 h-8 w-8 -translate-y-1/2 rounded-lg bg-primary transition-all",
              isRunning && frames[currentFrame]?.status === "dropped" && "opacity-50"
            )}
            style={{
              left: `${(currentFrame / FRAME_COUNT) * 100}%`,
              transition: frames[currentFrame]?.status === "dropped" 
                ? "none" 
                : "left 16.67ms linear"
            }}
          />
        </div>
        {frames[currentFrame]?.status === "dropped" && isRunning && (
          <p className="mt-2 text-xs text-destructive">Frame dropped! A animação pulou.</p>
        )}
        {frames[currentFrame]?.status === "jank" && isRunning && (
          <p className="mt-2 text-xs text-chart-4">Jank! Frame demorou mais que 16.67ms.</p>
        )}
      </div>

      {/* Frame Timeline */}
      <div className="mb-4">
        <div className="mb-2 flex justify-between text-xs text-muted-foreground">
          <span>Timeline de Frames</span>
          <span>Budget: 16.67ms/frame</span>
        </div>
        <div className="flex gap-1">
          {frames.map((frame, idx) => (
            <div
              key={frame.id}
              className={cn(
                "relative flex-1 rounded transition-all",
                frame.status === "smooth" && "bg-accent",
                frame.status === "jank" && "bg-chart-4",
                frame.status === "dropped" && "bg-destructive",
                currentFrame === idx && isRunning && "ring-2 ring-primary ring-offset-2 ring-offset-card"
              )}
              style={{ height: `${Math.min(frame.jsTime * 2, 60)}px` }}
            >
              {frame.status === "dropped" && (
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-destructive-foreground">
                  X
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>Frame 1</span>
          <span>Frame {FRAME_COUNT}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 rounded-lg border border-border bg-background p-4">
        <div className="text-center">
          <div className="font-mono text-2xl font-bold text-accent">
            {FRAME_COUNT - droppedFrames - jankFrames}
          </div>
          <div className="text-xs text-muted-foreground">Frames Suaves</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-2xl font-bold text-chart-4">{jankFrames}</div>
          <div className="text-xs text-muted-foreground">Frames com Jank</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-2xl font-bold text-destructive">{droppedFrames}</div>
          <div className="text-xs text-muted-foreground">Frames Dropados</div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-6 text-xs">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-accent" />
          <span className="text-muted-foreground">{"<"} 16.67ms (Suave)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-chart-4" />
          <span className="text-muted-foreground">{">"} 16.67ms (Jank)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-destructive" />
          <span className="text-muted-foreground">{">"} 33ms (Dropado)</span>
        </div>
      </div>
    </div>
  )
}
