"use client";

import { DynamicDiagram } from "@/components/dynamic-diagram";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  AppWindow,
  ArrowLeftRight,
  Box,
  CircuitBoard,
  Globe,
  Layers,
  Layout,
  LayoutTemplate,
  MessageSquare,
  Network,
  Puzzle,
  Server,
  ShoppingCart,
  ToggleLeft,
  ToggleRight,
  User,
} from "lucide-react";
import { useState } from "react";

// --- DEMO 1: APP SHELL COMPOSER ---
function AppShellSimulator() {
  const [modules, setModules] = useState({
    header: false,
    sidebar: false,
    checkout: false,
    recommendations: false,
  });

  const toggle = (key: keyof typeof modules) => {
    setModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 border-b border-border pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <LayoutTemplate className="h-5 w-5 text-primary" />
            Simulador de App Shell
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            O App Shell é o "Container Host". Ele decide <strong>quando</strong> e <strong>onde</strong> carregar cada MFE.
          </p>
        </div>
        
        {/* Controles */}
        <div className="flex flex-wrap gap-2">
            <ToggleButton label="Header (Team A)" active={modules.header} onClick={() => toggle('header')} color="text-blue-500" />
            <ToggleButton label="Sidebar (Team B)" active={modules.sidebar} onClick={() => toggle('sidebar')} color="text-purple-500" />
            <ToggleButton label="Checkout (Team C)" active={modules.checkout} onClick={() => toggle('checkout')} color="text-green-500" />
            <ToggleButton label="Ads (Team D)" active={modules.recommendations} onClick={() => toggle('recommendations')} color="text-orange-500" />
        </div>
      </div>

      {/* A TELA (THE SHELL) */}
      <div className="relative w-full aspect-video bg-zinc-900 rounded-lg border border-border overflow-hidden shadow-2xl flex flex-col">
          
          {/* Top Bar (Browser Chrome) */}
          <div className="h-8 bg-zinc-800 border-b border-zinc-700 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              <div className="flex-1 bg-zinc-900 h-5 rounded text-[10px] text-zinc-500 flex items-center px-2 font-mono">
                  loja.com.br
              </div>
          </div>

          <div className="flex-1 flex flex-col relative">
              {/* SLOT: HEADER */}
              <div className="h-14 border-b border-dashed border-zinc-700 flex items-center justify-center relative bg-zinc-950/50">
                   {!modules.header ? (
                       <span className="text-xs font-mono text-zinc-600 animate-pulse">Waiting for Header MFE...</span>
                   ) : (
                       <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-between px-6 border-b border-blue-500/50 animate-in slide-in-from-top-2">
                           <span className="font-bold text-blue-500">Loja Inc.</span>
                           <div className="flex gap-4 text-xs text-blue-400">
                               <span>Produtos</span>
                               <span>Conta</span>
                           </div>
                       </div>
                   )}
              </div>

              <div className="flex-1 flex">
                  {/* SLOT: SIDEBAR */}
                  <div className="w-1/4 border-r border-dashed border-zinc-700 flex items-center justify-center relative bg-zinc-950/50">
                        {!modules.sidebar ? (
                            <span className="text-xs font-mono text-zinc-600 text-center px-2">Sidebar Slot</span>
                        ) : (
                            <div className="absolute inset-0 bg-purple-500/10 p-4 border-r border-purple-500/50 animate-in slide-in-from-left-2">
                                <ul className="space-y-2 text-xs text-purple-400">
                                    <li className="font-bold mb-2 text-purple-300">Categorias</li>
                                    <li>Eletrônicos</li>
                                    <li>Livros</li>
                                    <li>Casa</li>
                                </ul>
                            </div>
                        )}
                  </div>

                  {/* SLOT: MAIN CONTENT */}
                  <div className="flex-1 p-4 relative bg-zinc-900">
                      <div className="grid grid-cols-2 gap-4 h-full">
                          {/* Main Feature */}
                          <div className="col-span-2 md:col-span-1 border border-dashed border-zinc-700 rounded-lg flex items-center justify-center relative bg-zinc-950/50 h-40 md:h-auto">
                                {!modules.checkout ? (
                                    <span className="text-xs font-mono text-zinc-600">Checkout Slot</span>
                                ) : (
                                    <div className="absolute inset-0 bg-green-500/10 rounded-lg border border-green-500/50 flex flex-col items-center justify-center p-4 animate-in zoom-in-95">
                                        <ShoppingCart className="h-8 w-8 text-green-500 mb-2" />
                                        <span className="text-sm font-bold text-green-400">Resumo do Pedido</span>
                                        <button className="mt-2 bg-green-600 text-white text-xs px-3 py-1 rounded">Pagar</button>
                                    </div>
                                )}
                          </div>

                          {/* Secondary Feature */}
                          <div className="col-span-2 md:col-span-1 border border-dashed border-zinc-700 rounded-lg flex items-center justify-center relative bg-zinc-950/50 h-40 md:h-auto">
                                {!modules.recommendations ? (
                                    <span className="text-xs font-mono text-zinc-600">Ads Slot</span>
                                ) : (
                                    <div className="absolute inset-0 bg-orange-500/10 rounded-lg border border-orange-500/50 flex flex-col items-center justify-center p-4 animate-in zoom-in-95">
                                        <span className="text-xs font-bold text-orange-400 mb-1">RECOMENDADO</span>
                                        <div className="w-full h-12 bg-orange-500/20 rounded mb-2"></div>
                                        <div className="w-2/3 h-2 bg-orange-500/20 rounded"></div>
                                    </div>
                                )}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      
      <div className="mt-4 p-4 bg-muted/30 rounded border border-border text-xs text-muted-foreground font-mono flex gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <span>
              Status: O App Shell carregou {Object.values(modules).filter(Boolean).length} bundles JavaScript independentes via rede.
          </span>
      </div>
    </div>
  );
}

