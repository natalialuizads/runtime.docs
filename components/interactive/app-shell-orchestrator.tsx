"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Box,
  CheckCircle2,
  Loader2,
  Play,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

interface MFEStatus {
  id: string;
  name: string;
  status: "idle" | "loading" | "loaded" | "error";
  loadTime: number;
  size: string;
  team: string;
  priority: "critical" | "high" | "low";
}

const initialMFEs: MFEStatus[] = [
  {
    id: "shell",
    name: "App Shell",
    status: "idle",
    loadTime: 50,
    size: "15KB",
    team: "Platform",
    priority: "critical",
  },
  {
    id: "header",
    name: "Header",
    status: "idle",
    loadTime: 120,
    size: "45KB",
    team: "Platform",
    priority: "critical",
  },
  {
    id: "sidebar",
    name: "Sidebar",
    status: "idle",
    loadTime: 200,
    size: "80KB",
    team: "Navigation",
    priority: "high",
  },
  {
    id: "dashboard",
    name: "Dashboard",
    status: "idle",
    loadTime: 350,
    size: "150KB",
    team: "Analytics",
    priority: "high",
  },
  {
    id: "ads",
    name: "Publicidade",
    status: "idle",
    loadTime: 800,
    size: "200KB",
    team: "Marketing",
    priority: "low",
  },
  {
    id: "chat",
    name: "Chat Widget",
    status: "idle",
    loadTime: 400,
    size: "120KB",
    team: "Support",
    priority: "low",
  },
];

