"use client";

import { CodeBlock } from "@/components/code-block";
import { DynamicDiagram } from "@/components/dynamic-diagram";
import { LayoutShiftDemo } from "@/components/interactive/layout-shift-demo";
import { TimelineVisual } from "@/components/timeline-visual";
import { AlertTriangle, Box, Cpu, FileCode, Layout, Timer } from "lucide-react";

export function MFEProblemsSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <h2 className="mb-4 text-3xl font-bold text-foreground">
          Impacto de uma Arquitetura Ruim
        </h2>
        <p className="text-lg text-muted-foreground">
          Dependency Hell, Layout Shift e Latência de Orquestração.
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

        <DynamicDiagram
          title="Dependency Duplication na Memória (Heap)"
          nodes={[
            { id: "m1", label: "MFE Header (R17)", icon: Box, x: 20, y: 30 },
            { id: "m2", label: "MFE Cart (R18)", icon: Box, x: 50, y: 30 },
            { id: "m3", label: "MFE Catalog (R18.1)", icon: Box, x: 80, y: 30 },
            {
              id: "heap",
              label: "Main Thread Heap",
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

        <div className="my-6 rounded-lg border border-chart-4/30 bg-chart-4/10 p-4">
          <h4 className="mb-2 font-mono text-sm font-semibold text-chart-4">
            Analogia Backend
          </h4>
          <p className="text-sm text-chart-4/80">
            É como ter 3 pods Kubernetes onde cada um baixa e instala Node.js do
            zero em vez de usar uma imagem base compartilhada. Funciona, mas é
            um desperdício massivo de recursos.
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

        <DynamicDiagram
          title="Cumulative Layout Shift"
          nodes={[
            { id: "t0", label: "T=0: Shell", icon: Layout, x: 20, y: 30 },
            {
              id: "t200",
              label: "T=200: Header Load",
              icon: AlertTriangle,
              x: 50,
              y: 30,
              color: "border-destructive",
            },
            {
              id: "t500",
              label: "T=500: Banner Injected",
              icon: AlertTriangle,
              x: 80,
              y: 30,
              color: "border-destructive",
            },
          ]}
          edges={[
            { from: "t0", to: "t200", animated: true, label: "Shift!" },
            { from: "t200", to: "t500", animated: true, label: "Push!" },
          ]}
        />

        <div className="my-8">
          <TimelineVisual
            title="Impacto do CLS na UX"
            maxDuration={100}
            items={[
              { label: "CLS = 0.05 (Bom)", duration: 10, color: "accent" },
              { label: "CLS = 0.15 (Okay)", duration: 35, color: "primary" },
              {
                label: "CLS = 0.25 (Ruim)",
                duration: 60,
                color: "destructive",
              },
              {
                label: "CLS = 0.45 (Terrivel)",
                duration: 100,
                color: "destructive",
                blocked: true,
              },
            ]}
          />
        </div>

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

        <DynamicDiagram
          title="Shell como Gargalo (Waterfall)"
          nodes={[
            {
              id: "shell",
              label: "Shell (Auth/Routes)",
              icon: Layout,
              x: 50,
              y: 15,
            },
            {
              id: "mani",
              label: "manifest.json",
              icon: FileCode,
              x: 50,
              y: 40,
            },
            { id: "mfe1", label: "MFE A", icon: Box, x: 20, y: 70 },
            { id: "mfe2", label: "MFE B", icon: Box, x: 50, y: 70 },
            { id: "mfe3", label: "MFE C", icon: Box, x: 80, y: 70 },
          ]}
          edges={[
            { from: "shell", to: "mani", animated: true, label: "100ms" },
            { from: "mani", to: "mfe1", animated: true },
            { from: "mani", to: "mfe2", animated: true },
            { from: "mani", to: "mfe3", animated: true },
          ]}
        />

        <div className="my-8">
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
const manifestPromise = fetch('/manifest.json'); // Ja iniciou!`}
          </CodeBlock>
        </div>
      </div>

      {/* Morte por Mil Cortes */}
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-destructive flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Morte por Mil Cortes
        </h3>
        <p className="mb-4 text-sm text-destructive/80">
          Cada MFE adicionando 100ms de tempo de CPU resulta em um site que
          parece "pesado":
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
              label: "MFE Analytics (+100ms)",
              duration: 650,
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
        <p className="mt-4 text-sm text-foreground font-medium">
          7 MFEs × 100ms = 700ms+ de bloqueio da Main Thread. O usuario sente o
          site "engasgando".
        </p>
      </div>
    </section>
  );
}
