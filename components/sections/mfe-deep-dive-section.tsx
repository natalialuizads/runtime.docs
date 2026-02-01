"use client"

import { CodeBlock } from "@/components/code-block"
import { DynamicDiagram } from "@/components/dynamic-diagram"
import { AppShellOrchestrator } from "@/components/interactive/app-shell-orchestrator"
import { MonolithBreaker } from "@/components/interactive/monolith-breaker"
import { SpotifySquadModel } from "@/components/interactive/spotify-squad-model"
import { Box, Globe, Layers, Layout } from "lucide-react"

export function MFEDeepDiveSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2">
          <span className="font-mono text-xs text-accent">DEEP DIVE</span>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-foreground md:text-3xl">
          Microfrontends: Microservicos para o Frontend
        </h2>
        <p className="mt-2 text-muted-foreground">
          Se voce entende microservicos, voce ja entende 80% de MFEs. Vamos traduzir.
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
              backend: "Microservico",
              frontend: "Microfrontend",
              explanation: "Unidade de deploy independente com escopo definido",
            },
            {
              backend: "API Gateway",
              frontend: "App Shell",
              explanation: "Ponto de entrada que roteia e orquestra os modulos",
            },
            {
              backend: "Service Mesh (Istio)",
              frontend: "Module Federation",
              explanation: "Permite que modulos se descubram e carreguem em runtime",
            },
            {
              backend: "Circuit Breaker",
              frontend: "Error Boundary",
              explanation: "Isola falhas para que um erro nao derrube tudo",
            },
            {
              backend: "Container (Docker)",
              frontend: "Shadow DOM / Iframe",
              explanation: "Isolamento de escopo (CSS, JS globals)",
            },
            {
              backend: "Kubernetes",
              frontend: "Single-SPA",
              explanation: "Orquestrador que gerencia lifecycle dos modulos",
            },
            {
              backend: "gRPC / Event Bus",
              frontend: "Custom Events / postMessage",
              explanation: "Comunicacao entre modulos desacoplados",
            },
            {
              backend: "Shared Library (npm)",
              frontend: "Shared Dependency",
              explanation: "Codigo comum reutilizado (design system, utils)",
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
          1. Quebrando o Monolito
        </h3>
        <p className="mb-6 text-muted-foreground">
          Assim como voce extrai microservicos de um monolito backend, aqui voce
          extrai MFEs de um monolito frontend. Clique nos modulos e simule falhas:
        </p>
        <MonolithBreaker />
      </div>

      {/* App Shell Orchestrator */}
      <div className="mb-12">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          2. O App Shell como API Gateway
        </h3>
        <p className="mb-6 text-muted-foreground">
          O Shell e responsavel por carregar e orquestrar MFEs. Ele decide a ordem,
          prioridade e estrategia de carregamento. Compare as estrategias:
        </p>
        <AppShellOrchestrator />
      </div>

      {/* Architecture Diagram */}
      <div className="mb-12">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          3. Arquitetura de Referencia
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

      {/* Spotify Squad Model */}
      <div className="mb-12">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          4. Caso de Estudo: Modelo Spotify
        </h3>
        <p className="mb-6 text-muted-foreground">
          O Spotify popularizou o modelo de Squads verticais. Cada squad e dona de uma
          fatia completa: UI + API + Database. Explore a interface:
        </p>
        <SpotifySquadModel />
      </div>

      {/* Communication Patterns */}
      <div className="mb-12">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          5. Padroes de Comunicacao
        </h3>
        <p className="mb-6 text-muted-foreground">
          MFEs precisam se comunicar sem criar acoplamento. Os padroes sao os mesmos
          do backend: eventos, contratos e estado compartilhado minimo.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="mb-3 font-mono text-sm font-semibold text-accent">
              Event Bus (Pub/Sub)
            </h4>
            <CodeBlock language="typescript" filename="event-bus.ts">
{`// MFE A: Publica evento
eventBus.emit('cart:item-added', { 
  productId: '123', 
  quantity: 1 
});

// MFE B: Escuta evento
eventBus.on('cart:item-added', (data) => {
  updateCartCount(data);
});

// Backend equivalente: RabbitMQ / Kafka`}
            </CodeBlock>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="mb-3 font-mono text-sm font-semibold text-primary">
              Shared State (Com Cautela)
            </h4>
            <CodeBlock language="typescript" filename="shared-state.ts">
{`// Estado minimo compartilhado
interface SharedState {
  user: { id: string; name: string } | null;
  theme: 'light' | 'dark';
  locale: string;
}

// NAO compartilhe estado de negocio!
// Cada MFE deve ter seu proprio estado

// Backend equivalente: Redis para sessao`}
            </CodeBlock>
          </div>
        </div>
      </div>

      {/* Anti-patterns */}
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-destructive">
          Anti-Patterns: O Que NAO Fazer
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
              description: "MFE A altera .button e quebra o botao do MFE B.",
              fix: "CSS Modules, Scoped CSS, ou prefixos",
            },
            {
              title: "Window.globals",
              description: "Usar window.myState para compartilhar dados. Memory leak garantido.",
              fix: "Event Bus ou State Container dedicado",
            },
            {
              title: "Versoes Conflitantes",
              description: "React 17 + React 18 + React 19 na mesma pagina.",
              fix: "Module Federation com shared dependencies",
            },
          ].map((pattern, i) => (
            <div key={i} className="rounded-lg bg-background/50 p-4">
              <h4 className="mb-1 font-mono text-sm font-semibold text-destructive">
                {pattern.title}
              </h4>
              <p className="mb-2 text-sm text-foreground/70">{pattern.description}</p>
              <p className="text-xs text-accent">Solucao: {pattern.fix}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
