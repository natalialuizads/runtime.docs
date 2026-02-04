"use client";

import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Columns,
  Combine,
  Globe,
  Layers,
  Layout,
  Monitor,
  MousePointer2,
  Music2,
  Network,
  Rows,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Star,
  User,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

export function MFEPatternsSection() {
  // Estado para o exemplo interativo Vertical
  const [verticalTab, setVerticalTab] = useState<"home" | "shop" | "account">(
    "home",
  );

  // Estado para o exemplo interativo Spotify/Horizontal
  const [highlightedSquad, setHighlightedSquad] = useState<string | null>(null);

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 mb-4">
          <Layers className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs text-primary">
            Estratégia de Decomposição
          </span>
        </div>
        <h2 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl">
          Padrões de Arquitetura
        </h2>
        <p className="mt-6 text-xl text-muted-foreground leading-relaxed max-w-3xl">
          Como fatiar o monolito? A decisão entre divisão Vertical e Horizontal
          define não apenas o código, mas a estrutura organizacional da empresa
          (Lei de Conway).
        </p>
      </div>

      {/* 1. CONCEITOS FUNDAMENTAIS */}
      <div className="grid gap-8 lg:grid-cols-2 mb-24">
        {/* Card Vertical */}
        <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Columns className="h-32 w-32" />
          </div>
          <h3 className="flex items-center gap-3 text-2xl font-bold text-primary mb-4">
            <Columns className="h-6 w-6" />
            Divisão Vertical
          </h3>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
            App por Rota (Page-Level)
          </p>
          <p className="text-muted-foreground mb-6 min-h-[60px]">
            Cada MFE assume a janela inteira. O Shell é apenas um menu/roteador.
            Navegar entre MFEs é trocar de página.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Isolamento total
              de times
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Deploy
              independente simplificado
            </li>
          </ul>
        </div>

        {/* Card Horizontal */}
        <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all hover:border-accent/50 hover:shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Rows className="h-32 w-32" />
          </div>
          <h3 className="flex items-center gap-3 text-2xl font-bold text-accent mb-4">
            <Rows className="h-6 w-6" />
            Divisão Horizontal
          </h3>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Composição de Fragmentos (Widget-Level)
          </p>
          <p className="text-muted-foreground mb-6 min-h-[60px]">
            Vários MFEs coexistem na mesma tela. O Shell é um orquestrador que
            costura pedaços de UI de times diferentes.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" /> Reutilização
              máxima
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" /> Experiência
              Fluida (SPA real)
            </li>
          </ul>
        </div>
      </div>

      {/* 2. EXEMPLO PRÁTICO: VERTICAL SPLIT */}
      <div className="mb-24 rounded-3xl border border-border bg-card/50 p-1">
        <div className="bg-card rounded-[22px] overflow-hidden">
          <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Exemplo Real: Divisão Vertical
            </h3>
            <span className="text-xs font-mono text-muted-foreground">
              Simulação de Roteamento
            </span>
          </div>

          <div className="grid md:grid-cols-[250px_1fr] min-h-[400px]">
            {/* Sidebar de Explicação */}
            <div className="p-6 border-r border-border bg-muted/10 space-y-6">
              <p className="text-sm text-muted-foreground">
                Observe como a URL e o "Dono do App" mudam completamente. Não há
                estado compartilhado na memória RAM entre essas trocas.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => setVerticalTab("home")}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg text-sm transition-all border",
                    verticalTab === "home"
                      ? "bg-primary/10 border-primary text-primary font-bold"
                      : "bg-background border-border hover:bg-muted",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>Home App</span>
                    <span className="text-[10px] uppercase bg-background px-1 border rounded">
                      Team A
                    </span>
                  </div>
                  <div className="text-[10px] opacity-70 mt-1 font-mono">
                    /home
                  </div>
                </button>
                <button
                  onClick={() => setVerticalTab("shop")}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg text-sm transition-all border",
                    verticalTab === "shop"
                      ? "bg-orange-500/10 border-orange-500 text-orange-500 font-bold"
                      : "bg-background border-border hover:bg-muted",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>Shop App</span>
                    <span className="text-[10px] uppercase bg-background px-1 border rounded">
                      Team B
                    </span>
                  </div>
                  <div className="text-[10px] opacity-70 mt-1 font-mono">
                    /shop/*
                  </div>
                </button>
                <button
                  onClick={() => setVerticalTab("account")}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg text-sm transition-all border",
                    verticalTab === "account"
                      ? "bg-blue-500/10 border-blue-500 text-blue-500 font-bold"
                      : "bg-background border-border hover:bg-muted",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>Account App</span>
                    <span className="text-[10px] uppercase bg-background px-1 border rounded">
                      Team C
                    </span>
                  </div>
                  <div className="text-[10px] opacity-70 mt-1 font-mono">
                    /account
                  </div>
                </button>
              </div>
            </div>

            {/* Simulação do Browser */}
            <div className="bg-background flex flex-col">
              {/* Fake Address Bar */}
              <div className="h-12 border-b border-border flex items-center px-4 gap-3 bg-muted/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
                  <div className="w-3 h-3 rounded-full bg-green-400/50" />
                </div>
                <div className="flex-1 bg-card border border-border h-8 rounded-md flex items-center px-3 text-xs font-mono text-muted-foreground">
                  https://minha-loja.com/
                  <span className="text-foreground font-bold">
                    {verticalTab}
                  </span>
                </div>
              </div>

              {/* Viewport Content */}
              <div className="flex-1 p-8 flex items-center justify-center">
                {verticalTab === "home" && (
                  <div className="text-center space-y-4 animate-in fade-in zoom-in-95">
                    <div className="h-20 w-20 bg-primary/20 rounded-full mx-auto flex items-center justify-center">
                      <Layout className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary">
                      Landing Page MFE
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Stack: Next.js (SSG)
                      <br />
                      Foco: SEO e Performance Inicial.
                    </p>
                  </div>
                )}
                {verticalTab === "shop" && (
                  <div className="text-center space-y-4 animate-in slide-in-from-right-4">
                    <div className="h-20 w-20 bg-orange-500/20 rounded-full mx-auto flex items-center justify-center">
                      <ShoppingCart className="h-10 w-10 text-orange-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-orange-500">
                      Product Catalog MFE
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Stack: React + Filter Logic Complexa
                      <br />
                      Foco: Interatividade e Conversão.
                    </p>
                  </div>
                )}
                {verticalTab === "account" && (
                  <div className="text-center space-y-4 animate-in slide-in-from-bottom-4">
                    <div className="h-20 w-20 bg-blue-500/20 rounded-full mx-auto flex items-center justify-center">
                      <User className="h-10 w-10 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-blue-500">
                      User Dashboard MFE
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Stack: Vue.js (Legado Migrando)
                      <br />
                      Foco: Segurança e Dados Sensíveis.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. EXEMPLO PRÁTICO: HORIZONTAL (SPOTIFY MODEL) */}
      <div className="mb-24">
        <h3 className="mb-8 text-2xl font-bold text-foreground flex items-center gap-3">
          <Combine className="h-6 w-6 text-accent" />
          Exemplo Real: Divisão Horizontal (Spotify Model)
        </h3>
        <p className="mb-8 text-muted-foreground max-w-3xl">
          Neste modelo, a tela é composta por vários times simultaneamente. O
          desafio não é roteamento, é <strong>orquestração</strong>. Passe o
          mouse sobre os times para ver o impacto na UI.
        </p>

        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Controls / Legend */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="h-4 w-4" /> Squads Responsáveis
              </h4>
              <div className="space-y-2">
                {[
                  {
                    id: "player",
                    name: "Squad Player",
                    color: "text-green-500",
                    bg: "bg-green-500/10",
                    border: "border-green-500",
                    desc: "Controle de mídia persistente.",
                  },
                  {
                    id: "discovery",
                    name: "Squad Discovery",
                    color: "text-blue-500",
                    bg: "bg-blue-500/10",
                    border: "border-blue-500",
                    desc: "Recomendação e Listas.",
                  },
                  {
                    id: "ads",
                    name: "Squad Monetization",
                    color: "text-yellow-500",
                    bg: "bg-yellow-500/10",
                    border: "border-yellow-500",
                    desc: "Ads dinâmicos e Premium.",
                  },
                ].map((squad) => (
                  <div
                    key={squad.id}
                    onMouseEnter={() => setHighlightedSquad(squad.id)}
                    onMouseLeave={() => setHighlightedSquad(null)}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all",
                      highlightedSquad === squad.id
                        ? `${squad.bg} ${squad.border}`
                        : "border-transparent hover:bg-muted",
                    )}
                  >
                    <div className={`font-bold text-sm ${squad.color}`}>
                      {squad.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {squad.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-accent/10 p-4 border border-accent/20">
              <p className="text-white text-xs text-accent-foreground font-mono">
                <strong>Nota:</strong> Se o Squad de Monetização fizer deploy de
                um bug, apenas o banner de Ads quebra. O Player e a Lista
                continuam funcionando.
              </p>
            </div>
          </div>

          {/* Visual Simulation of Spotify UI */}
          <div className="aspect-video bg-black/90 rounded-xl border border-white/10 p-4 flex flex-col relative overflow-hidden shadow-2xl">
            {/* Top Bar */}
            <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 mb-4">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="text-xs text-zinc-500 font-mono">
                Music App Shell
              </div>
            </div>

            <div className="flex-1 flex gap-4 overflow-hidden">
              {/* Sidebar */}
              <div className="w-1/4 h-full bg-white/5 rounded-lg p-3 space-y-2">
                <div className="h-4 w-1/2 bg-white/10 rounded mb-4" />
                <div className="h-3 w-full bg-white/10 rounded" />
                <div className="h-3 w-3/4 bg-white/10 rounded" />
                <div className="h-3 w-5/6 bg-white/10 rounded" />
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col gap-4">
                {/* Discovery MFE */}
                <div
                  className={cn(
                    "flex-1 bg-gradient-to-br from-indigo-900/50 to-transparent rounded-lg p-6 transition-all duration-300 border-2",
                    highlightedSquad === "discovery"
                      ? "border-blue-500 scale-[1.02] shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                      : "border-transparent hover:border-white/10",
                  )}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Search className="h-5 w-5 text-white/50" />
                    <span className="text-sm font-bold text-white/80">
                      Discovery MFE
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="aspect-square bg-white/10 rounded-md animate-pulse"
                      />
                    ))}
                  </div>
                </div>

                {/* Ads MFE */}
                <div
                  className={cn(
                    "h-24 bg-gradient-to-r from-yellow-900/30 to-transparent rounded-lg p-4 flex items-center justify-between transition-all duration-300 border-2",
                    highlightedSquad === "ads"
                      ? "border-yellow-500 scale-[1.02] shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                      : "border-transparent hover:border-white/10",
                  )}
                >
                  <div>
                    <div className="text-sm font-bold text-yellow-500 mb-1">
                      Premium Plan
                    </div>
                    <div className="text-xs text-white/60">
                      Listen without limits.
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-white/10 rounded text-xs text-white">
                    Upgrade
                  </div>
                </div>
              </div>
            </div>

            {/* Player MFE */}
            <div
              className={cn(
                "mt-4 h-20 bg-zinc-900 rounded-t-lg border-t border-white/10 flex items-center px-6 justify-between transition-all duration-300 relative z-10 border-2",
                highlightedSquad === "player"
                  ? "border-green-500 scale-[1.01] shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                  : "border-transparent",
              )}
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-white/20 rounded" />
                <div className="space-y-1">
                  <div className="h-3 w-24 bg-white/20 rounded" />
                  <div className="h-2 w-16 bg-white/10 rounded" />
                </div>
              </div>
              <div className="flex gap-4 text-white/70">
                <Music2 className="h-6 w-6" />
              </div>
              <div className="w-1/3 h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Matriz de Decisão e Deep Dive (Mantidos para completude) */}
      <div className="mb-24">
        <h3 className="mb-8 text-2xl font-bold text-foreground flex items-center gap-3">
          <Layers className="h-6 w-6 text-primary" />
          4. Matriz de Decisão
        </h3>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="p-5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Padrão
                </th>
                <th className="p-5 font-mono text-xs uppercase tracking-wider text-center text-primary">
                  Divisão Vertical
                </th>
                <th className="p-5 font-mono text-xs uppercase tracking-wider text-center text-accent">
                  Divisão Horizontal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-5 font-bold text-sm">Complexidade do Shell</td>
                <td className="p-5 text-center text-xs text-green-500 font-bold bg-green-500/5">
                  Baixa (Router)
                </td>
                <td className="p-5 text-center text-xs text-orange-500 font-bold bg-orange-500/5">
                  Alta (Orquestrador)
                </td>
              </tr>
              <tr>
                <td className="p-5 font-bold text-sm">Compartilhamento de JS</td>
                <td className="p-5 text-center text-xs text-muted-foreground">
                  Opcional (Duplicação aceitável)
                </td>
                <td className="p-5 text-center text-xs text-red-500 font-bold bg-red-500/5">
                  Crítico (Single Runtime)
                </td>
              </tr>
              <tr>
                <td className="p-5 font-bold text-sm">Resiliência</td>
                <td className="p-5 text-center text-xs text-muted-foreground">
                  MFE falha = Tela em branco
                </td>
                <td className="p-5 text-center text-xs text-blue-500 font-bold bg-blue-500/5">
                  Degradação Graciosa
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. A Arquitetura Híbrida */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-primary/10 p-10">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Network className="h-64 w-64" />
        </div>
        <div className="relative z-10">
          <h3 className="mb-6 text-2xl font-bold text-foreground flex items-center gap-3">
            <Network className="h-6 w-6 text-primary" />
            5. O Caminho do Meio: Híbrido
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Sistemas maduros usam <strong>Jornada Vertical</strong> para separar
            grandes domínios (Loja vs Admin) e <strong>Widgets Horizontais</strong>{" "}
            para funcionalidades transversais (Chat, Carrinho, Menu).
          </p>
          <div className="px-6 py-3 rounded-full bg-muted border border-border text-sm text-muted-foreground font-medium italic inline-block">
            "Module Federation é a cola que permite essa hibridização."
          </div>
        </div>
      </div>
    </section>
  );
}