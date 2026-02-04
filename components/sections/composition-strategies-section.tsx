"use client";

import { ComparisonTable } from "@/components/comparison-table";
import { DynamicDiagram } from "@/components/dynamic-diagram";
import { cn } from "@/lib/utils";
import { Activity, Box, Cloud, Gauge, Globe, Zap } from "lucide-react";
import React, { useState } from "react";

type CompositionType = "client" | "server" | "edge" | "build";

interface CompositionStrategy {
  id: CompositionType;
  name: string;
  timing: string;
  icon: React.ElementType;
  color: string;
  latency: number;
  complexity: number;
  isolation: number;
  scalability: number;
  description: string;
  bestFor: string[];
  avoid: string[];
  diagram: {
    nodes: Array<{
      id: string;
      label: string;
      icon?: any;
      x: number;
      y: number;
      color?: string;
    }>;
    edges: Array<{
      from: string;
      to: string;
      label?: string;
      animated?: boolean;
    }>;
  };
}

const strategies: CompositionStrategy[] = [
  {
    id: "client",
    name: "Client-Side Composition",
    timing: "Runtime (Browser)",
    icon: Gauge,
    color: "primary",
    latency: 80,
    complexity: 60,
    isolation: 30,
    scalability: 40,
    description:
      "JavaScript no browser monta a página usando múltiplos scripts. É o SPA clássico onde cada MFE carrega seus assets e se renderiza.",
    bestFor: [
      "SPAs com muito JavaScript",
      "Aplicações interativas",
      "Conteúdo dinâmico",
    ],
    avoid: ["SEO crítico", "Usuários com JS desabilitado", "Conexões lentas"],
    diagram: {
      nodes: [
        { id: "user", label: "Usuário", icon: Activity, x: 10, y: 50 },
        { id: "browser", label: "Browser", icon: Globe, x: 30, y: 50 },
        {
          id: "shell",
          label: "Shell.js",
          icon: Box,
          x: 50,
          y: 30,
          color: "border-primary",
        },
        { id: "mfe1", label: "MFE A", icon: Box, x: 50, y: 70 },
        { id: "mfe2", label: "MFE B", icon: Box, x: 70, y: 70 },
      ],
      edges: [
        { from: "user", to: "browser", label: "Click" },
        {
          from: "browser",
          to: "shell",
          animated: true,
          label: "1. Load Shell",
        },
        { from: "shell", to: "mfe1", animated: true, label: "2. Load MFE A" },
        { from: "shell", to: "mfe2", animated: true, label: "2. Load MFE B" },
      ],
    },
  },
  {
    id: "server",
    name: "Server-Side Composition",
    timing: "Build/Request",
    icon: Cloud,
    color: "accent",
    latency: 40,
    complexity: 50,
    isolation: 20,
    scalability: 30,
    description:
      "Servidor monta o HTML combinando múltiplos MFEs. Como um orquestrador que faz SSI (Server-Side Includes) moderno.",
    bestFor: [
      "SEO importante",
      "Performance crítica",
      "Conteúdo semi-estático",
    ],
    avoid: [
      "Atualizações em tempo real",
      "Isolamento rigoroso",
      "Deploy ultra-independente",
    ],
    diagram: {
      nodes: [
        { id: "user", label: "Usuário", icon: Activity, x: 10, y: 50 },
        { id: "browser", label: "Browser", icon: Globe, x: 30, y: 50 },
        {
          id: "gateway",
          label: "API Gateway",
          icon: Cloud,
          x: 55,
          y: 50,
          color: "border-accent",
        },
        { id: "mfe1", label: "MFE Header", icon: Box, x: 55, y: 20 },
        { id: "mfe2", label: "MFE Content", icon: Box, x: 55, y: 80 },
        { id: "html", label: "HTML Montado", icon: Globe, x: 80, y: 50 },
      ],
      edges: [
        { from: "user", to: "browser", label: "Click" },
        { from: "browser", to: "gateway", animated: true, label: "GET /page" },
        { from: "gateway", to: "mfe1", animated: true, label: "fetch" },
        { from: "gateway", to: "mfe2", animated: true, label: "fetch" },
        { from: "mfe1", to: "html", animated: true },
        { from: "mfe2", to: "html", animated: true },
        { from: "html", to: "browser", animated: true, label: "HTML completo" },
      ],
    },
  },
  {
    id: "edge",
    name: "Edge-Side Composition",
    timing: "Edge Runtime (CDN)",
    icon: Zap,
    color: "chart-4",
    latency: 20,
    complexity: 75,
    isolation: 40,
    scalability: 90,
    description:
      "CDN/Edge Workers montam a página antes de chegar ao origin. Lambda@Edge, Cloudflare Workers, Vercel Edge Functions.",
    bestFor: ["Máxima performance", "Escala global", "Personalização por geo"],
    avoid: ["Lógica complexa", "Acesso a estado central", "Debug fácil"],
    diagram: {
      nodes: [
        { id: "u1", label: "User BR", icon: Activity, x: 10, y: 20 },
        { id: "u2", label: "User US", icon: Activity, x: 10, y: 80 },
        {
          id: "edge1",
          label: "Edge SP",
          icon: Zap,
          x: 40,
          y: 20,
          color: "border-chart-4",
        },
        {
          id: "edge2",
          label: "Edge NYC",
          icon: Zap,
          x: 40,
          y: 80,
          color: "border-chart-4",
        },
        { id: "origin", label: "Origin", icon: Cloud, x: 70, y: 50 },
      ],
      edges: [
        { from: "u1", to: "edge1", animated: true, label: "<5ms" },
        { from: "u2", to: "edge2", animated: true, label: "<5ms" },
        { from: "edge1", to: "origin", animated: true, label: "Fallback" },
        { from: "edge2", to: "origin", animated: true, label: "Fallback" },
      ],
    },
  },
  {
    id: "build",
    name: "Build-Time Integration",
    timing: "Build/Deploy",
    icon: Box,
    color: "chart-2",
    latency: 15,
    complexity: 40,
    isolation: 10,
    scalability: 50,
    description:
      "Tudo compilado em um único bundle durante o build. Pode ser monorepo ou script que agrega bundles. Como um link-time de C.",
    bestFor: ["Sites estáticos", "Publicações", "Documentação"],
    avoid: ["Deploy independente", "Atualizações frequentes", "Isolamento"],
    diagram: {
      nodes: [
        {
          id: "build",
          label: "Build Server",
          icon: Cloud,
          x: 20,
          y: 50,
          color: "border-chart-2",
        },
        { id: "mfe1", label: "MFE A", icon: Box, x: 40, y: 20 },
        { id: "mfe2", label: "MFE B", icon: Box, x: 40, y: 80 },
        { id: "bundle", label: "Single Bundle", icon: Globe, x: 60, y: 50 },
        {
          id: "cdn",
          label: "CDN",
          icon: Zap,
          x: 80,
          y: 50,
          color: "border-chart-2",
        },
      ],
      edges: [
        { from: "build", to: "mfe1", animated: true },
        { from: "build", to: "mfe2", animated: true },
        { from: "mfe1", to: "bundle", animated: true, label: "webpack" },
        { from: "mfe2", to: "bundle", animated: true, label: "webpack" },
        { from: "bundle", to: "cdn", animated: true },
      ],
    },
  },
];