export function AppShellOrchestrator() {
  const [mfes, setMfes] = useState<MFEStatus[]>(initialMFEs);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [strategy, setStrategy] = useState<
    "sequential" | "parallel" | "priority"
  >("priority");
  const [simulateError, setSimulateError] = useState(false);

  const reset = () => {
    setMfes(initialMFEs);
    setCurrentTime(0);
    setIsRunning(false);
  };

  const startLoading = () => {
    reset();
    setIsRunning(true);
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 50;

        setMfes((currentMfes) => {
          return currentMfes.map((mfe) => {
            // Determine when this MFE should start loading based on strategy
            let startTime = 0;

            if (strategy === "sequential") {
              const index = initialMFEs.findIndex((m) => m.id === mfe.id);
              startTime = initialMFEs
                .slice(0, index)
                .reduce((acc, m) => acc + m.loadTime, 0);
            } else if (strategy === "parallel") {
              startTime = mfe.id === "shell" ? 0 : 50; // Shell first, then all parallel
            } else {
              // Priority: critical first, then high, then low
              if (mfe.priority === "critical") startTime = 0;
              else if (mfe.priority === "high")
                startTime = 170; // After shell + header
              else startTime = 550; // After high priority
            }

            const shouldBeLoading = next >= startTime && mfe.status === "idle";
            const shouldBeLoaded =
              next >= startTime + mfe.loadTime && mfe.status === "loading";

            // Simulate error for ads if enabled
            if (simulateError && mfe.id === "ads" && shouldBeLoaded) {
              return { ...mfe, status: "error" };
            }

            if (shouldBeLoading) return { ...mfe, status: "loading" };
            if (shouldBeLoaded) return { ...mfe, status: "loaded" };
            return mfe;
          });
        });

        // Stop when all loaded or errored
        const allDone = mfes.every(
          (m) => m.status === "loaded" || m.status === "error",
        );
        if (next > 1500 || allDone) {
          setIsRunning(false);
        }

        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, strategy, simulateError, mfes]);

  const totalTime = mfes.reduce((acc, mfe) => {
    if (strategy === "sequential") return acc + mfe.loadTime;
    return Math.max(acc, mfe.loadTime);
  }, 0);

  const loadedCount = mfes.filter((m) => m.status === "loaded").length;
  const errorCount = mfes.filter((m) => m.status === "error").length;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="font-mono text-lg font-semibold text-foreground">
          App Shell: O API Gateway do Frontend
        </h3>
        <p className="text-sm text-muted-foreground">
          O Shell orquestra o carregamento dos MFEs, assim como um API Gateway
          roteia requests para microservicos.
        </p>
      </div>

      {/* Strategy Selector */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          {(["sequential", "parallel", "priority"] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setStrategy(s);
                reset();
              }}
              className={cn(
                "rounded-md px-3 py-1.5 font-mono text-xs transition-colors",
                strategy === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground",
              )}
            >
              {s === "sequential" && "Sequencial"}
              {s === "parallel" && "Paralelo"}
              {s === "priority" && "Por Prioridade"}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={simulateError}
            onChange={(e) => setSimulateError(e.target.checked)}
            className="rounded"
          />
          Simular erro no MFE "Publicidade"
        </label>
      </div>

      {/* Visual Orchestration */}
      <div className="mb-6 rounded-lg bg-secondary/30 p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-sm text-muted-foreground">
            Tempo: {currentTime}ms
          </span>
          <div className="flex gap-2">
            <Button size="sm" onClick={startLoading} disabled={isRunning}>
              <Play className="mr-1 h-3 w-3" />
              Iniciar
            </Button>
            <Button size="sm" variant="outline" onClick={reset}>
              <RefreshCw className="mr-1 h-3 w-3" />
              Reset
            </Button>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative mb-6 h-2 rounded-full bg-background">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all duration-100"
            style={{ width: `${Math.min((currentTime / 1200) * 100, 100)}%` }}
          />
        </div>

        {/* MFE Grid */}
        <div className="grid gap-3">
          {mfes.map((mfe) => (
            <div
              key={mfe.id}
              className={cn(
                "flex items-center gap-4 rounded-lg border p-3 transition-all",
                mfe.status === "idle" && "border-border bg-background/50",
                mfe.status === "loading" && "border-primary/50 bg-primary/5",
                mfe.status === "loaded" && "border-accent/50 bg-accent/5",
                mfe.status === "error" &&
                  "border-destructive/50 bg-destructive/5",
              )}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary">
                {mfe.status === "idle" && (
                  <Box className="h-4 w-4 text-muted-foreground" />
                )}
                {mfe.status === "loading" && (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                )}
                {mfe.status === "loaded" && (
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                )}
                {mfe.status === "error" && (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium text-foreground">
                    {mfe.name}
                  </span>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-xs",
                      mfe.priority === "critical" &&
                        "bg-destructive/20 text-destructive",
                      mfe.priority === "high" && "bg-chart-4/20 text-chart-4",
                      mfe.priority === "low" &&
                        "bg-muted text-muted-foreground",
                    )}
                  >
                    {mfe.priority}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  @{mfe.team} | {mfe.size} | {mfe.loadTime}ms
                </span>
              </div>

              {/* Load progress bar */}
              <div className="w-24">
                <div className="h-1.5 rounded-full bg-background">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      mfe.status === "loading" && "bg-primary animate-pulse",
                      mfe.status === "loaded" && "bg-accent",
                      mfe.status === "error" && "bg-destructive",
                    )}
                    style={{
                      width:
                        mfe.status === "idle"
                          ? "0%"
                          : mfe.status === "loading"
                            ? "60%"
                            : "100%",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy Explanation */}
      <div className="grid gap-4 md:grid-cols-3">
        <div
          className={cn(
            "rounded-lg border p-4",
            strategy === "sequential"
              ? "border-primary/50 bg-primary/5"
              : "border-border",
          )}
        >
          <h4 className="mb-2 font-mono text-sm font-semibold text-foreground">
            Sequencial
          </h4>
          <p className="text-xs text-muted-foreground">
            Um apos o outro. Simples mas lento. Como processar uma fila
            single-threaded.
          </p>
          <p className="mt-2 font-mono text-xs text-destructive">
            Tempo total: ~{initialMFEs.reduce((a, m) => a + m.loadTime, 0)}ms
          </p>
        </div>

        <div
          className={cn(
            "rounded-lg border p-4",
            strategy === "parallel"
              ? "border-primary/50 bg-primary/5"
              : "border-border",
          )}
        >
          <h4 className="mb-2 font-mono text-sm font-semibold text-foreground">
            Paralelo
          </h4>
          <p className="text-xs text-muted-foreground">
            Todos ao mesmo tempo. Rapido mas pode sobrecarregar. Como
            Promise.all().
          </p>
          <p className="mt-2 font-mono text-xs text-accent">
            Tempo total: ~{Math.max(...initialMFEs.map((m) => m.loadTime))}ms
          </p>
        </div>

        <div
          className={cn(
            "rounded-lg border p-4",
            strategy === "priority"
              ? "border-primary/50 bg-primary/5"
              : "border-border",
          )}
        >
          <h4 className="mb-2 font-mono text-sm font-semibold text-foreground">
            Por Prioridade
          </h4>
          <p className="text-xs text-muted-foreground">
            Critical primeiro, depois high, depois low. Como um Priority Queue.
          </p>
          <p className="mt-2 font-mono text-xs text-chart-4">
            First Paint: ~170ms | Full: ~1000ms
          </p>
        </div>
      </div>

      {/* Error Isolation Message */}
      {errorCount > 0 && (
        <div className="mt-6 rounded-lg border border-accent/30 bg-accent/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-chart-4" />
            <div>
              <h4 className="font-mono text-sm font-semibold text-chart-4">
                Graceful Degradation
              </h4>
              <p className="mt-1 text-sm text-foreground/80">
                O MFE de Publicidade falhou, mas {loadedCount} outros modulos
                continuam funcionando. É como ter um Circuit Breaker: o erro é
                isolado, a experiência do usuário não é completamente destruída.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
