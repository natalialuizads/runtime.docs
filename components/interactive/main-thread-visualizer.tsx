"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Play, RotateCcw, Cpu, Layers, PaintBucket } from "lucide-react"

interface Task {
  id: string
  name: string
  type: "js" | "dom" | "layout" | "paint"
  duration: number
  status: "pending" | "running" | "complete"
}

const initialTasks: Task[] = [
  { id: "1", name: "Parse HTML", type: "dom", duration: 800, status: "pending" },
  { id: "2", name: "Execute JS", type: "js", duration: 1200, status: "pending" },
  { id: "3", name: "Recalculate Styles", type: "dom", duration: 400, status: "pending" },
  { id: "4", name: "Layout", type: "layout", duration: 600, status: "pending" },
  { id: "5", name: "Paint", type: "paint", duration: 300, status: "pending" },
  { id: "6", name: "Handle Click", type: "js", duration: 100, status: "pending" },
]

export function MainThreadVisualizer() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [currentTaskIndex, setCurrentTaskIndex] = useState(-1)
  const [isRunning, setIsRunning] = useState(false)
  const [userClicked, setUserClicked] = useState(false)
  const [clickBlocked, setClickBlocked] = useState(false)
  const [totalTime, setTotalTime] = useState(0)

  const getTypeColor = (type: Task["type"]) => {
    switch (type) {
      case "js": return "bg-primary"
      case "dom": return "bg-accent"
      case "layout": return "bg-chart-4"
      case "paint": return "bg-chart-3"
    }
  }

  const getTypeIcon = (type: Task["type"]) => {
    switch (type) {
      case "js": return <Cpu className="h-4 w-4" />
      case "dom": return <Layers className="h-4 w-4" />
      case "layout": return <Layers className="h-4 w-4" />
      case "paint": return <PaintBucket className="h-4 w-4" />
    }
  }

  const runTasks = useCallback(async () => {
    setIsRunning(true)
    setTotalTime(0)
    let time = 0
    
    for (let i = 0; i < tasks.length; i++) {
      setCurrentTaskIndex(i)
      setTasks(prev => prev.map((t, idx) => 
        idx === i ? { ...t, status: "running" } : t
      ))
      
      // Simula a duração da tarefa
      const duration = tasks[i].duration
      time += duration
      await new Promise(resolve => setTimeout(resolve, duration))
      setTotalTime(time)
      
      setTasks(prev => prev.map((t, idx) => 
        idx === i ? { ...t, status: "complete" } : t
      ))
    }
    
    setCurrentTaskIndex(-1)
    setIsRunning(false)
  }, [tasks])

  const handleUserClick = () => {
    if (isRunning && currentTaskIndex >= 0 && tasks[currentTaskIndex].type === "js") {
      setClickBlocked(true)
      setTimeout(() => setClickBlocked(false), 1000)
    } else {
      setUserClicked(true)
      setTimeout(() => setUserClicked(false), 300)
    }
  }

  const reset = () => {
    setTasks(initialTasks)
    setCurrentTaskIndex(-1)
    setIsRunning(false)
    setUserClicked(false)
    setClickBlocked(false)
    setTotalTime(0)
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h4 className="font-mono text-sm font-semibold text-foreground">
            Visualizador da Main Thread
          </h4>
          <p className="text-xs text-muted-foreground">
            Observe como JS, DOM e Layout competem pela mesma CPU
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runTasks} disabled={isRunning} size="sm" className="gap-2">
            <Play className="h-4 w-4" />
            Executar
          </Button>
          <Button onClick={reset} variant="outline" size="sm" className="gap-2 bg-transparent">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Thread Diagram */}
      <div className="mb-6 rounded-lg border border-border bg-background p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          <span className="font-mono text-xs text-muted-foreground">MAIN THREAD</span>
          {isRunning && (
            <span className="ml-auto font-mono text-xs text-primary">
              Executando: {tasks[currentTaskIndex]?.name}
            </span>
          )}
        </div>

        {/* Task Queue */}
        <div className="flex flex-wrap gap-2">
          {tasks.map((task, idx) => (
            <div
              key={task.id}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 transition-all duration-300",
                task.status === "running" && "border-primary bg-primary/20 scale-105",
                task.status === "complete" && "border-accent/50 bg-accent/10 opacity-60",
                task.status === "pending" && "border-border bg-secondary/50"
              )}
            >
              <div className={cn("rounded p-1", getTypeColor(task.type))}>
                {getTypeIcon(task.type)}
              </div>
              <div>
                <div className="font-mono text-xs font-medium text-foreground">
                  {task.name}
                </div>
                <div className="font-mono text-xs text-muted-foreground">
                  {task.duration}ms
                </div>
              </div>
              {task.status === "running" && (
                <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* User Interaction Area */}
      <div className="mb-6 rounded-lg border border-dashed border-border p-4">
        <p className="mb-3 text-xs text-muted-foreground">
          Tente clicar no botão durante a execução do JavaScript:
        </p>
        <Button
          onClick={handleUserClick}
          variant={clickBlocked ? "destructive" : userClicked ? "default" : "outline"}
          className="transition-all"
        >
          {clickBlocked ? "BLOQUEADO! 🔒" : userClicked ? "Clique Registrado! ✓" : "Clique Aqui"}
        </Button>
        {clickBlocked && (
          <p className="mt-2 text-xs text-destructive">
            A Main Thread está ocupada executando JS. Seu clique foi ignorado!
          </p>
        )}
      </div>

      {/* Timeline */}
      <div className="rounded-lg border border-border bg-background p-4">
        <div className="mb-2 flex justify-between text-xs text-muted-foreground">
          <span>Timeline</span>
          <span>{totalTime}ms total</span>
        </div>
        <div className="flex h-8 overflow-hidden rounded-lg bg-secondary">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "flex items-center justify-center transition-all duration-300",
                getTypeColor(task.type),
                task.status === "complete" ? "opacity-100" : "opacity-20"
              )}
              style={{ 
                width: `${(task.duration / 3400) * 100}%`,
              }}
            >
              <span className="font-mono text-xs text-foreground/80 truncate px-1">
                {task.duration}ms
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded bg-primary" />
            <span className="text-muted-foreground">JavaScript</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded bg-accent" />
            <span className="text-muted-foreground">DOM</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded bg-chart-4" />
            <span className="text-muted-foreground">Layout</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded bg-chart-3" />
            <span className="text-muted-foreground">Paint</span>
          </div>
        </div>
      </div>
    </div>
  )
}
