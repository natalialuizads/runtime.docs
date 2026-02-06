"use client";

import { ComparisonTable } from "@/components/comparison-table";
import { DynamicDiagram } from "@/components/dynamic-diagram";
import { cn } from "@/lib/utils";
import {
  Box,
  CheckCircle2,
  Cloud,
  Cpu,
  Gauge,
  Globe,
  LayoutTemplate,
  Server,
  Smartphone,
  Zap,
  ZapOff,
} from "lucide-react";
import React, { useState } from "react";

type CompositionType = "client" | "server" | "edge" | "build" | "sdui";

interface CompositionStrategy {
  id: CompositionType;
  name: string;
  timing: string;
  backendAnalogy: string;
  icon: React.ElementType;
  color: string;
  metrics: { perf: number; infra: number; dev: number };
  description: string;
  bestFor: string[];
  avoid: string[];
  diagram: any;
}

const strategies: CompositionStrategy[] = [
  {
    id: "build",
    name: "Build-Time Integration",
    timing: "CI/CD Pipeline",
    backendAnalogy: "Static Binary Linking (Lib Estática)",
    icon: Box,
    color: "emerald",
    metrics: { perf: 95, infra: 20, dev: 30 },
    description:
      "Os MFEs são unidos durante o build. O resultado é um artefato único. É como compilar um binário em Go/C++ com todas as dependências inclusas.",
    bestFor: ["Sistemas pequenos", "Baixa frequência de atualização"],
    avoid: ["Times independentes", "Ecossistemas com 10+ MFEs"],
    diagram: {
      nodes: [
        {
          id: "ci",
          label: "Pipeline CI/CD",
          icon: Cloud,
          x: 10,
          y: 50,
          color: "border-emerald-500",
        },
        { id: "mfe1", label: "MFE A", x: 40, y: 30 },
        { id: "mfe2", label: "MFE B", x: 40, y: 70 },
        {
          id: "bundle",
          label: "Artifact Único",
          icon: Zap,
          x: 80,
          y: 50,
          color: "border-emerald-500",
        },
      ],
      edges: [
        { from: "ci", to: "mfe1", animated: true },
        { from: "ci", to: "mfe2", animated: true },
        { from: "mfe1", to: "bundle", label: "Link" },
        { from: "mfe2", to: "bundle", label: "Link" },
      ],
    },
  },
  {
    id: "server",
    name: "Server-Side Composition",
    timing: "Request Time (Server)",
    backendAnalogy: "Reverse Proxy Aggregation / SSI",
    icon: Cloud,
    color: "blue",
    metrics: { perf: 85, infra: 70, dev: 50 },
    description:
      "O servidor orquestrador monta o HTML buscando fragmentos de outros serviços. O usuário recebe o documento pronto (SSR).",
    bestFor: ["SEO Crítico", "E-commerce", "Performance inicial"],
    avoid: ["Altíssima interatividade no client", "Apps Offline"],
    diagram: {
      nodes: [
        { id: "browser", label: "Browser", icon: Globe, x: 10, y: 50 },
        {
          id: "server",
          label: "MFE Orchestrator",
          icon: Server,
          x: 45,
          y: 50,
          color: "border-blue-500",
        },
        { id: "mfe1", label: "UI Service A", x: 85, y: 25 },
        { id: "mfe2", label: "UI Service B", x: 85, y: 75 },
      ],
      edges: [
        { from: "browser", to: "server", label: "HTTP GET", animated: true },
        { from: "server", to: "mfe1", label: "Fetch Fragment" },
        { from: "server", to: "mfe2", label: "Fetch Fragment" },
        {
          from: "server",
          to: "browser",
          label: "Compiled HTML",
          animated: true,
        },
      ],
    },
  },
  {
    id: "client",
    name: "Client-Side Composition",
    timing: "Runtime (Browser)",
    backendAnalogy: "API Gateway + Microservices",
    icon: Gauge,
    color: "amber",
    metrics: { perf: 65, infra: 40, dev: 90 },
    description:
      "O browser baixa o Host que então orquestra o carregamento dos remotos via rede. É a base do Module Federation.",
    bestFor: ["Dashboards", "Sistemas B2B", "Autonomia total de times"],
    avoid: ["SEO", "Carregamento instantâneo em conexões 3G"],
    diagram: {
      nodes: [
        { id: "user", label: "Usuário", x: 10, y: 50 },
        {
          id: "shell",
          label: "App Shell",
          icon: Zap,
          x: 45,
          y: 50,
          color: "border-amber-500",
        },
        { id: "mfe1", label: "Remote MFE A", x: 85, y: 25 },
        { id: "mfe2", label: "Remote MFE B", x: 85, y: 75 },
      ],
      edges: [
        { from: "user", to: "shell", label: "Inicia App", animated: true },
        { from: "shell", to: "mfe1", label: "Runtime Load", animated: true },
        { from: "shell", to: "mfe2", label: "Runtime Load", animated: true },
      ],
    },
  },
  {
    id: "edge",
    name: "Edge-Side Composition",
    timing: "Edge Runtime (CDN)",
    backendAnalogy: "Serverless Workers na Borda",
    icon: Zap,
    color: "violet",
    metrics: { perf: 98, infra: 90, dev: 60 },
    description:
      "A composição acontece fisicamente perto do usuário (CDN). Combina baixa latência com dinamismo.",
    bestFor: [
      "Escala Global",
      "Personalização Regional",
      "Alta Disponibilidade",
    ],
    avoid: ["Lógica complexa de escrita em DB", "Ambientes de debug restritos"],
    diagram: {
      nodes: [
        { id: "user", label: "Usuário", x: 10, y: 50 },
        {
          id: "edge",
          label: "Edge Node (SP)",
          icon: Zap,
          x: 45,
          y: 50,
          color: "border-violet-500",
        },
        { id: "origin", label: "Origin Server", icon: Server, x: 85, y: 50 },
      ],
      edges: [
        { from: "user", to: "edge", label: "Request <5ms", animated: true },
        { from: "edge", to: "origin", label: "Cache Refresh" },
        { from: "edge", to: "user", label: "Dynamic HTML", animated: true },
      ],
    },
  },
  {
    id: "sdui",
    name: "Server-Driven UI",
    timing: "API Response (JSON)",
    backendAnalogy: "Layout-as-a-Service",
    icon: LayoutTemplate,
    color: "rose",
    metrics: { perf: 75, infra: 80, dev: 95 },
    description:
      "O backend envia um schema (JSON) que descreve a posição e o tipo dos componentes. O cliente é apenas um renderizador burro.",
    bestFor: [
      "Apps Mobile",
      "Mudanças de layout sem deploy de app",
      "Super Apps",
    ],
    avoid: ["Documentos de texto longo", "SEO"],
    diagram: {
      nodes: [
        {
          id: "client",
          label: "Renderer Engine",
          icon: Smartphone,
          x: 10,
          y: 50,
        },
        {
          id: "api",
          label: "SDUI BFF",
          icon: Server,
          x: 45,
          y: 50,
          color: "border-rose-500",
        },
        { id: "json", label: "JSON Schema", icon: Box, x: 85, y: 50 },
      ],
      edges: [
        { from: "client", to: "api", label: "GET /view", animated: true },
        { from: "api", to: "json", label: "Map Components" },
        { from: "api", to: "client", label: "JSON Stream", animated: true },
      ],
    },
  },
];