export function CompositionStrategiesSection() {
  const [selected, setSelected] = useState<CompositionType>("client");
  const current = strategies.find((s) => s.id === selected)!;

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 mb-4">
          <span className="font-mono text-xs text-primary">COMPOSIÇÃO</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground">
          Estratégias de Composição de MFEs
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Quando compor MFEs? Explore as quatro estratégias principais baseadas
          no momento de composição: cliente, servidor, edge ou build.
        </p>
      </div>

      {/* Strategy Selector */}
      <div className="mb-8 grid grid-cols-2 gap-2 md:grid-cols-4">
        {strategies.map((strategy) => {
          const Icon = strategy.icon;
          return (
            <button
              key={strategy.id}
              onClick={() => setSelected(strategy.id)}
              className={cn(
                "group relative flex flex-col items-center gap-1 rounded-lg border p-3 transition-all",
                selected === strategy.id
                  ? `border-${strategy.color}/50 bg-${strategy.color}/10`
                  : "border-border bg-card hover:border-border/80",
              )}
              title={strategy.name}
            >
              <Icon
                className={cn(
                  "h-6 w-6",
                  selected === strategy.id
                    ? `text-${strategy.color}`
                    : "text-muted-foreground",
                )}
              />
              <span className="text-center font-mono text-[10px] leading-tight text-muted-foreground">
                {strategy.id.toUpperCase()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Strategy Detail */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            {React.createElement(current.icon, { className: "h-6 w-6" })}
            <h3 className="text-2xl font-bold text-foreground">
              {current.name}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            <strong>Timing:</strong> {current.timing}
          </p>
          <p className="mt-3 text-foreground/90">{current.description}</p>
        </div>

        <DynamicDiagram
          title="Arquitetura"
          nodes={current.diagram.nodes}
          edges={current.diagram.edges}
        />

        {/* Best For / Avoid */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
            <h4 className="mb-3 font-mono text-sm font-semibold text-accent">
              Melhor para
            </h4>
            <ul className="space-y-1">
              {current.bestFor.map((item, i) => (
                <li key={i} className="text-sm text-foreground/80">
                  + {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <h4 className="mb-3 font-mono text-sm font-semibold text-destructive">
              Evitar quando
            </h4>
            <ul className="space-y-1">
              {current.avoid.map((item, i) => (
                <li key={i} className="text-sm text-foreground/80">
                  - {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="mt-12">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          Matriz de Decisão
        </h3>
        <div className="overflow-x-auto">
          <ComparisonTable
            headers={[
              "Estratégia",
              "Latência",
              "Complexidade",
              "Isolamento",
              "Escalabilidade",
              "Best Use",
            ]}
            rows={strategies.map((s) => [
              s.name.split("(")[0].trim(),
              s.latency <= 30
                ? "Baixa"
                : s.latency <= 60
                  ? "Média"
                  : "Alta",
              s.complexity <= 40
                ? "Baixa"
                : s.complexity <= 70
                  ? "Média"
                  : "Alta",
              s.isolation >= 80
                ? "Alto"
                : s.isolation >= 40
                  ? "Médio"
                  : "Baixo",
              s.scalability >= 80
                ? "Excelente"
                : s.scalability >= 50
                  ? "Bom"
                  : "Limitado",
              s.bestFor[0],
            ])}
          />
        </div>
      </div>

      {/* Recommendation */}
      <div className="mt-8 rounded-lg border border-primary/30 bg-primary/10 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-primary">
          📌 Recomendação
        </h3>
        <p className="text-sm text-foreground">
          {selected === "server" &&
            "Server-Side Composition prioriza SEO e performance inicial. Perfeito para e-commerce e conteúdo editorial onde o primeiro paint importa mais que a interatividade."}
          {selected === "client" &&
            "Client-Side é simples de começar mas escalabilidade fica complicada. Apenas para SPAs pequenas ou ferramentas internas."}
          {selected === "edge" &&
            "Edge é o futuro mas requer infraestrutura. Use quando latência global é crítica (Netflix, NYTimes)."}
          {selected === "build" &&
            "Build-Time é direto: sem complexidade de runtime. Ótimo para sites estáticos, documentação, blogs."}
        </p>
      </div>
    </section>
  );
}


