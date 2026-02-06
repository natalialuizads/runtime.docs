"use client";

import { CodeBlock } from "@/components/code-block";
import { DynamicDiagram } from "@/components/dynamic-diagram";
import { cn } from "@/lib/utils";
import {
  ArrowLeftRight,
  Boxes,
  Database,
  Info,
  Link2,
  MessageSquare,
  Radio,
  Share2,
  ShieldAlert,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { useState } from "react";

type CommPattern = "events" | "props" | "state" | "url" | "broadcast";

interface CommPatternInfo {
  id: CommPattern;
  name: string;
  backendAnalogy: string;
  icon: React.ElementType;
  coupling: number; // 1 (baixo) a 3 (alto)
  description: string;
  bestFor: string;
  codeSnippet: string;
}

const commPatterns: CommPatternInfo[] = [
  {
    id: "events",
    name: "Custom Events",
    backendAnalogy: "Event Bus / Pub-Sub (RabbitMQ)",
    icon: Radio,
    coupling: 1,
    description:
      "O MFE A dispara um sinal no 'barramento global' (window). O MFE B reage se estiver ouvindo. Eles nunca precisam se conhecer.",
    bestFor: "Notificações e ações transversais assíncronas",
    codeSnippet: `// MFE Vendas (Publisher)
window.dispatchEvent(new CustomEvent('cart:update', { detail: { count: 5 } }));

// MFE Header (Subscriber)
window.addEventListener('cart:update', (e) => {
  setCartBadge(e.detail.count);
});`,
  },
  {
    id: "props",
    name: "Props / Attributes",
    backendAnalogy: "Dependency Injection (DI)",
    icon: ArrowLeftRight,
    coupling: 2,
    description:
      "O App Shell injeta dados diretamente no MFE no momento da montagem. Síncrono e direto.",
    bestFor: "Configurações, Feature Flags e Contexto Inicial",
    codeSnippet: `// Injeção via Web Component ou React Prop
<mfe-checkout 
  api-url="https://api.vendas.com" 
  theme="dark" 
/>`,
  },
  {
    id: "state",
    name: "Shared State",
    backendAnalogy: "Shared Memory / Redis",
    icon: Share2,
    coupling: 3,
    description:
      "Uma store única (Zustand/Redux) acessada por múltiplos MFEs. Alto desempenho, mas exige governança rígida.",
    bestFor: "Sessão do Usuário e Carrinho de Compras (Single Source of Truth)",
    codeSnippet: `// Shared Store via Module Federation
import { useSharedStore } from 'shell/store';

const { user, token } = useSharedStore();`,
  },
  {
    id: "url",
    name: "URL / Query Params",
    backendAnalogy: "Request Parameters",
    icon: Link2,
    coupling: 1,
    description:
      "A URL é o estado mais resiliente. Se o usuário atualizar a página (F5), o estado não se perde.",
    bestFor: "Filtros de busca, Paginação e Deep Linking",
    codeSnippet: `// MFE A altera a URL
history.push('/busca?categoria=livros');

// MFE B lê os parâmetros
const cat = searchParams.get('categoria');`,
  },
  {
    id: "broadcast",
    name: "Broadcast Channel",
    backendAnalogy: "Inter-Process Communication (IPC)",
    icon: MessageSquare,
    coupling: 1,
    description:
      "Comunicação nativa entre diferentes abas ou iframes do mesmo domínio.",
    bestFor: "Sincronizar Logout ou Refresh de Token entre abas",
    codeSnippet: `const channel = new BroadcastChannel('auth_sync');
channel.postMessage({ type: 'LOGOUT' });

channel.onmessage = () => logoutLocal();`,
  },
];

export function MFECommunicationSection() {
  const [selectedPattern, setSelectedPattern] = useState<CommPattern>("events");
  const [cartCount, setCartCount] = useState(0);
  const [isPacketMoving, setIsPacketMoving] = useState(false);
  const current = commPatterns.find((p) => p.id === selectedPattern)!;

  const simulateEvent = () => {
    setIsPacketMoving(true);
    setTimeout(() => {
      setCartCount((prev) => prev + 1);
      setIsPacketMoving(false);
    }, 1000);
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 mb-4">
          <Share2 className="h-4 w-4 text-accent" />
          <span className="font-mono text-xs text-accent">
            GOVERNANÇA DE DADOS
          </span>
        </div>
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          Como os micro-serviços do Front conversam?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
          No mundo MFE, comunicação excessiva é sintoma de{" "}
          <strong>acoplamento mal resolvido</strong>. Traduzimos os padrões de
          backend para a realidade do browser.
        </p>
      </div>

      {/* TRADUTOR PARA BACKENDERS */}
      <div className="mb-12 grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6 border-l-4 border-l-primary">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
            <Database className="h-5 w-5 text-primary" />
            Dica para Backenders
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pense no <strong>Window Object</strong> como o seu{" "}
            <strong>Message Broker</strong>. Cada MFE é um serviço isolado que
            não sabe da existência do outro, apenas do contrato de dados.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 border-l-4 border-l-accent">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-accent" />A Sessão como "Banco"
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Em vez de passar dados o tempo todo (acoplamento), prefira usar uma{" "}
            <strong>Sessão Própria</strong> compartilhada. O MFE escreve, o
            outro apenas lê quando precisa.
          </p>
        </div>
      </div>

      {/* LIVE SIMULATOR (DIDÁTICA EM TEMPO REAL) */}
      <div className="mb-16 rounded-2xl border border-border bg-zinc-950 p-8 shadow-inner overflow-hidden relative">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-zinc-400">
              Barramento de Comunicação Ativo
            </span>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800">
            <ShoppingCart className="h-4 w-4 text-accent" />
            <span className="text-xs font-bold text-zinc-100">
              Badge Carrinho: {cartCount}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center relative py-4">
          {/* MFE A */}
          <div className="z-10 bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col items-center gap-2 shadow-xl">
            <span className="text-[10px] font-mono text-primary font-bold">
              MFE_CATALOGO
            </span>
            <button
              onClick={simulateEvent}
              disabled={isPacketMoving}
              className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-4 py-2 rounded-md transition-all active:scale-95 disabled:opacity-50"
            >
              Add Item
            </button>
          </div>

          {/* O PACOTE ANIMADO */}
          <div
            className={cn(
              "absolute h-1 w-1 bg-accent rounded-full shadow-[0_0_15px_rgba(var(--accent),0.8)] transition-all duration-1000 ease-in-out",
              isPacketMoving
                ? "left-[85%] opacity-100 scale-150"
                : "left-[15%] opacity-0 scale-100",
            )}
          />

          {/* MFE B */}
          <div className="z-10 bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col items-center gap-2 shadow-xl">
            <span className="text-[10px] font-mono text-accent font-bold">
              MFE_HEADER
            </span>
            <div className="flex items-center gap-2 text-zinc-400 text-xs">
              <Radio
                className={cn(
                  "h-3 w-3",
                  isPacketMoving && "text-accent animate-pulse",
                )}
              />
              Listening...
            </div>
          </div>

          <div className="absolute top-1/2 left-0 w-full h-px bg-zinc-800 border-t border-dashed border-zinc-700 -z-0" />
        </div>
      </div>

      {/* PATTERN SELECTOR COM INDICADOR DE ACOPLAMENTO */}
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-bold flex items-center gap-2">
          Padrões de Comunicação
          <span className="text-xs font-normal text-muted-foreground">
            (Selecione para ver o código)
          </span>
        </h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {commPatterns.map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => setSelectedPattern(pattern.id)}
              className={cn(
                "group flex flex-col items-center gap-3 rounded-xl border p-5 transition-all",
                selectedPattern === pattern.id
                  ? "border-accent bg-accent/5 ring-1 ring-accent/20"
                  : "border-border bg-card hover:border-border/80",
              )}
            >
              <pattern.icon
                className={cn(
                  "h-6 w-6",
                  selectedPattern === pattern.id
                    ? "text-accent"
                    : "text-muted-foreground",
                )}
              />
              <span className="text-center font-bold text-xs">
                {pattern.name}
              </span>
              <div className="flex gap-0.5 mt-1">
                {[1, 2, 3].map((lvl) => (
                  <div
                    key={lvl}
                    className={cn(
                      "w-3 h-1 rounded-full",
                      lvl <= pattern.coupling
                        ? pattern.coupling === 3
                          ? "bg-destructive"
                          : "bg-accent"
                        : "bg-muted",
                    )}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* DETAIL AREA */}
      <div className="grid lg:grid-cols-5 gap-8 mb-16">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm h-full">
            <div className="mb-6">
              <h4 className="text-2xl font-bold mb-1">{current.name}</h4>
              <div className="text-[10px] font-mono font-bold text-accent bg-accent/5 inline-block px-2 py-1 rounded">
                ANALOGIA: {current.backendAnalogy}
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
              {current.description}
            </p>
            <div className="p-3 rounded-lg bg-muted/50 text-xs flex items-center gap-2">
              <Info className="h-4 w-4 text-accent" />
              <span>
                <strong>Melhor para:</strong> {current.bestFor}
              </span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-3">
          <CodeBlock language="typescript" filename={current.id + ".ts"}>
            {current.codeSnippet}
          </CodeBlock>
        </div>
      </div>

      {/* FINAL DIAGRAM */}
      <div className="mt-16">
        <h3 className="mb-6 text-xl font-bold flex items-center gap-2">
          <Boxes className="h-6 w-6 text-primary" />
          Visão Geral da Arquitetura
        </h3>
        <div className="rounded-2xl border border-border bg-card/50 p-8">
          <DynamicDiagram
            title="Fluxo de Governança de Dados"
            nodes={[
              {
                id: "shell",
                label: "App Shell",
                icon: Zap,
                x: 50,
                y: 15,
                color: "border-primary",
              },
              {
                id: "bus",
                label: "Window / Event Bus",
                icon: Radio,
                x: 50,
                y: 50,
                color: "border-accent",
              },
              { id: "mfe1", label: "MFE Remoto A", icon: Boxes, x: 20, y: 85 },
              { id: "mfe2", label: "MFE Remoto B", icon: Boxes, x: 80, y: 85 },
            ]}
            edges={[
              { from: "mfe1", to: "bus", animated: true, label: "Dispatch" },
              { from: "bus", to: "mfe2", animated: true, label: "Listen" },
              { from: "shell", to: "bus", label: "Provide Store" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