export function CompositionStrategiesSection() {
  const [selected, setSelected] = useState<CompositionType>("client");
  const current = strategies.find((s) => s.id === selected)!;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          Estratégias de Composição
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Cada decisão arquitetural muda o <strong>fluxo de dados</strong> e a{" "}
          <strong>infraestrutura</strong> necessária.
        </p>
      </div>

      {/* SELECTOR */}
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {strategies.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelected(s.id)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
              selected === s.id
                ? `border-${s.color}-500 bg-${s.color}-500/10 scale-105 shadow-md`
                : "border-border bg-card hover:border-border/80",
            )}
          >
            <s.icon
              className={cn(
                "h-6 w-6",
                selected === s.id
                  ? `text-${s.color}-500`
                  : "text-muted-foreground",
              )}
            />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {s.name.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>

      {/* CARD PRINCIPAL */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* PARTE SUPERIOR: TEXTO E MÉTRICAS */}
        <div className="p-8 grid lg:grid-cols-2 gap-12 border-b border-border">
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">{current.name}</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded-md bg-secondary text-[10px] font-mono font-bold uppercase">
                  Runtime: {current.timing}
                </span>
                <div className="inline-flex items-center gap-2 text-[10px] font-mono text-primary bg-primary/5 px-2 py-1 rounded-md border border-primary/20">
                  <Cpu className="h-3 w-3" />
                  {current.backendAnalogy}
                </div>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {current.description}
            </p>
          </div>

          <div className="space-y-4 bg-secondary/5 p-6 rounded-xl border border-border/50 shadow-inner">
            <h4 className="text-[10px] font-bold uppercase text-muted-foreground mb-4 tracking-widest">
              Performance & Operação
            </h4>
            <MetricBar
              label="Latência de Resposta"
              value={current.metrics.perf}
              color="bg-emerald-500"
            />
            <MetricBar
              label="Custo de Infra"
              value={current.metrics.infra}
              color="bg-blue-500"
            />
            <MetricBar
              label="Autonomia dos Times"
              value={current.metrics.dev}
              color="bg-amber-500"
            />
          </div>
        </div>

        {/* DIAGRAMA - OCUPA TODA A LARGURA (FULL WIDTH NO CARD) */}
        <div className="bg-zinc-950/50 relative border-b border-border">
          <div className="absolute top-4 left-4 z-10">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest bg-zinc-950/90 px-2 py-1 rounded border border-zinc-800 backdrop-blur-sm">
              Fluxo de Orquestração: {current.name}
            </span>
          </div>

          {/* AQUI ESTAVA O ERRO: Removido flex-center e increased height */}
          <div className="w-full h-[500px]">
            <DynamicDiagram
              title=""
              nodes={current.diagram.nodes}
              edges={current.diagram.edges}
            />
          </div>
        </div>

        {/* PARTE INFERIOR: RECOMENDAÇÕES */}
        <div className="p-8 grid md:grid-cols-2 gap-8 bg-zinc-900/10">
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
              <CheckCircle2 className="h-4 w-4" /> Casos de Sucesso
            </h4>
            <div className="flex flex-wrap gap-2">
              {current.bestFor.map((t, i) => (
                <span
                  key={i}
                  className="text-[11px] bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full border border-emerald-500/20"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-destructive font-bold text-sm">
              <ZapOff className="h-4 w-4" /> Contra-indicado
            </h4>
            <div className="flex flex-wrap gap-2">
              {current.avoid.map((t, i) => (
                <span
                  key={i}
                  className="text-[11px] bg-destructive/5 text-destructive/70 px-3 py-1 rounded-full border border-destructive/10"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MATRIZ DE COMPARAÇÃO */}
      <div className="mt-16 overflow-hidden">
        <h3 className="mb-6 text-xl font-bold">Matriz de Decisão Rápida</h3>
        <ComparisonTable
          headers={[
            "Estratégia",
            "Perf.",
            "Custo Infra",
            "Deploy",
            "Melhor Uso",
          ]}
          rows={strategies.map((s) => [
            s.name.split(" ")[0],
            s.metrics.perf > 80 ? "🚀" : "🐢",
            s.metrics.infra > 70 ? "$$$" : "$",
            "Independente",
            s.bestFor[0],
          ])}
        />
      </div>
    </section>
  );
}

function MetricBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-bold text-foreground/80">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-1000 ease-out shadow-sm",
            color,
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
