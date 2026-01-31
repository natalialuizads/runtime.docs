"use client"

import { AsciiDiagram } from "@/components/ascii-diagram"
import { CodeBlock } from "@/components/code-block"
import { TimelineVisual } from "@/components/timeline-visual"
import { LayoutShiftDemo } from "@/components/interactive/layout-shift-demo"

export function MFEProblemsSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <div className="mb-2 font-mono text-sm text-destructive">FASE 2.2</div>
        <h2 className="mb-4 text-3xl font-bold text-foreground">Impacto de uma Arquitetura Ruim</h2>
        <p className="text-lg text-muted-foreground">
          Dependency Hell, Layout Shift e Latencia de Orquestracao.
        </p>
      </div>

      {/* Dependency Hell */}
      <div className="mb-12">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
          <span className="font-mono text-destructive">01.</span>
          Dependency Hell
        </h3>
        
        <p className="mb-4 text-muted-foreground">
          O que acontece quando temos 3 versoes de React/Angular rodando:
        </p>

        <AsciiDiagram title="Dependency Duplication na Memoria">
{`MEMORIA DO BROWSER (Heap)

┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  MFE Header (Team A)     MFE Cart (Team B)    MFE Catalog (C) │
│  ┌──────────────────┐    ┌──────────────────┐ ┌─────────────┐ │
│  │ React 17.0.2     │    │ React 18.2.0     │ │ React 18.0  │ │
│  │ ~150KB parsed    │    │ ~180KB parsed    │ │ ~175KB      │ │
│  ├──────────────────┤    ├──────────────────┤ ├─────────────┤ │
│  │ Lodash 4.17.15   │    │ Lodash 4.17.21   │ │ Lodash full │ │
│  │ ~75KB            │    │ ~75KB            │ │ ~75KB       │ │
│  ├──────────────────┤    ├──────────────────┤ ├─────────────┤ │
│  │ Moment.js        │    │ date-fns         │ │ Moment.js   │ │
│  │ ~300KB           │    │ ~30KB            │ │ ~300KB      │ │
│  └──────────────────┘    └──────────────────┘ └─────────────┘ │
│                                                                │
│  TOTAL DUPLICADO:                                              │
│  React: 150 + 180 + 175 = 505KB (vs 180KB se compartilhado)   │
│  Lodash: 75 × 3 = 225KB (vs 75KB se compartilhado)            │
│  Date libs: 630KB (vs ~30KB se padronizado)                    │
│                                                                │
│  MEMORIA DESPERDICADA: ~1MB+ apenas em duplicatas             │
└────────────────────────────────────────────────────────────────┘`}
        </AsciiDiagram>

        <div className="my-6 rounded-lg border border-chart-4/30 bg-chart-4/10 p-4">
          <h4 className="mb-2 font-mono text-sm font-semibold text-chart-4">Analogia Backend</h4>
          <p className="text-sm text-chart-4/80">
            E como ter 3 pods Kubernetes onde cada um baixa e instala Node.js 
            do zero em vez de usar uma imagem base compartilhada. 
            Funciona, mas e um desperdicio massivo de recursos.
          </p>
        </div>
      </div>

      {/* Layout Shift */}
      <div className="mb-12">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
          <span className="font-mono text-destructive">02.</span>
          Layout Shift (CLS)
        </h3>
        
        <p className="mb-4 text-muted-foreground">
          Como o carregamento assincrono de modulos causa saltos visuais:
        </p>

        <AsciiDiagram title="Cumulative Layout Shift">
{`TIMELINE DE CARREGAMENTO

T=0ms    Shell carrega, reserva espacos
         ┌────────────────────────────────┐
         │  [Header: 60px]                │
         │  [    Conteudo vazio    ]      │
         │  [Footer: 40px]                │
         └────────────────────────────────┘

T=200ms  MFE Header carrega (tinha mais conteudo!)
         ┌────────────────────────────────┐
         │  [Header: 120px] ← DOBROU!     │  ← SHIFT!
         │  [    Conteudo vazio    ]      │  ← Empurrado pra baixo
         │  [Footer: 40px]                │
         └────────────────────────────────┘
         
         Usuario estava clicando em "Login"
         Agora clicou em "Carrinho" sem querer!

T=500ms  MFE Banner promocional injeta no meio
         ┌────────────────────────────────┐
         │  [Header: 120px]               │
         │  [BANNER: 200px] ← NOVO!       │  ← SHIFT!
         │  [    Conteudo    ]            │  ← Empurrado de novo
         │  [Footer: 40px]                │
         └────────────────────────────────┘

CLS Score: 0.45 (RUIM - Google penaliza > 0.1)`}
        </AsciiDiagram>

        <TimelineVisual
          title="Impacto do CLS na UX"
          maxDuration={100}
          items={[
            { label: "CLS = 0.05 (Bom)", duration: 10, color: "accent" },
            { label: "CLS = 0.15 (Okay)", duration: 35, color: "primary" },
            { label: "CLS = 0.25 (Ruim)", duration: 60, color: "destructive" },
            { label: "CLS = 0.45 (Terrivel)", duration: 100, color: "destructive", blocked: true },
          ]}
        />

        <div className="mt-6">
          <h4 className="mb-4 font-mono text-sm font-semibold text-foreground">
            Experimente o Layout Shift
          </h4>
          <LayoutShiftDemo />
        </div>
      </div>

      {/* Orquestracao e Latencia */}
      <div className="mb-12">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
          <span className="font-mono text-destructive">03.</span>
          Orquestracao e Latencia
        </h3>
        
        <p className="mb-4 text-muted-foreground">
          O Shell (o "API Gateway" do front) pode se tornar um gargalo:
        </p>

        <AsciiDiagram title="Shell como Gargalo">
{`                    SHELL (Orquestrador)
                           │
                           ▼
         ┌─────────────────┴─────────────────┐
         │      Carrega manifesto.json       │
         │           ~100ms RTT              │
         └─────────────────┬─────────────────┘
                           │
                           ▼
         ┌─────────────────┴─────────────────┐
         │   Resolve dependencias de MFEs    │
         │          ~50ms CPU                │
         └─────────────────┬─────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
     ┌──────────┐    ┌──────────┐    ┌──────────┐
     │ Fetch    │    │ Fetch    │    │ Fetch    │
     │ MFE A    │    │ MFE B    │    │ MFE C    │
     │ ~200ms   │    │ ~300ms   │    │ ~150ms   │
     └────┬─────┘    └────┬─────┘    └────┬─────┘
          │               │               │
          ▼               ▼               ▼
     ┌──────────┐    ┌──────────┐    ┌──────────┐
     │ Parse +  │    │ Parse +  │    │ Parse +  │
     │ Execute  │    │ Execute  │    │ Execute  │
     │ ~100ms   │    │ ~150ms   │    │ ~80ms    │
     └──────────┘    └──────────┘    └──────────┘

TEMPO TOTAL SEM OTIMIZACAO:
100ms (manifest) + 50ms (resolve) + 300ms (slowest fetch) 
+ 150ms (slowest parse) = ~600ms

COM PRE-FETCHING E CACHE:
0ms (cached manifest) + 0ms (cached resolve) + 50ms (cache hit)
+ 150ms (parse) = ~200ms

GANHO: 3x mais rapido`}
        </AsciiDiagram>

        <CodeBlock language="javascript" filename="shell-optimizations.js">
{`// PROBLEMA: Waterfall de requisicoes
async function loadMFEs() {
  const manifest = await fetch('/manifest.json'); // Espera
  const mfes = resolveDeps(manifest);             // Espera
  await Promise.all(mfes.map(loadMFE));           // Finalmente paralelo
}

// SOLUCAO: Pre-fetch + Cache
// No HTML, antes do JS principal:
<link rel="modulepreload" href="/mfe-header.js">
<link rel="modulepreload" href="/mfe-cart.js">
<link rel="preload" href="/manifest.json" as="fetch">

// No Shell:
const manifestPromise = fetch('/manifest.json'); // Ja iniciou!

// Module Federation (Webpack 5):
// Dependencias compartilhadas carregam UMA vez
// MFEs "linkam" em runtime (como DLLs)`}
        </CodeBlock>
      </div>

      {/* Morte por Mil Cortes */}
      <div className="rounded-lg border-2 border-destructive/50 bg-destructive/10 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-destructive">
          Morte por Mil Cortes
        </h3>
        <p className="mb-4 text-sm text-destructive/80">
          Cada MFE adicionando 100ms de tempo de CPU resulta em um site que parece "pesado":
        </p>
        <TimelineVisual
          maxDuration={800}
          items={[
            { label: "Shell init", duration: 50, color: "muted" },
            { label: "MFE Header (+100ms)", duration: 150, color: "primary" },
            { label: "MFE Nav (+100ms)", duration: 250, color: "primary" },
            { label: "MFE Content (+100ms)", duration: 350, color: "primary" },
            { label: "MFE Sidebar (+100ms)", duration: 450, color: "destructive" },
            { label: "MFE Footer (+100ms)", duration: 550, color: "destructive" },
            { label: "MFE Analytics (+100ms)", duration: 650, color: "destructive" },
            { label: "TOTAL", duration: 800, color: "destructive", blocked: true },
          ]}
        />
        <p className="mt-4 text-sm text-foreground font-medium">
          7 MFEs × 100ms = 700ms+ de bloqueio da Main Thread.
          O usuario sente o site "engasgando".
        </p>
      </div>
    </section>
  )
}