function ToggleButton({ label, active, onClick, color }: { label: string, active: boolean, onClick: () => void, color: string }) {
    return (
        <button 
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold border transition-all",
                active 
                    ? `bg-background border-current ${color} shadow-sm` 
                    : "bg-muted border-transparent text-muted-foreground hover:bg-muted/80"
            )}
        >
            {active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
            {label}
        </button>
    )
}

// --- DEMO 2: COMMUNICATION (EVENT BUS) ---
function EventBusDemo() {
    const [cartCount, setCartCount] = useState(0);
    const [lastEvent, setLastEvent] = useState<string | null>(null);

    const emitEvent = () => {
        const eventId = Math.random().toString(36).substring(7);
        setLastEvent(`[${eventId}] 'cart:add'`);
        
        // Simula latência de processamento
        setTimeout(() => {
            setCartCount(c => c + 1);
        }, 100);
    };

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm mt-8">
            <div className="mb-6">
                <h4 className="flex items-center gap-2 text-lg font-bold text-foreground">
                    <MessageSquare className="h-5 w-5 text-accent" />
                    Comunicação Desacoplada (Pub/Sub)
                </h4>
                <p className="text-sm text-muted-foreground">
                    Como o MFE "Produto" avisa o MFE "Header" que o carrinho atualizou sem se conhecerem?
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-center relative">
                
                {/* MFE A */}
                <div className="border border-purple-500/30 bg-purple-500/5 rounded-lg p-4 flex flex-col items-center gap-3">
                    <div className="text-xs font-bold text-purple-500 uppercase tracking-wide">MFE: Produto</div>
                    <Box className="h-8 w-8 text-purple-500" />
                    <button 
                        onClick={emitEvent}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-2 rounded-md transition-colors active:scale-95"
                    >
                        Adicionar ao Carrinho
                    </button>
                </div>

                {/* THE BUS */}
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="h-0.5 w-full bg-border absolute top-1/2 -z-10 hidden md:block"></div>
                    <div className={cn(
                        "z-10 bg-background border rounded-full px-3 py-1 text-xs font-mono transition-all duration-300",
                        lastEvent ? "border-accent text-accent scale-110 shadow-accent/20 shadow-lg" : "border-muted text-muted-foreground"
                    )}>
                        {lastEvent || "Event Bus (Idle)"}
                    </div>
                    <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                </div>

                {/* MFE B */}
                <div className="border border-blue-500/30 bg-blue-500/5 rounded-lg p-4 flex flex-col items-center gap-3">
                    <div className="text-xs font-bold text-blue-500 uppercase tracking-wide">MFE: Header</div>
                    <div className="relative">
                        <ShoppingCart className="h-8 w-8 text-blue-500" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full animate-in zoom-in">
                                {cartCount}
                            </span>
                        )}
                    </div>
                    <div className="text-xs text-blue-400">
                        Ouvindo 'cart:add'...
                    </div>
                </div>

            </div>
        </div>
    )
}

