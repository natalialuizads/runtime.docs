"use client"

import React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { AsciiDiagram } from "@/components/ascii-diagram"
import { Server, Globe, Smartphone, Zap, Database, Cloud, ArrowRight } from "lucide-react"

type ArchitectureType = "spa" | "ssr" | "webview" | "edge"

interface ArchitectureData {
  id: ArchitectureType
  name: string
  backendAnalogy: string
  icon: React.ElementType
  example: string
  color: string
  serverLoad: number
  infraComplexity: number
  seo: number
  latency: number
  description: string
  diagram: string
  prosBackend: string[]
  consBackend: string[]
}

const architectures: ArchitectureData[] = [
  {
    id: "spa",
    name: "SPA (Single Page Application)",
    backendAnalogy: "API Stateless + CDN",
    icon: Globe,
    example: "Gmail, Figma, Notion",
    color: "primary",
    serverLoad: 20,
    infraComplexity: 30,
    seo: 25,
    latency: 70,
    description: "O servidor entrega apenas arquivos estaticos (HTML/JS/CSS). Toda a logica roda no cliente. E como uma API REST pura: stateless, escalavel horizontalmente via CDN.",
    diagram: `┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│     CDN     │────▶│  Static     │
│  (Runtime)  │     │ (Edge Cache)│     │  Files      │
└─────────────┘     └─────────────┘     └─────────────┘
       │                                        
       │  API Calls (JSON)                      
       ▼                                        
┌─────────────┐     ┌─────────────┐              
│  REST API   │────▶│  Database   │              
│ (Stateless) │     │             │              
└─────────────┘     └─────────────┘`,
    prosBackend: [
      "Servidor nao processa HTML (zero CPU para render)",
      "Cache agressivo na CDN (TTL infinito para assets)",
      "Horizontal scaling trivial (so API)",
    ],
    consBackend: [
      "SEO depende de JavaScript (Googlebot precisa executar)",
      "Tempo para First Paint alto (download + parse + execute)",
      "Nao funciona sem JavaScript habilitado",
    ],
  },
  {
    id: "ssr",
    name: "SSR (Server-Side Rendering)",
    backendAnalogy: "PHP/JSP Moderno (Node.js)",
    icon: Server,
    example: "Amazon, Vercel, NY Times",
    color: "accent",
    serverLoad: 80,
    infraComplexity: 60,
    seo: 95,
    latency: 40,
    description: "O servidor renderiza HTML completo a cada request. E o modelo classico (PHP, JSP, Rails) mas com Node.js. Pense como um endpoint que retorna text/html ao inves de application/json.",
    diagram: `┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│   Node.js   │────▶│  Database   │
│  (Display)  │     │  (Render)   │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                   │                    
       │     HTML String   │                    
       └───────────────────┘                    
                                               
   Cada request = CPU no servidor (render)      
   Cache: Varnish/CDN com stale-while-revalidate`,
    prosBackend: [
      "SEO perfeito (HTML completo na resposta)",
      "First Paint rapido (HTML ja renderizado)",
      "Funciona sem JavaScript (graceful degradation)",
    ],
    consBackend: [
      "Cada request consome CPU do servidor",
      "Scaling mais caro (precisa de mais pods)",
      "TTFB aumenta com complexidade da pagina",
    ],
  },
  {
    id: "webview",
    name: "WebView (Hibrido)",
    backendAnalogy: "Docker Container do Browser",
    icon: Smartphone,
    example: "Nubank, Uber, Spotify (partes)",
    color: "chart-3",
    serverLoad: 30,
    infraComplexity: 70,
    seo: 0,
    latency: 50,
    description: "Um container isolado do browser rodando dentro do app nativo. E literalmente um 'Docker do Chrome' embedded. O app nativo e o host, a WebView e o container.",
    diagram: `┌─────────────────────────────────────────────┐
│              NATIVE APP (Host)              │
│  ┌───────────────────────────────────────┐  │
│  │           WEBVIEW (Container)         │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │      Chromium Engine            │  │  │
│  │  │  ┌───────────────────────────┐  │  │  │
│  │  │  │    Sua Web App (SPA)      │  │  │  │
│  │  │  └───────────────────────────┘  │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
│     Bridge: postMessage / JS Interface      │
└─────────────────────────────────────────────┘`,
    prosBackend: [
      "Reutiliza codigo web no mobile",
      "Deploy sem App Store (atualizacao OTA)",
      "Um time pode manter web + mobile",
    ],
    consBackend: [
      "Performance limitada pelo WebView engine",
      "Bridge nativo-web adiciona latencia",
      "Debug mais complexo (dois runtimes)",
    ],
  },
  {
    id: "edge",
    name: "Edge Computing",
    backendAnalogy: "Lambda@Edge / Cloudflare Workers",
    icon: Zap,
    example: "NY Times, Shopify, Netflix",
    color: "chart-4",
    serverLoad: 10,
    infraComplexity: 85,
    seo: 90,
    latency: 15,
    description: "Logica executando na CDN, antes de chegar no servidor de origem. E como ter uma Lambda rodando em cada POP (Point of Presence) do CloudFront. Latencia minima.",
    diagram: `                    ┌─────────────┐
                    │   Origin    │
                    │   Server    │
                    └──────┬──────┘
                           │ (fallback)
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
┌───┴───┐            ┌─────┴─────┐           ┌────┴────┐
│ Edge  │            │   Edge    │           │  Edge   │
│ SP    │            │   NYC     │           │  Tokyo  │
│ <10ms │            │   <10ms   │           │  <10ms  │
└───┬───┘            └─────┬─────┘           └────┬────┘
    │                      │                      │
┌───┴───┐            ┌─────┴─────┐           ┌────┴────┐
│ User  │            │   User    │           │  User   │
│Brazil │            │   USA     │           │  Japan  │
└───────┘            └───────────┘           └─────────┘`,
    prosBackend: [
      "Latencia minima (codigo perto do usuario)",
      "Carga no origin server drasticamente reduzida",
      "Personalizacao sem hit no backend",
    ],
    consBackend: [
      "Runtime limitado (sem Node.js completo)",
      "Debug em producao e complexo",
      "Cold start em cada POP",
    ],
  },
]

