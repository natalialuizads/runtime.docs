"use client"

import { CodeBlock } from "@/components/code-block"
import { DynamicDiagram } from "@/components/dynamic-diagram"
import { AppShellOrchestrator } from "@/components/interactive/app-shell-orchestrator"
import { MonolithBreaker } from "@/components/interactive/monolith-breaker"
import { Box, Globe, Layers, Layout } from "lucide-react"

export function MFEDeepDiveSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2">
          <span className="font-mono text-xs text-accent">DEEP DIVE</span>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-foreground md:text-3xl">
          Microfrontends: Microsserviços para o Frontend
        </h2>
        <p className="mt-2 text-muted-foreground">
          Se você entende microsserviços, você já entende 80% de MFEs. Vamos traduzir.
        </p>
      </div>

      {/* Backend to Frontend Translation */}
      <div className="mb-12 rounded-xl border border-border bg-card p-6">
        <h3 className="mb-6 font-mono text-lg font-semibold text-foreground">
          Tradutor Backend {"<->"} Frontend
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              backend: "Microsserviço",
              frontend: "Microfrontend",
              explanation: "Unidade de deploy independente com escopo definido",
            },
            {
              backend: "API Gateway",
              frontend: "App Shell",
              explanation: "Ponto de entrada que roteia e orquestra os módulos",
            },
            {
              backend: "Service Mesh (Istio)",
              frontend: "Module Federation",
              explanation: "Permite que módulos se descubram e carreguem em runtime",
            },
            {
              backend: "Circuit Breaker",
              frontend: "Error Boundary",
              explanation: "Isola falhas para que um erro não derrube tudo",
            },
            {
              backend: "Container (Docker)",
              frontend: "Shadow DOM / Iframe",
              explanation: "Isolamento de escopo (CSS, JS globals)",
            },
            {
              backend: "Kubernetes",
              frontend: "Single-SPA",
              explanation: "Orquestrador que gerencia lifecycle dos módulos",
            },
            {
              backend: "gRPC / Event Bus",
              frontend: "Custom Events / postMessage",
              explanation: "Comunicação entre módulos desacoplados",
            },
            {
              backend: "Shared Library (npm)",
              frontend: "Shared Dependency",
              explanation: "Código comum reutilizado (design system, utils)",
            },
          ].map((item, i) => (
            <div key={i} className="rounded-lg border border-border bg-secondary/30 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded bg-primary/20 px-2 py-0.5 font-mono text-xs text-primary">
                  {item.backend}
                </span>
                <span className="text-muted-foreground">=</span>
                <span className="rounded bg-accent/20 px-2 py-0.5 font-mono text-xs text-accent">
                  {item.frontend}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{item.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Monolith Breaker Interactive */}
      <div className="mb-12">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          1. Quebrando o Monólito
        </h3>
        <p className="mb-6 text-muted-foreground">
          Assim como você extrai microsserviços de um monólito backend, aqui você
          extrai MFEs de um monólito frontend. Clique nos módulos e simule falhas:
        </p>
        <MonolithBreaker />
      </div>

      {/* App Shell Orchestrator */}
      <div className="mb-12">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          2. O App Shell como API Gateway
        </h3>
        <p className="mb-6 text-muted-foreground">
          O Shell é responsável por carregar e orquestrar MFEs. Ele decide a ordem,
          prioridade e estratégia de carregamento. Compare as estratégias:
        </p>
        <AppShellOrchestrator />
      </div>

      {/* Architecture Diagram */}
      <div className="mb-12">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          3. Arquitetura de Referência
        </h3>
        <DynamicDiagram 
          title="MFE Architecture (Backend View)"
          nodes={[
            { id: 'cdn', label: 'CDN (Edge)', icon: Globe, x: 50, y: 15, color: 'border-chart-4' },
            { id: 'shell', label: 'App Shell', icon: Layout, x: 50, y: 40, color: 'border-primary' },
            { id: 'mfe1', label: 'MFE: Header', icon: Box, x: 20, y: 65 },
            { id: 'mfe2', label: 'MFE: Dashboard', icon: Box, x: 50, y: 65 },
            { id: 'mfe3', label: 'MFE: Checkout', icon: Box, x: 80, y: 65 },
            { id: 'deps', label: 'Shared Deps', icon: Layers, x: 50, y: 85, color: 'border-accent' },
          ]}
          edges={[
            { from: 'cdn', to: 'shell', animated: true },
            { from: 'shell', to: 'mfe1', animated: true },
            { from: 'shell', to: 'mfe2', animated: true },
            { from: 'shell', to: 'mfe3', animated: true },
            { from: 'mfe1', to: 'deps' },
            { from: 'mfe2', to: 'deps' },
            { from: 'mfe3', to: 'deps' },
          ]}
        />
      </div>

      {{/* Anti-patterns */}
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-destructive">
          Anti-Patterns: O Que NÃO Fazer
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: "Shared Database",
              description: "MFEs acessando o mesmo endpoint/estado diretamente. Cria acoplamento.",
              fix: "Use Event Bus ou API dedicada",
            },
            {
              title: "CSS Global",
              description: "MFE A altera .button e quebra o botão do MFE B.",
              fix: "CSS Modules, Scoped CSS, ou prefixos",
            },
            {
              title: "Window.globals",
              description: "Usar window.myState para compartilhar dados. Memory leak garantido.",
              fix: "Event Bus ou State Container dedicado",
            },
            {
              title: "Versões Conflitantes",
              description: "React 17 + React 18 + React 19 na mesma página.",
              fix: "Module Federation com shared dependencies",
            },
          ].map((pattern, i) => (
            <div key={i} className="rounded-lg bg-background/50 p-4">
              <h4 className="mb-1 font-mono text-sm font-semibold text-destructive">
                {pattern.title}
              </h4>
              <p className="mb-2 text-sm text-foreground/70">{pattern.description}</p>
              <p className="text-xs text-accent">Solução: {pattern.fix}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