export function MFEDeepDiveSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2">
          <span className="font-mono text-xs text-accent">DEEP DIVE</span>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-foreground md:text-3xl">
          Microfrontends: A Arquitetura de "Shopping Center"
        </h2>
        <p className="mt-2 text-muted-foreground">
          Vamos desmistificar o MFE usando analogias que todo Backend Developer conhece.
        </p>
      </div>

      {/* Rosetta Stone: Backend vs Frontend */}
      <div className="grid gap-6 md:grid-cols-2 mb-12">
          <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-bold flex items-center gap-2 mb-4">
                  <Server className="h-5 w-5 text-muted-foreground" />
                  Mundo Backend
              </h3>
              <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                      <CircuitBoard className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                          <span className="block font-bold text-sm">Microsserviço</span>
                          <span className="text-xs text-muted-foreground">Docker container rodando uma API isolada (User Service).</span>
                      </div>
                  </li>
                  <li className="flex items-start gap-3">
                      <Network className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                          <span className="block font-bold text-sm">API Gateway (Nginx)</span>
                          <span className="text-xs text-muted-foreground">Recebe o request e decide para qual serviço encaminhar.</span>
                      </div>
                  </li>
              </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-bold flex items-center gap-2 mb-4">
                  <AppWindow className="h-5 w-5 text-muted-foreground" />
                  Mundo Frontend
              </h3>
               <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                      <Puzzle className="h-5 w-5 text-accent mt-0.5" />
                      <div>
                          <span className="block font-bold text-sm">Microfrontend</span>
                          <span className="text-xs text-muted-foreground">Arquivo JS isolado que renderiza um pedaço da tela (Header).</span>
                      </div>
                  </li>
                  <li className="flex items-start gap-3">
                      <Layout className="h-5 w-5 text-accent mt-0.5" />
                      <div>
                          <span className="block font-bold text-sm">App Shell</span>
                          <span className="text-xs text-muted-foreground">A página "mãe". Faz o fetch dos JS files e monta o quebra-cabeça.</span>
                      </div>
                  </li>
              </ul>
          </div>
      </div>

      <AppShellSimulator />

      {/* Architecture Diagram */}
      <div className="mt-12">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          Arquitetura de Referência
        </h3>
        <p className="mb-6 text-muted-foreground">
             Como isso funciona fisicamente na infraestrutura:
        </p>
        <DynamicDiagram
          title="Module Federation (Runtime)"
          nodes={[
            {
              id: "cdn",
              label: "CDN / S3",
              icon: Globe,
              x: 50,
              y: 15,
              color: "border-chart-4",
            },
            {
              id: "shell",
              label: "App Shell (Host)",
              icon: Layout,
              x: 50,
              y: 45,
              color: "border-primary",
            },
            { id: "mfe1", label: "MFE A (Header)", icon: Box, x: 20, y: 75 },
            { id: "mfe2", label: "MFE B (Cart)", icon: Box, x: 80, y: 75 },
          ]}
          edges={[
            { from: "cdn", to: "shell", animated: true, label: "Load index.html" },
            { from: "shell", to: "mfe1", animated: true, label: "Import 'remoteEntry.js'" },
            { from: "shell", to: "mfe2", animated: true, label: "Import 'remoteEntry.js'" },
          ]}
        />
      </div>
    </section>
  );
}