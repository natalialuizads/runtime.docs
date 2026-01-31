"use client"

import { AsciiDiagram } from "@/components/ascii-diagram"
import { TimelineVisual } from "@/components/timeline-visual"
import { BundleCalculator } from "@/components/interactive/bundle-calculator"

export function BundleSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <div className="mb-2 font-mono text-sm text-primary">FASE 1.3</div>
        <h2 className="mb-4 text-3xl font-bold text-foreground">O Custo do Bundle (Cold Start)</h2>
        <p className="text-lg text-muted-foreground">
          Diferencie download de tempo de execucao - carregar JS nao e so I/O de rede.
        </p>
      </div>

      <p className="mb-6 text-muted-foreground">
        No backend, voce conhece o <strong className="text-foreground">Cold Start</strong> de Lambdas/Cloud Functions:
      </p>

      <AsciiDiagram title="Lambda Cold Start">
{`Lambda Cold Start:
┌─────────────────────────────────────────────────────────┐
│  [Download Container] → [Init Runtime] → [Execute]     │
│       ~200ms              ~300ms           ~50ms        │
│                                                         │
│  Total: ~550ms (primeira execucao)                     │
└─────────────────────────────────────────────────────────┘`}
      </AsciiDiagram>

      <p className="my-6 text-foreground font-medium">
        JavaScript no Browser tem o mesmo problema:
      </p>

      <AsciiDiagram title="JS Bundle Cold Start">
{`JS Bundle "Cold Start":
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  [Network Download]   O arquivo viaja pela rede         │
│       ~200ms          (I/O bound - depende da conexao)  │
│          │                                              │
│          ▼                                              │
│  [Decompress/Decode]  Descompacta gzip/brotli           │
│       ~20ms                                             │
│          │                                              │
│          ▼                                              │
│  [Parse/Tokenize]     Le o texto JS, gera AST          │
│       ~100ms          (CPU bound!)                      │
│          │                                              │
│          ▼                                              │
│  [Compile/Optimize]   V8 compila para bytecode         │
│       ~150ms          (CPU bound!)                      │
│          │                                              │
│          ▼                                              │
│  [Execute]            Roda o codigo                     │
│       ~50ms           (CPU bound!)                      │
│                                                         │
│  Total: ~520ms para um bundle de 500KB                 │
└─────────────────────────────────────────────────────────┘`}
      </AsciiDiagram>

      <div className="my-8 rounded-lg border border-destructive/30 bg-destructive/10 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-destructive">O Erro Comum</h3>
        <blockquote className="border-l-2 border-destructive pl-4 italic text-destructive/80">
          "Minifiquei meu JS de 2MB para 500KB. Problema resolvido!"
        </blockquote>
        <p className="mt-4 text-sm text-destructive/80">
          <strong>Errado.</strong> Voce resolveu apenas o I/O de rede. 
          O tempo de <strong>Parse + Compile + Execute</strong> ainda e proporcional ao codigo.
        </p>
      </div>

      <h3 className="mb-4 mt-8 font-mono text-lg font-semibold text-foreground">
        Comparacao de Custos por Tipo de Arquivo
      </h3>

      <AsciiDiagram title="200KB: JPEG vs JavaScript">
{`┌─────────────────────────────────────────────────────────┐
│           CUSTO DE 200KB POR TIPO DE ARQUIVO           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  200KB JPEG:   [Download]────────► [Decode GPU] → Done │
│                  ~150ms               ~5ms              │
│                                                         │
│  200KB JS:     [Download]──► [Parse]──► [Compile]──►   │
│                  ~150ms       ~80ms      ~120ms         │
│                                                         │
│                             ──► [Execute] → Done       │
│                                   ~50ms                 │
│                                                         │
│  JPEG Total:  ~155ms                                   │
│  JS Total:    ~400ms  (2.5x mais caro!)               │
└─────────────────────────────────────────────────────────┘`}
      </AsciiDiagram>

      <TimelineVisual
        title="Mesmo bundle de 1MB, hardware diferente:"
        maxDuration={2000}
        items={[
          { label: "MacBook Pro M3", duration: 200, color: "accent" },
          { label: "iPhone 15", duration: 350, color: "accent" },
          { label: "Pixel 7", duration: 500, color: "primary" },
          { label: "Android mid-range", duration: 2000, color: "destructive", blocked: true },
        ]}
      />

      <div className="my-8 rounded-lg border border-chart-4/30 bg-chart-4/10 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-chart-4">Por que isso importa?</h3>
        <p className="text-sm text-chart-4/80">
          No backend, se sua Lambda demora para iniciar, voce aumenta a memoria ou 
          provisiona "Warm instances".
        </p>
        <p className="mt-4 text-sm text-foreground font-medium">
          No frontend, voce nao controla o hardware do usuario.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Aquele bundle de 1MB que roda em 200ms no seu MacBook Pro pode demorar{" "}
          <strong className="text-destructive">3 segundos</strong> em um celular Android mid-range.
        </p>
      </div>

      <div className="my-12 border-t border-border pt-8">
        <h3 className="mb-4 text-xl font-bold text-foreground">Calcule o Custo Real</h3>
        <p className="mb-6 text-muted-foreground">
          Ajuste o tamanho do bundle, dispositivo e conexao para ver o impacto real no tempo
          de carregamento. Note como o custo de CPU supera o custo de rede em dispositivos mais fracos:
        </p>
        <BundleCalculator />
      </div>
    </section>
  )
}
