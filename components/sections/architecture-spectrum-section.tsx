"use client";

import { DynamicDiagram } from "@/components/dynamic-diagram";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  Box,
  CheckCircle2,
  Code2,
  Database,
  Globe,
  Layers,
  LayoutTemplate,
  Server,
  Smartphone,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";

// --- TIPOS ---
type ArchitectureType = "spa" | "ssg" | "ssr" | "webview";

interface ArchitectureData {
  id: ArchitectureType;
  name: string;
  backendAnalogy: string;
  icon: React.ElementType;
  example: string;
  color: string;
  // Métricas (0-100)
  metrics: {
    serverLoad: number;
    infraComplexity: number;
    seo: number;
    latency: number; // Invertido: quanto maior, melhor (menos latência)
  };
  description: string;
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
  prosBackend: string[];
  consBackend: string[];
  whenToAvoid: string;
}

// --- DADOS ---
const architectures: ArchitectureData[] = [
  {
    id: "spa",
    name: "SPA (Single Page Application)",
    backendAnalogy: "API Stateless + CDN",
    icon: Globe,
    example: "Gmail, Figma, Dashboards",
    color: "blue-500",
    metrics: { serverLoad: 20, infraComplexity: 30, seo: 30, latency: 60 },
    description:
      "O servidor é 'burro', apenas entrega arquivos estáticos e JSON. O navegador se torna o computador que roda a aplicação. Toda a lógica de renderização e roteamento acontece no cliente.",
    diagram: {
      nodes: [
        { id: "user", label: "User", icon: Activity, x: 10, y: 50 },
        { id: "browser", label: "Browser (React)", icon: Smartphone, x: 35, y: 50, color: "border-blue-500" },
        { id: "cdn", label: "CDN (Assets)", icon: Box, x: 60, y: 20 },
        { id: "api", label: "API REST/GraphQL", icon: Server, x: 85, y: 50 },
      ],
      edges: [
        { from: "user", to: "browser", label: "Acessa" },
        { from: "browser", to: "cdn", animated: true, label: "1. Load JS bundle" },
        { from: "browser", to: "api", animated: true, label: "2. Fetch JSON" },
        { from: "browser", to: "browser", label: "3. Renderiza na tela" },
      ],
    },
    prosBackend: [
      "Servidor foca apenas em dados (JSON)",
      "CDN absorve todo o tráfego de assets",
      "Estado da sessão mantido no cliente",
    ],
    consBackend: [
      "SEO ruim (crawlers veem página em branco inicialmente)",
      "Carregamento inicial lento (download do JS)",
    ],
    whenToAvoid: "Blogs, E-commerce público, Sites de notícias (onde SEO é vital).",
  },
  {
    id: "ssg",
    name: "SSG (Static Site Generation)",
    backendAnalogy: "Cache Pré-Aquecido (Build Time)",
    icon: Layers,
    example: "Docs, Blogs, Landing Pages",
    color: "green-500",
    metrics: { serverLoad: 5, infraComplexity: 40, seo: 100, latency: 95 },
    description:
      "O HTML é gerado no momento do Deploy (Build). Quando o usuário acessa, o arquivo já existe fisicamente na CDN. É a arquitetura mais rápida possível, pois não há banco de dados na leitura.",
    diagram: {
      nodes: [
        { id: "dev", label: "Build Process", icon: Code2, x: 10, y: 50 },
        { id: "api", label: "Headless CMS", icon: Database, x: 10, y: 80 },
        { id: "html", label: "HTML Files", icon: Box, x: 35, y: 50, color: "border-green-500" },
        { id: "cdn", label: "CDN Edge", icon: Globe, x: 60, y: 50 },
        { id: "user", label: "User", icon: Activity, x: 85, y: 50 },
      ],
      edges: [
        { from: "api", to: "dev", label: "Busca dados" },
        { from: "dev", to: "html", animated: true, label: "Gera HTML" },
        { from: "html", to: "cdn", label: "Deploy" },
        { from: "user", to: "cdn", animated: true, label: "Request (Cache Hit)" },
      ],
    },
    prosBackend: [
      "Zero processamento no request (apenas I/O)",
      "Impossível derrubar o banco com picos de acesso",
      "Segurança máxima (apenas arquivos estáticos)",
    ],
    consBackend: [
      "Tempo de build cresce com número de páginas",
      "Conteúdo 'real-time' é difícil",
    ],
    whenToAvoid: "Redes sociais, Dashboards dinâmicos, Sites com milhões de páginas.",
  },
  {
    id: "ssr",
    name: "SSR (Server-Side Rendering)",
    backendAnalogy: "PHP/JSP Moderno",
    icon: Server,
    example: "E-commerce, Portais de Notícia",
    color: "purple-500",
    metrics: { serverLoad: 90, infraComplexity: 70, seo: 100, latency: 50 },
    description:
      "A página é montada no servidor a cada requisição. O servidor busca os dados, renderiza o HTML e envia pronto para o navegador. Ideal para conteúdo dinâmico que precisa de SEO.",
    diagram: {
      nodes: [
        { id: "user", label: "User", icon: Activity, x: 10, y: 50 },
        { id: "server", label: "Node.js Server", icon: Server, x: 40, y: 50, color: "border-purple-500" },
        { id: "db", label: "Database", icon: Database, x: 70, y: 20 },
        { id: "api", label: "Microservices", icon: Layers, x: 70, y: 80 },
      ],
      edges: [
        { from: "user", to: "server", label: "Request" },
        { from: "server", to: "db", animated: true, label: "1. Query" },
        { from: "server", to: "api", animated: true, label: "2. Fetch" },
        { from: "server", to: "server", label: "3. Render HTML" },
        { from: "server", to: "user", animated: true, label: "4. Response HTML" },
      ],
    },
    prosBackend: [
      "SEO Perfeito com dados dinâmicos",
      "Dados sempre frescos (sem cache staleness)",
      "Rede interna do datacenter é rápida para buscar dados",
    ],
    consBackend: [
      "Alto custo de computação (CPU)",
      "TTFB (Time to First Byte) mais lento",
      "Difícil de escalar cache",
    ],
    whenToAvoid: "Apps que não precisam de SEO, Páginas estáticas simples.",
  },
  {
    id: "webview",
    name: "WebView (Híbrido)",
    backendAnalogy: "Docker Container no Celular",
    icon: Smartphone,
    example: "Apps Bancários, Uber (telas de help)",
    color: "orange-500",
    metrics: { serverLoad: 30, infraComplexity: 60, seo: 0, latency: 40 },
    description:
      "Um navegador embutido dentro de um app nativo. Permite reutilizar telas da Web dentro do iOS/Android, com uma ponte de comunicação (Bridge) para acessar recursos nativos.",
    diagram: {
      nodes: [
        { id: "user", label: "User", icon: Activity, x: 10, y: 50 },
        { id: "app", label: "App Nativo (Swift/Kotlin)", icon: Smartphone, x: 35, y: 50, color: "border-orange-500" },
        { id: "bridge", label: "JS Bridge", icon: Layers, x: 60, y: 50 },
        { id: "web", label: "Web Page", icon: Globe, x: 85, y: 50 },
      ],
      edges: [
        { from: "user", to: "app", label: "Abre Tela" },
        { from: "app", to: "bridge", animated: true, label: "Injeta Contexto" },
        { from: "web", to: "bridge", animated: true, label: "window.postMessage" },
        { from: "bridge", to: "app", animated: true, label: "Chama Função Nativa" },
      ],
    },
    prosBackend: [
      "Atualização OTA (Over The Air) sem App Store",
      "Mesmo código para Web, iOS e Android",
    ],
    consBackend: [
      "Performance inferior ao nativo",
      "UX pode parecer 'estranha' (scroll, inputs)",
    ],
    whenToAvoid: "Jogos, Animações pesadas, Funcionalidades core do dispositivo.",
  },
];

