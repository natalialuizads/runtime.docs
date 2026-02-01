"use client"

import { ComparisonTable } from "@/components/comparison-table"
import { DynamicDiagram } from "@/components/dynamic-diagram"
import { MFEMemorySimulator } from "@/components/interactive/mfe-memory-simulator"
import { Box, Container, Cpu, Monitor, Server } from "lucide-react"

export function MFEIntroSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <div className="mb-2 font-mono text-sm text-accent">FASE 2.1</div>
        <h2 className="mb-4 text-3xl font-bold text-foreground">MFE nao e Microservico</h2>
        <p className="text-lg text-muted-foreground">
          Sistemas Distribuidos no Client - onde as analogias de backend quebram.
        </p>
      </div>

      <p className="mb-6 text-muted-foreground">
        No Backend, microservicos rodam em <strong className="text-foreground">silos isolados</strong>. 
        Cada um tem seu proprio container, memoria e escopo.
      </p>

      <DynamicDiagram 
        title="Backend: Microservicos Isolados"
        nodes={[
          { id: 'ca', label: 'Container A (Auth)', icon: Container, x: 20, y: 30, color: 'border-blue-500/50' },
          { id: 'cb', label: 'Container B (Cart)', icon: Container, x: 50, y: 30, color: 'border-yellow-500/50' },
          { id: 'cc', label: 'Container C (Catalog)', icon: Container, x: 80, y: 30, color: 'border-green-500/50' },
          { id: 'gw', label: 'API Gateway', icon: Server, x: 50, y: 80 },
        ]}
        edges={[
          { from: 'ca', to: 'gw', animated: true, label: 'JSON' },
          { from: 'cb', to: 'gw', animated: true },
          { from: 'cc', to: 'gw', animated: true },
        ]}
      />

      <p className="my-6 text-foreground font-medium">
        No Frontend, MFEs dividem TUDO:
      </p>

      <DynamicDiagram 
        title="Frontend: MFEs Compartilham Runtime"
        nodes={[
          { id: 'win', label: 'Browser Window', icon: Monitor, x: 50, y: 50, color: 'border-primary' },
          { id: 'mfe1', label: 'MFE Auth', icon: Box, x: 20, y: 30 },
          { id: 'mfe2', label: 'MFE Cart', icon: Box, x: 50, y: 30 },
          { id: 'mfe3', label: 'MFE Catalog', icon: Box, x: 80, y: 30 },
          { id: 'memo', label: 'Shared Memory (Heap)', icon: Cpu, x: 50, y: 80, color: 'border-accent' },
        ]}
        edges={[
          { from: 'mfe1', to: 'win' },
          { from: 'mfe2', to: 'win' },
          { from: 'mfe3', to: 'win' },
          { from: 'win', to: 'memo', animated: true, label: 'Shared State' },
        ]}
      />

      <ComparisonTable
        headers={["Backend Microservices", "Frontend Microfrontends"]}
        rows={[
          ["Containers isolados", "Mesmo processo/window"],
          ["Memoria separada", "Memoria compartilhada (heap)"],
          ["Network I/O entre services", "Funcoes no mesmo escopo"],
          ["Crash de um nao afeta outros", "Erro de um pode crashar tudo"],
          ["Escala horizontal (mais pods)", "Preso ao hardware do usuario"],
          ["Versoes diferentes de runtime", "MESMO runtime JS/DOM"],
        ]}
      />

      <div className="my-8 rounded-lg border border-destructive/30 bg-destructive/10 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-destructive">
          O Problema Fundamental
        </h3>
        <p className="text-sm text-destructive/80">
          No backend, se o Service A usa Node 16 e o Service B usa Node 20, <strong>nao ha conflito</strong>.
        </p>
        <p className="mt-4 text-sm text-foreground font-medium">
          No frontend, se MFE A carrega React 17 e MFE B carrega React 18, 
          voce tem <strong className="text-destructive">duas copias do React na memoria</strong>, 
          competindo pelo mesmo DOM.
        </p>
      </div>

      <div className="my-12 border-t border-border pt-8">
        <h3 className="mb-4 text-xl font-bold text-foreground">Simule o Consumo de Memoria</h3>
        <p className="mb-6 text-muted-foreground">
          Adicione MFEs e suas dependencias para ver o impacto na memoria. Ative o 
          Module Federation para ver como dependencias compartilhadas reduzem o consumo:
        </p>
        <MFEMemorySimulator />
      </div>
    </section>
  )
}