export function ArchitectureSpectrumSection() {
  const [selected, setSelected] = useState<ArchitectureType>("spa")
  const current = architectures.find((a) => a.id === selected)!

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
          <span className="font-mono text-xs text-primary">ARQUITETURAS</span>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-foreground md:text-3xl">
          O Espectro das Arquiteturas Frontend
        </h2>
        <p className="mt-2 text-muted-foreground">
          Cada arquitetura e um trade-off. Assim como voce escolhe entre SQL e NoSQL,
          aqui voce escolhe onde o rendering acontece.
        </p>
      </div>

      {/* Architecture Selector */}
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {architectures.map((arch) => {
          const Icon = arch.icon
          return (
            <button
              key={arch.id}
              onClick={() => setSelected(arch.id)}
              className={cn(
                "group relative flex flex-col items-center gap-2 rounded-lg border p-4 transition-all",
                selected === arch.id
                  ? `border-${arch.color}/50 bg-${arch.color}/10`
                  : "border-border bg-card hover:border-border/80 hover:bg-secondary/50"
              )}
            >
              <Icon
                className={cn(
                  "h-8 w-8 transition-colors",
                  selected === arch.id ? `text-${arch.color}` : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-center font-mono text-xs",
                  selected === arch.id ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {arch.id.toUpperCase()}
              </span>
              {selected === arch.id && (
                <div className={`absolute -bottom-px left-1/2 h-0.5 w-12 -translate-x-1/2 bg-${arch.color}`} />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected Architecture Detail */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">{current.name}</h3>
            <p className="mt-1 font-mono text-sm text-primary">
              Analogia Backend: {current.backendAnalogy}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Exemplos: {current.example}
            </p>
          </div>
        </div>

        <p className="mb-6 text-foreground/90">{current.description}</p>

        <AsciiDiagram title="Fluxo de Request">{current.diagram}</AsciiDiagram>

        {/* Metrics */}
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <MetricBar label="Carga no Servidor" value={current.serverLoad} color="destructive" />
          <MetricBar label="Complexidade Infra" value={current.infraComplexity} color="chart-4" />
          <MetricBar label="SEO Score" value={current.seo} color="accent" />
          <MetricBar
            label="Latencia (invertido)"
            value={100 - current.latency}
            color="primary"
            invertedLabel="Menor = Melhor"
          />
        </div>

        {/* Pros and Cons */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
            <h4 className="mb-3 font-mono text-sm font-semibold text-accent">
              Vantagens (Backend View)
            </h4>
            <ul className="space-y-2">
              {current.prosBackend.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="mt-1 text-accent">+</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <h4 className="mb-3 font-mono text-sm font-semibold text-destructive">
              Desvantagens (Backend View)
            </h4>
            <ul className="space-y-2">
              {current.consBackend.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="mt-1 text-destructive">-</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Decision Matrix */}
      <div className="mt-8 overflow-x-auto">
        <h3 className="mb-4 font-mono text-lg font-semibold text-foreground">
          Matriz de Decisao (Backend Perspective)
        </h3>
        <table className="w-full border-collapse font-mono text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="p-3 text-left text-muted-foreground">Arquitetura</th>
              <th className="p-3 text-center text-muted-foreground">Server CPU</th>
              <th className="p-3 text-center text-muted-foreground">Infra</th>
              <th className="p-3 text-center text-muted-foreground">SEO</th>
              <th className="p-3 text-center text-muted-foreground">Latency</th>
              <th className="p-3 text-left text-muted-foreground">Use Case</th>
            </tr>
          </thead>
          <tbody>
            {architectures.map((arch) => (
              <tr
                key={arch.id}
                className={cn(
                  "border-b border-border/50 transition-colors",
                  selected === arch.id ? "bg-secondary/50" : "hover:bg-secondary/30"
                )}
                onClick={() => setSelected(arch.id)}
              >
                <td className="p-3 font-semibold text-foreground">{arch.id.toUpperCase()}</td>
                <td className="p-3 text-center">
                  <ScoreIndicator value={arch.serverLoad} inverted />
                </td>
                <td className="p-3 text-center">
                  <ScoreIndicator value={arch.infraComplexity} inverted />
                </td>
                <td className="p-3 text-center">
                  <ScoreIndicator value={arch.seo} />
                </td>
                <td className="p-3 text-center">
                  <ScoreIndicator value={100 - arch.latency} />
                </td>
                <td className="p-3 text-muted-foreground">{arch.example.split(",")[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function MetricBar({
  label,
  value,
  color,
  invertedLabel,
}: {
  label: string
  value: number
  color: string
  invertedLabel?: string
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-foreground">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full bg-${color} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
      {invertedLabel && (
        <p className="mt-1 text-xs text-muted-foreground/60">{invertedLabel}</p>
      )}
    </div>
  )
}

function ScoreIndicator({ value, inverted = false }: { value: number; inverted?: boolean }) {
  const getColor = () => {
    const score = inverted ? 100 - value : value
    if (score >= 70) return "text-accent"
    if (score >= 40) return "text-chart-4"
    return "text-destructive"
  }

  const getLabel = () => {
    const score = inverted ? 100 - value : value
    if (score >= 70) return "Otimo"
    if (score >= 40) return "Medio"
    return "Alto"
  }

  return <span className={cn("text-xs", getColor())}>{inverted ? (value <= 30 ? "Baixo" : value <= 60 ? "Medio" : "Alto") : getLabel()}</span>
}
