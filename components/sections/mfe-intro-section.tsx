"use client";

import { CodeBlock } from "@/components/code-block";
import { ComparisonTable } from "@/components/comparison-table";
import { DynamicDiagram } from "@/components/dynamic-diagram";
import { LayoutShiftDemo } from "@/components/interactive/layout-shift-demo";
import { MFEMemorySimulator } from "@/components/interactive/mfe-memory-simulator";
import { TimelineVisual } from "@/components/timeline-visual";
import { Box, Container, Cpu, Monitor, Server, Timer } from "lucide-react";

export function MFEIntroSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <h2 className="mb-4 text-3xl font-bold text-foreground">
          MFE não é Microserviço
        </h2>
        <p className="text-lg text-muted-foreground">
          Sistemas Distribuídos no Cliente - onde as analogias de backend
          quebram.
        </p>
      </div>

      <p className="mb-6 text-muted-foreground">
        No Backend, microserviços rodam em{" "}
        <strong className="text-foreground">silos isolados</strong>. Cada um tem
        seu próprio container, memória e escopo.
      </p>

      <DynamicDiagram
        title="Backend: Microserviços Isolados"
        nodes={[
          {
            id: "ca",
            label: "Container A (Auth)",
            icon: Container,
            x: 20,
            y: 30,
            color: "border-blue-500/50",
          },
          {
            id: "cb",
            label: "Container B (Cart)",
            icon: Container,
            x: 50,
            y: 30,
            color: "border-yellow-500/50",
          },
          {
            id: "cc",
            label: "Container C (Catalog)",
            icon: Container,
            x: 80,
            y: 30,
            color: "border-green-500/50",
          },
          { id: "gw", label: "API Gateway", icon: Server, x: 50, y: 80 },
        ]}
        edges={[
          { from: "ca", to: "gw", animated: true, label: "JSON" },
          { from: "cb", to: "gw", animated: true },
          { from: "cc", to: "gw", animated: true },
        ]}
      />

      <p className="my-6 text-foreground font-medium">
        No Frontend, MFEs dividem TUDO:
      </p>

      <DynamicDiagram
        title="Frontend: MFEs Compartilham Runtime"
        nodes={[
          {
            id: "win",
            label: "Browser Window",
            icon: Monitor,
            x: 50,
            y: 50,
            color: "border-primary",
          },
          { id: "mfe1", label: "MFE Auth", icon: Box, x: 20, y: 30 },
          { id: "mfe2", label: "MFE Cart", icon: Box, x: 50, y: 30 },
          { id: "mfe3", label: "MFE Catalog", icon: Box, x: 80, y: 30 },
          {
            id: "memo",
            label: "Shared Memory (Heap)",
            icon: Cpu,
            x: 50,
            y: 80,
            color: "border-accent",
          },
        ]}
        edges={[
          { from: "mfe1", to: "win" },
          { from: "mfe2", to: "win" },
          { from: "mfe3", to: "win" },
          { from: "win", to: "memo", animated: true, label: "Shared State" },
        ]}
      />

      <ComparisonTable
        headers={["Backend Microservices", "Frontend Microfrontends"]}
        rows={[
          ["Containers isolados", "Mesmo processo/window"],
          ["Memória separada", "Memória compartilhada (heap)"],
          ["Network I/O entre services", "Funções no mesmo escopo"],
          ["Crash de um não afeta outros", "Erro de um pode crashar tudo"],
          ["Escala horizontal (mais pods)", "Preso ao hardware do usuário"],
          ["Versões diferentes de runtime", "MESMO runtime JS/DOM"],
          ["Logs centralizados (ELK, Datadog)", "Observabilidade limitada ao DevTools"],
        ]}
      />

      <div className="my-8 rounded-lg border border-destructive/30 bg-destructive/10 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-destructive">
          O Problema Fundamental
        </h3>
        <p className="text-sm text-destructive/80">
          No backend, se o Service A usa Node 16 e o Service B usa Node 20,{" "}
          <strong>não há conflito</strong>.
        </p>
        <p className="mt-4 text-sm text-foreground font-medium">
          No frontend, se MFE A carrega React 17 e MFE B carrega React 18, você
          tem{" "}
          <strong className="text-destructive">
            duas cópias do React na memória
          </strong>
          , competindo pelo mesmo DOM.
        </p>
      </div>

      {/* Consequências Práticas */}
      <div className="my-12 border-t border-border pt-8">
        <h3 className="mb-6 text-2xl font-bold text-foreground">
          Consequências Práticas
        </h3>

        {/* Dependency Hell */}
        <div className="mb-12">
          <h4 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
            <span className="font-mono text-destructive">01.</span>
            Dependency Hell
          </h4>

          <p className="mb-4 text-sm text-muted-foreground">
            3+ versões de React/Angular rodando simultaneamente consomem
            centenas de KB:
          </p>

          <DynamicDiagram
            title="Múltiplas Versões em Memória"
            nodes={[
              { id: "m1", label: "MFE Header (R17)", icon: Box, x: 20, y: 30 },
              { id: "m2", label: "MFE Cart (R18)", icon: Box, x: 50, y: 30 },
              {
                id: "m3",
                label: "MFE Catalog (R18.1)",
                icon: Box,
                x: 80,
                y: 30,
              },
              {
                id: "heap",
                label: "Heap",
                icon: Cpu,
                x: 50,
                y: 70,
                color: "border-destructive",
              },
            ]}
            edges={[
              { from: "m1", to: "heap", animated: true, label: "+150KB" },
              { from: "m2", to: "heap", animated: true, label: "+180KB" },
              { from: "m3", to: "heap", animated: true, label: "+175KB" },
            ]}
          />
        </div>

        {/* Layout Shift */}
        <div className="mb-12">
          <h4 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
            <span className="font-mono text-destructive">02.</span>
            Layout Shift (CLS)
          </h4>

          <p className="mb-4 text-sm text-muted-foreground">
            Carregamento assíncrono de módulos causa saltos visuais:
          </p>

          <div className="my-6">
            <LayoutShiftDemo />
          </div>
        </div>

        {/* Observabilidade */}
        <div className="mb-12">
          <h4 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
            <span className="font-mono text-destructive">03.</span>
            Dificuldade em Observabilidade
          </h4>

          <p className="mb-4 text-sm text-muted-foreground">
            No backend voce tem Datadog, New Relic, ELK Stack com metricas de
            CPU, memoria e latencia em tempo real. No frontend:
          </p>

          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <div className="rounded-lg border border-border bg-card p-4">
              <h5 className="font-mono text-xs text-accent mb-2">BACKEND</h5>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>- Logs centralizados automaticos</li>
                <li>- Metricas de CPU/memoria por container</li>
                <li>- Tracing distribuido (Jaeger, Zipkin)</li>
                <li>- Alertas em tempo real</li>
              </ul>
            </div>
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <h5 className="font-mono text-xs text-destructive mb-2">FRONTEND</h5>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>- Depende do DevTools do usuario</li>
                <li>- Erros silenciosos (try/catch vazios)</li>
                <li>- Sem acesso a metricas de hardware</li>
                <li>- Debugging remoto praticamente impossivel</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Orquestração */}
        <div className="mb-12">
          <h4 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
            <span className="font-mono text-destructive">04.</span>
            Orquestração e Latência
          </h4>

          <p className="mb-4 text-sm text-muted-foreground">
            O Shell (API Gateway do frontend) pode se tornar um gargalo em
            cascata:
          </p>

          <CodeBlock language="javascript" filename="shell-bottleneck.js">
            {`// PROBLEMA: Waterfall de requisições
async function loadMFEs() {
  const manifest = await fetch('/manifest.json'); // Espera
  const mfes = resolveDeps(manifest);             // Espera
  await Promise.all(mfes.map(loadMFE));           // Finalmente paralelo
}

// SOLUÇÃO: Pre-fetch + Cache
<link rel="modulepreload" href="/mfe-header.js">
<link rel="modulepreload" href="/mfe-cart.js">
<link rel="preload" href="/manifest.json" as="fetch">`}
          </CodeBlock>
        </div>
      </div>

      {/* Morte por Mil Cortes */}
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-destructive flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Morte por Mil Cortes
        </h3>
        <p className="mb-4 text-sm text-destructive/80">
          7 MFEs × 100ms cada = 700ms+ de bloqueio. O usuário sente o site
          "engasgando":
        </p>
        <TimelineVisual
          maxDuration={800}
          items={[
            { label: "Shell init", duration: 50, color: "muted" },
            { label: "MFE Header (+100ms)", duration: 150, color: "primary" },
            { label: "MFE Nav (+100ms)", duration: 250, color: "primary" },
            { label: "MFE Content (+100ms)", duration: 350, color: "primary" },
            {
              label: "MFE Sidebar (+100ms)",
              duration: 450,
              color: "destructive",
            },
            {
              label: "MFE Footer (+100ms)",
              duration: 550,
              color: "destructive",
            },
            {
              label: "TOTAL (800ms Blocking)",
              duration: 800,
              color: "destructive",
              blocked: true,
            },
          ]}
        />
      </div>

      {/* Memory Simulator */}
      <div className="my-12 border-t border-border pt-8">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          Simule o Consumo de Memória
        </h3>
        <p className="mb-6 text-muted-foreground">
          Ative Module Federation para ver como dependências compartilhadas
          reduzem o consumo:
        </p>
        <MFEMemorySimulator />
      </div>

      {/* Anti-Pattern: Matrioska */}
      <div className="my-12 border-t border-border pt-8">
        <h3 className="mb-6 text-2xl font-bold text-foreground">
          Anti-Pattern: Matrioskas de MFE
        </h3>

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 mb-8">
          <p className="text-sm text-muted-foreground mb-6">
            Nao coloque Microfrontend dentro de Microfrontend. Isso cria
            complexidade exponencial, problemas de comunicacao e debugging
            impossivel.
          </p>

          {/* Matrioska Visual */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Outer Shell */}
              <div className="w-64 h-48 rounded-2xl border-4 border-destructive/50 bg-destructive/10 flex items-center justify-center p-4">
                <span className="absolute top-2 left-3 text-[10px] font-mono text-destructive">
                  MFE Shell
                </span>
                {/* Middle MFE */}
                <div className="w-48 h-36 rounded-xl border-4 border-chart-4/50 bg-chart-4/10 flex items-center justify-center p-3">
                  <span className="absolute top-14 left-12 text-[10px] font-mono text-chart-4">
                    MFE Page
                  </span>
                  {/* Inner MFE */}
                  <div className="w-32 h-24 rounded-lg border-4 border-primary/50 bg-primary/10 flex items-center justify-center p-2">
                    <span className="absolute top-24 left-20 text-[10px] font-mono text-primary">
                      MFE Widget
                    </span>
                    {/* Innermost */}
                    <div className="w-16 h-12 rounded border-4 border-accent/50 bg-accent/10 flex items-center justify-center">
                      <span className="text-[8px] font-mono text-accent">MFE?</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* X Mark */}
              <div className="absolute -right-4 -top-4 h-10 w-10 rounded-full bg-destructive flex items-center justify-center">
                <span className="text-destructive-foreground text-xl font-bold">X</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-destructive font-medium text-center">
            Cada camada adiciona: latencia de carregamento, complexidade de
            comunicacao e pontos de falha.
          </p>
        </div>
      </div>

      {/* Pontos Importantes */}
      <div className="my-12 border-t border-border pt-8">
        <h3 className="mb-6 text-2xl font-bold text-foreground">
          Pontos Importantes
        </h3>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {[
            {
              title: "Runtime Compartilhado",
              desc: "MFEs dividem a mesma thread, memoria e DOM. Diferente de containers isolados.",
            },
            {
              title: "Dependency Hell",
              desc: "Multiplas versoes de frameworks consomem memoria e podem conflitar.",
            },
            {
              title: "Observabilidade Limitada",
              desc: "Sem acesso a metricas de hardware. Debugging depende do usuario.",
            },
            {
              title: "Layout Shift",
              desc: "Carregamento assincrono causa saltos visuais que prejudicam UX.",
            },
            {
              title: "Orquestracao Complexa",
              desc: "Shell pode virar gargalo. Pre-fetch e cache sao essenciais.",
            },
            {
              title: "Morte por Mil Cortes",
              desc: "Muitos MFEs pequenos acumulam latencia e bloqueiam a thread.",
            },
          ].map((point, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-card p-4"
            >
              <h4 className="font-mono text-sm font-semibold text-primary mb-2">
                {point.title}
              </h4>
              <p className="text-sm text-muted-foreground">{point.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MFE não é bala de prata */}
      <div className="rounded-xl border border-chart-4/30 bg-gradient-to-br from-chart-4/10 to-transparent p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Ilustração */}
          <div className="flex-shrink-0">
            <div className="relative w-32 h-32">
              {/* Bullet shape */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-chart-4/50 bg-chart-4/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-chart-4">MFE</span>
                </div>
              </div>
              {/* Crossed out */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-1 bg-destructive rotate-45 rounded-full" />
              </div>
              {/* Label */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground whitespace-nowrap">
                Silver Bullet
              </div>
            </div>
          </div>

          {/* Texto */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Microfrontend NAO e Bala de Prata
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              MFEs resolvem problemas organizacionais (times autonomos, deploys
              independentes), mas criam problemas tecnicos (memoria, latencia,
              complexidade). Use quando:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">+</span>
                <span className="text-foreground">
                  Times grandes precisam de autonomia real
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">+</span>
                <span className="text-foreground">
                  Deploys independentes sao criticos para o negocio
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">-</span>
                <span className="text-foreground">
                  Evite para apps pequenas ou times pequenos
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">-</span>
                <span className="text-foreground">
                  Evite se performance e UX sao a prioridade maxima
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