export function ArchitectureSpectrumSection() {
  const [selected, setSelected] = useState<ArchitectureType>("spa");
  const current = architectures.find((a) => a.id === selected)!;

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-10 text-center md:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 mb-4">
          <LayoutTemplate className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs font-bold text-primary">ARQUITETURA FRONTEND</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          Como os dados chegam na tela?
        </h2>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
          Escolher a arquitetura errada pode custar caro em infraestrutura ou matar seu SEO.
          Entenda as diferenças usando analogias de Backend.
        </p>
      </div>

      {/* Seletor de Arquitetura */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {architectures.map((arch) => {
          const Icon = arch.icon;
          const isSelected = selected === arch.id;
          return (
            <button
              key={arch.id}
              onClick={() => setSelected(arch.id)}
              className={cn(
                "group relative flex flex-col items-center justify-center gap-3 rounded-xl border p-6 transition-all duration-300",
                isSelected
                  ? `border-${arch.color} bg-${arch.color}/5 shadow-lg scale-[1.02]`
                  : "border-border bg-card hover:border-foreground/20 hover:bg-secondary/50",
              )}
            >
              <div className={cn(
                "p-3 rounded-full transition-colors",
                 isSelected ? `bg-${arch.color}/20 text-${arch.color}` : "bg-muted text-muted-foreground"
              )}>
                 <Icon className="h-6 w-6" />
              </div>
              
              <div className="text-center">
                <span className={cn(
                  "block font-bold text-sm",
                  isSelected ? "text-foreground" : "text-muted-foreground"
                )}>
                  {arch.id.toUpperCase()}
                </span>
                {isSelected && (
                    <span className="text-[10px] text-muted-foreground font-mono mt-1 opacity-80 hidden md:block">
                        {arch.backendAnalogy.split(' ')[0]}...
                    </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* PARTE 1: EXPLICAÇÃO E MÉTRICAS (TOPO) */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="grid md:grid-cols-3 gap-8">
            {/* Esquerda: Texto */}
            <div className="md:col-span-2 space-y-4">
                <div>
                    <h3 className="text-2xl font-bold text-foreground">
                        {current.name.split('(')[0]}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground">
                        {current.name.split('(')[1]?.replace(')', '')}
                    </p>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-3 inline-flex border border-border/50">
                    <span className={`text-sm font-bold text-${current.color} flex items-center gap-2`}>
                        <Server className="h-4 w-4" />
                        Analogia Backend: {current.backendAnalogy}
                    </span>
                </div>

                <p className="text-base text-muted-foreground leading-relaxed">
                    {current.description}
                </p>
            </div>

            {/* Direita: Métricas */}
            <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-6 space-y-5 flex flex-col justify-center">
                <MetricBar label="Custo Servidor" value={current.metrics.serverLoad} color="destructive" tooltip="CPU/Memória consumida por request" />
                <MetricBar label="SEO Power" value={current.metrics.seo} color="blue-500" tooltip="Facilidade de indexação pelo Google" />
                <MetricBar label="Performance (TTFB)" value={current.metrics.latency} color="green-500" tooltip="Tempo até o primeiro byte" />
            </div>
        </div>
      </div>

      {/* PARTE 2: FLUXO DE REQUISIÇÃO (DIAGRAMA) */}
      <div className="rounded-xl border border-border bg-card shadow-sm h-full flex flex-col overflow-hidden mb-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
                <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="font-bold text-sm">Visualização do Fluxo</span>
                </div>
                <span className={`text-xs font-mono px-2 py-0.5 rounded bg-${current.color}/10 text-${current.color}`}>
                    {current.id.toUpperCase()} PROTOCOL
                </span>
            </div>

            <div className="p-0 bg-background/50 h-[500px] w-full relative">
                 <div className="absolute inset-0 animate-in fade-in zoom-in-95 duration-500">
                     <DynamicDiagram
                        title={`Arquitetura: ${current.name}`}
                        nodes={current.diagram.nodes}
                        edges={current.diagram.edges}
                    />
                </div>
            </div>
             <div className="bg-card border-t border-border p-3 flex justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-border" /> Request Simples
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Processamento Pesado
                </div>
            </div>
      </div>

      {/* Seção de Análise (Trade-offs e Alertas) */}
      <div className="grid md:grid-cols-3 gap-6">
         {/* Pros */}
         <div className="space-y-3">
             <h4 className="text-xs font-mono font-bold text-muted-foreground uppercase flex items-center gap-2">
                 <CheckCircle2 className="h-4 w-4 text-green-500" />
                 Ganhos (Pros)
             </h4>
             <ul className="grid gap-2">
                 {current.prosBackend.map((pro, i) => (
                     <li key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card/50 text-sm">
                         <span className="text-green-500 font-bold mt-0.5">+</span>
                         {pro}
                     </li>
                 ))}
             </ul>
         </div>

         {/* Cons */}
         <div className="space-y-3">
             <h4 className="text-xs font-mono font-bold text-muted-foreground uppercase flex items-center gap-2">
                 <XCircle className="h-4 w-4 text-destructive" />
                 Dores (Cons)
             </h4>
             <ul className="grid gap-2">
                 {current.consBackend.map((con, i) => (
                     <li key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card/50 text-sm">
                         <span className="text-destructive font-bold mt-0.5">-</span>
                         {con}
                     </li>
                 ))}
             </ul>
         </div>

         {/* When to Avoid */}
         <div className="space-y-3">
             <h4 className="text-xs font-mono font-bold text-muted-foreground uppercase flex items-center gap-2">
                 <AlertTriangle className="h-4 w-4 text-yellow-500" />
                 Quando EVITAR
             </h4>
             <div className="p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 h-full flex flex-col justify-center">
                <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                    {current.whenToAvoid}
                </p>
             </div>
         </div>
      </div>
    </section>
  );
}

// --- SUBCOMPONENTES ---

function MetricBar({
  label,
  value,
  color,
  tooltip,
}: {
  label: string;
  value: number;
  color: string;
  tooltip: string;
}) {
  return (
    <div className="group relative" title={tooltip}>
      <div className="mb-1.5 flex justify-between items-end">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="text-xs font-mono font-bold text-foreground">{value}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-secondary border border-border/50">
        <div
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", `bg-${color}`)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}