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

        {/* Orquestração */}
        <div className="mb-12">
          <h4 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
            <span className="font-mono text-destructive">03.</span>
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
    </section>
  );
}
