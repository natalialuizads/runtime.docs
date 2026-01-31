"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Play, Square, RotateCcw } from "lucide-react"

interface Task {
  id: number
  name: string
  duration: number
  type: "sync" | "async" | "user"
  status: "pending" | "running" | "complete"
  startTime?: number
}

export function EventLoopSimulator() {
  const [isRunning, setIsRunning] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [userClicks, setUserClicks] = useState<{ time: number; responded: boolean }[]>([])
  const [elapsedTime, setElapsedTime] = useState(0)
  const [mode, setMode] = useState<"blocking" | "chunked">("blocking")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  const resetSimulation = useCallback(() => {
    setIsRunning(false)
    setTasks([])
    setCurrentTask(null)
    setUserClicks([])
    setElapsedTime(0)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  const startSimulation = useCallback(() => {
    resetSimulation()
    setIsRunning(true)
    startTimeRef.current = Date.now()

    const initialTasks: Task[] = mode === "blocking" 
      ? [
          { id: 1, name: "fetch('/api/user')", duration: 200, type: "async", status: "pending" },
          { id: 2, name: "heavyComputation()", duration: 800, type: "sync", status: "pending" },
          { id: 3, name: "renderUI()", duration: 100, type: "sync", status: "pending" },
        ]
      : [
          { id: 1, name: "fetch('/api/user')", duration: 200, type: "async", status: "pending" },
          { id: 2, name: "chunk1()", duration: 150, type: "sync", status: "pending" },
          { id: 3, name: "chunk2()", duration: 150, type: "sync", status: "pending" },
          { id: 4, name: "chunk3()", duration: 150, type: "sync", status: "pending" },
          { id: 5, name: "chunk4()", duration: 150, type: "sync", status: "pending" },
          { id: 6, name: "renderUI()", duration: 100, type: "sync", status: "pending" },
        ]

    setTasks(initialTasks)
  }, [mode, resetSimulation])

  useEffect(() => {
    if (!isRunning || tasks.length === 0) return

    const processTasks = () => {
      setElapsedTime(Date.now() - startTimeRef.current)

      const pendingTask = tasks.find(t => t.status === "pending")
      
      if (!pendingTask) {
        setIsRunning(false)
        return
      }

      if (!currentTask) {
        const updatedTask = { ...pendingTask, status: "running" as const, startTime: Date.now() }
        setCurrentTask(updatedTask)
        setTasks(prev => prev.map(t => t.id === pendingTask.id ? updatedTask : t))
      } else if (currentTask.startTime && Date.now() - currentTask.startTime >= currentTask.duration) {
        const completedTask = { ...currentTask, status: "complete" as const }
        setTasks(prev => prev.map(t => t.id === currentTask.id ? completedTask : t))
        setCurrentTask(null)
      }
    }

    intervalRef.current = setInterval(processTasks, 16)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, tasks, currentTask])

  const handleUserClick = () => {
    if (!isRunning) return
    
    const clickTime = Date.now() - startTimeRef.current
    const isBlocked = currentTask?.type === "sync"
    
    setUserClicks(prev => [...prev, { time: clickTime, responded: !isBlocked }])

    if (!isBlocked) {
      setTasks(prev => [
        ...prev.filter(t => t.status !== "complete" || t.id !== prev.find(pt => pt.status === "running")?.id),
        { id: Date.now(), name: "handleClick()", duration: 50, type: "user", status: "pending" }
      ])
    }
  }

  const getTaskColor = (task: Task) => {
    if (task.status === "complete") return "bg-accent/50"
    if (task.status === "running") {
      if (task.type === "sync") return "bg-destructive animate-pulse"
      return "bg-primary animate-pulse"
    }
    return "bg-muted"
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-mono text-sm font-semibold text-primary">Event Loop Simulator</h3>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={mode === "blocking" ? "default" : "outline"}
            onClick={() => { setMode("blocking"); resetSimulation() }}
            className="h-7 text-xs"
          >
            Blocking
          </Button>
          <Button
            size="sm"
            variant={mode === "chunked" ? "default" : "outline"}
            onClick={() => { setMode("chunked"); resetSimulation() }}
            className="h-7 text-xs"
          >
            Chunked
          </Button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="rounded border border-border bg-background p-3">
          <div className="mb-2 font-mono text-xs text-muted-foreground">Task Queue</div>
          <div className="space-y-1">
            {tasks.map(task => (
              <div
                key={task.id}
                className={`flex items-center justify-between rounded px-2 py-1 font-mono text-xs ${getTaskColor(task)}`}
              >
                <span className="text-foreground">{task.name}</span>
                <span className="text-muted-foreground">{task.duration}ms</span>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="py-2 text-center font-mono text-xs text-muted-foreground">
                Vazio
              </div>
            )}
          </div>
        </div>

        <div className="rounded border border-border bg-background p-3">
          <div className="mb-2 font-mono text-xs text-muted-foreground">Main Thread</div>
          <div className="flex h-16 items-center justify-center rounded border border-dashed border-border">
            {currentTask ? (
              <div className={`rounded px-3 py-2 text-center ${getTaskColor(currentTask)}`}>
                <div className="font-mono text-xs text-foreground">{currentTask.name}</div>
                <div className="font-mono text-xs text-muted-foreground">
                  {currentTask.type === "sync" ? "BLOCKING" : "async"}
                </div>
              </div>
            ) : (
              <span className="font-mono text-xs text-muted-foreground">Idle</span>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4 rounded border border-border bg-background p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">User Interaction Zone</span>
          <span className="font-mono text-xs text-primary">{elapsedTime}ms</span>
        </div>
        <Button
          onClick={handleUserClick}
          disabled={!isRunning}
          className="w-full bg-transparent"
          variant="outline"
        >
          Clique aqui durante a simulacao
        </Button>
        <div className="mt-2 flex flex-wrap gap-1">
          {userClicks.map((click, i) => (
            <span
              key={i}
              className={`rounded px-2 py-0.5 font-mono text-xs ${
                click.responded 
                  ? "bg-accent/20 text-accent" 
                  : "bg-destructive/20 text-destructive"
              }`}
            >
              {click.time}ms {click.responded ? "OK" : "BLOCKED"}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={startSimulation} disabled={isRunning} className="flex-1">
          <Play className="mr-2 h-4 w-4" />
          Iniciar
        </Button>
        <Button onClick={resetSimulation} variant="outline">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 rounded bg-muted/50 p-3">
        <p className="font-mono text-xs text-muted-foreground">
          {mode === "blocking" ? (
            <>
              <strong className="text-destructive">Modo Blocking:</strong> heavyComputation() bloqueia por 800ms. 
              Cliques durante esse periodo serao ignorados.
            </>
          ) : (
            <>
              <strong className="text-accent">Modo Chunked:</strong> Computacao dividida em chunks de 150ms. 
              Entre cada chunk, cliques podem ser processados.
            </>
          )}
        </p>
      </div>
    </div>
  )
}
