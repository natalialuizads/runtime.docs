"use client"

import React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Package,
  Layers,
  ShoppingCart,
  User,
  CreditCard,
  Search,
  Bell,
  Settings,
  ArrowRight,
  Scissors,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"

interface Module {
  id: string
  name: string
  icon: React.ElementType
  team: string
  color: string
  extracted: boolean
  crashed: boolean
}

const initialModules: Module[] = [
  { id: "header", name: "Header/Nav", icon: Layers, team: "Platform", color: "primary", extracted: false, crashed: false },
  { id: "search", name: "Search", icon: Search, team: "Discovery", color: "accent", extracted: false, crashed: false },
  { id: "catalog", name: "Catalog", icon: Package, team: "Product", color: "chart-3", extracted: false, crashed: false },
  { id: "cart", name: "Cart", icon: ShoppingCart, team: "Checkout", color: "chart-4", extracted: false, crashed: false },
  { id: "user", name: "User Profile", icon: User, team: "Identity", color: "chart-5", extracted: false, crashed: false },
  { id: "payment", name: "Payment", icon: CreditCard, team: "Payments", color: "destructive", extracted: false, crashed: false },
  { id: "notifications", name: "Notifications", icon: Bell, team: "Engagement", color: "primary", extracted: false, crashed: false },
  { id: "settings", name: "Settings", icon: Settings, team: "Platform", color: "muted-foreground", extracted: false, crashed: false },
]

