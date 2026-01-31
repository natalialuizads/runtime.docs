"use client"

import { AsciiDiagram } from "@/components/ascii-diagram"
import { ComparisonTable } from "@/components/comparison-table"
import { MFEMemorySimulator } from "@/components/interactive/mfe-memory-simulator"

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

      <AsciiDiagram title="Backend: Microservicos Isolados">
{`BACKEND MICROSERVICES (Silos Isolados)

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Container A   │  │   Container B   │  │   Container C   │
│  ┌───────────┐  │  │  ┌───────────┐  │  │  ┌───────────┐  │
│  │  Service  │  │  │  │  Service  │  │  │  │  Service  │  │
│  │   Auth    │  │  │  │   Cart    │  │  │  │  Catalog  │  │
│  └───────────┘  │  │  └───────────┘  │  │  └───────────┘  │
│                 │  │                 │  │                 │
│  Memory: 512MB  │  │  Memory: 256MB  │  │  Memory: 1GB    │
│  Node: v18      │  │  Python 3.11    │  │  Go 1.21        │
│                 │  │                 │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
        │                    │                    │
        └────────────────────┴────────────────────┘
                             │
                      [API Gateway]
                             │
                      Network I/O`}
      </AsciiDiagram>

      <p className="my-6 text-foreground font-medium">
        No Frontend, MFEs dividem TUDO:
      </p>

      <AsciiDiagram title="Frontend: MFEs Compartilham Runtime">
{`FRONTEND MICROFRONTENDS (Shared Runtime)

┌─────────────────────────────────────────────────────────────────┐
│                      BROWSER WINDOW                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    SINGLE DOM TREE                        │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │  │
│  │  │  MFE A  │  │  MFE B  │  │  MFE C  │  │  Shell  │      │  │
│  │  │  Auth   │  │  Cart   │  │ Catalog │  │  (Host) │      │  │
│  │  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘      │  │
│  │       │            │            │            │            │  │
│  │       └────────────┴────────────┴────────────┘            │  │
│  │                         │                                 │  │
│  └─────────────────────────┼─────────────────────────────────┘  │
│                            │                                    │
│  ┌─────────────────────────┼─────────────────────────────────┐  │
│  │                   SHARED MEMORY                           │  │
│  │  window.*, document.*, localStorage, sessionStorage       │  │
│  │  Global CSS, Event Listeners, Prototype Chain             │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│                      SINGLE MAIN THREAD                         │
└─────────────────────────────────────────────────────────────────┘`}
      </AsciiDiagram>

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