export function MonolithBreaker() {
  const [modules, setModules] = useState<Module[]>(initialModules)
  const [mode, setMode] = useState<"monolith" | "mfe">("monolith")
  const [crashedModule, setCrashedModule] = useState<string | null>(null)

  const extractedCount = modules.filter((m) => m.extracted).length
  const isFullyExtracted = extractedCount === modules.length

  const toggleExtract = (id: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, extracted: !m.extracted } : m))
    )
  }

  const extractAll = () => {
    setModules((prev) => prev.map((m) => ({ ...m, extracted: true })))
    setMode("mfe")
  }

  const reset = () => {
    setModules(initialModules)
    setMode("monolith")
    setCrashedModule(null)
  }

  const simulateCrash = (id: string) => {
    setCrashedModule(id)
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, crashed: true } : m))
    )
  }

  const clearCrash = () => {
    setCrashedModule(null)
    setModules((prev) => prev.map((m) => ({ ...m, crashed: false })))
  }

  // In monolith mode, if any module crashes, ALL crash
  const allCrashed = mode === "monolith" && crashedModule !== null

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-mono text-lg font-semibold text-foreground">
            Monolith {"->"} Microfrontends
          </h3>
          <p className="text-sm text-muted-foreground">
            Clique nos modulos para extrair. Depois simule uma falha.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            <RefreshCw className="mr-1 h-3 w-3" />
            Reset
          </Button>
          {!isFullyExtracted && (
            <Button size="sm" onClick={extractAll}>
              <Scissors className="mr-1 h-3 w-3" />
              Extrair Todos
            </Button>
          )}
        </div>
      </div>

      {/* Architecture Visualization */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monolith Side */}
        <div
          className={cn(
            "rounded-lg border-2 p-4 transition-all",
            mode === "monolith" ? "border-destructive/50 bg-destructive/5" : "border-border bg-secondary/30"
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-mono text-sm font-semibold text-foreground">
              Monolito Frontend
            </h4>
            <span className="rounded bg-destructive/20 px-2 py-0.5 font-mono text-xs text-destructive">
              Single Deploy
            </span>
          </div>

          <div className="relative rounded-lg border border-dashed border-border bg-background/50 p-4">
            {allCrashed && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-destructive/90">
                <div className="text-center">
                  <AlertTriangle className="mx-auto h-8 w-8 text-destructive-foreground" />
                  <p className="mt-2 font-mono text-sm text-destructive-foreground">
                    APLICACAO INTEIRA CAIU
                  </p>
                  <p className="text-xs text-destructive-foreground/80">
                    Single Point of Failure
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {modules
                .filter((m) => !m.extracted)
                .map((module) => {
                  const Icon = module.icon
                  return (
                    <button
                      key={module.id}
                      onClick={() => toggleExtract(module.id)}
                      className={cn(
                        "group flex flex-col items-center gap-1 rounded-md border border-border/50 bg-secondary/50 p-2 transition-all hover:border-primary/50 hover:bg-primary/10",
                        module.crashed && "animate-pulse border-destructive bg-destructive/20"
                      )}
                    >
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      <span className="text-center text-xs text-muted-foreground">
                        {module.name}
                      </span>
                    </button>
                  )
                })}
            </div>

            {modules.filter((m) => !m.extracted).length === 0 && (
              <p className="py-8 text-center font-mono text-sm text-muted-foreground">
                Monolito vazio - todos os modulos extraidos
              </p>
            )}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Um deploy = todos os modulos juntos. Uma falha = tudo cai.
          </p>
        </div>

        {/* MFE Side */}
        <div
          className={cn(
            "rounded-lg border-2 p-4 transition-all",
            mode === "mfe" || extractedCount > 0
              ? "border-accent/50 bg-accent/5"
              : "border-border bg-secondary/30"
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-mono text-sm font-semibold text-foreground">
              Microfrontends
            </h4>
            <span className="rounded bg-accent/20 px-2 py-0.5 font-mono text-xs text-accent">
              Deploys Independentes
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {modules
              .filter((m) => m.extracted)
              .map((module) => {
                const Icon = module.icon
                return (
                  <div
                    key={module.id}
                    className={cn(
                      "group relative flex flex-col items-center gap-1 rounded-md border p-2 transition-all",
                      module.crashed
                        ? "border-destructive bg-destructive/20"
                        : "border-accent/30 bg-accent/10"
                    )}
                  >
                    {module.crashed ? (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    ) : (
                      <Icon className="h-4 w-4 text-accent" />
                    )}
                    <span
                      className={cn(
                        "text-center text-xs",
                        module.crashed ? "text-destructive" : "text-accent"
                      )}
                    >
                      {module.name}
                    </span>
                    <span className="text-xs text-muted-foreground/60">
                      @{module.team}
                    </span>

                    {/* Crash/Recover buttons */}
                    <div className="absolute -right-1 -top-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {module.crashed ? (
                        <button
                          onClick={() => clearCrash()}
                          className="rounded-full bg-accent p-1"
                          title="Recuperar"
                        >
                          <RefreshCw className="h-3 w-3 text-accent-foreground" />
                        </button>
                      ) : (
                        <button
                          onClick={() => simulateCrash(module.id)}
                          className="rounded-full bg-destructive p-1"
                          title="Simular Crash"
                        >
                          <AlertTriangle className="h-3 w-3 text-destructive-foreground" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>

          {extractedCount === 0 && (
            <p className="py-8 text-center font-mono text-sm text-muted-foreground">
              Clique nos modulos do monolito para extrair
            </p>
          )}

          <p className="mt-3 text-xs text-muted-foreground">
            Cada modulo: deploy independente, time owner, isolamento de falha.
          </p>
        </div>
      </div>

      {/* Crash Isolation Demo */}
      {crashedModule && mode === "mfe" && (
        <div className="mt-6 rounded-lg border border-accent/30 bg-accent/10 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <h4 className="font-mono text-sm font-semibold text-accent">
                Isolamento de Falha Funcionando
              </h4>
              <p className="mt-1 text-sm text-foreground/80">
                O modulo <strong>{modules.find((m) => m.id === crashedModule)?.name}</strong> crashou,
                mas os outros continuam funcionando. No backend, isso e como ter Circuit Breakers
                entre microservicos.
              </p>
              <Button variant="outline" size="sm" className="mt-3 bg-transparent" onClick={clearCrash}>
                Recuperar Modulo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 rounded-lg bg-secondary/30 p-4">
        <div className="text-center">
          <p className="font-mono text-2xl font-bold text-foreground">
            {modules.length - extractedCount}
          </p>
          <p className="text-xs text-muted-foreground">No Monolito</p>
        </div>
        <div className="text-center">
          <p className="font-mono text-2xl font-bold text-accent">{extractedCount}</p>
          <p className="text-xs text-muted-foreground">Microfrontends</p>
        </div>
        <div className="text-center">
          <p className="font-mono text-2xl font-bold text-primary">
            {extractedCount > 0 ? extractedCount : 1}
          </p>
          <p className="text-xs text-muted-foreground">Pipelines CI/CD</p>
        </div>
      </div>
    </div>
  )
}
