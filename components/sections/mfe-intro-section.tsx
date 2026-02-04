"use client";

import { ComparisonTable } from "@/components/comparison-table";
import { MFEMemorySimulator } from "@/components/interactive/mfe-memory-simulator";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Cpu,
  Link2Off,
  Monitor,
  Server,
  ShieldAlert,
  Timer,
  XCircle,
  Zap,
} from "lucide-react";

export function MFEIntroSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      {/* HEADER TÉCNICO */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-4 py-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <span className="font-mono text-xs text-destructive font-bold uppercase">
            Quebra de Paradigma
          </span>
        </div>
        <h2 className="text-3xl font-bold text-foreground md:text-5xl tracking-tighter">
          MFE não é Microserviço.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl border-l-2 border-primary pl-4">
          No backend, o isolamento é físico (Containers/VMs). No frontend, é
          apenas uma convenção lógica dentro de uma{" "}
          <strong className="text-foreground">Single Thread compartilhada</strong>.
        </p>
      </div>

      {/* ANALOGIA DE RECURSOS (Backend vs Frontend) */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <div className="p-6 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 text-blue-500 mb-4">
            <Server className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Backend (Kubernetes)
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Processos isolados pelo Kernel. Memória (Heap) e CPU são garantidos
            por limites do container (cgroups). Um crash isolado não derruba o cluster.
          </p>
        </div>
        <div className="p-6 rounded-2xl border border-border bg-card ring-1 ring-destructive/20">
          <div className="flex items-center gap-2 text-destructive mb-4">
            <Monitor className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Frontend (Browser)
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Todos os MFEs competem pelo mesmo <strong>Event Loop</strong> e memória global (window). Um loop infinito em um MFE trava a aba inteira do navegador.
          </p>
        </div>
      </div>

      {/* GARGALO DE ORQUESTRAÇÃO: WATERFALL */}
      <div className="my-20 space-y-8">
        <div className="flex items-center gap-3">
          <Timer className="h-8 w-8 text-amber-500" />
          <h3 className="text-2xl font-bold tracking-tight">
            O Gargalo da Orquestração (I/O Bloqueante)
          </h3>
        </div>

        <div className="grid lg:grid-cols-5 gap-4 items-stretch">
          {/* Explicação do Problema */}
          <div className="lg:col-span-2">
            <div className="p-6 rounded-xl border border-border bg-secondary/5 h-full flex flex-col justify-center">
              <h4 className="text-xs font-bold uppercase text-muted-foreground mb-4">
                O Problema do "Await" em Cascata
              </h4>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Diferente de chamadas RPC rápidas no backend, carregar um MFE envolve <strong>network requests de arquivos JS</strong>. Fazer isso sequencialmente destrói a performance.
              </p>
              <div className="space-y-3 font-mono text-[10px]">
                <div className="flex items-center gap-2 text-destructive font-bold">
                  <XCircle className="h-3 w-3" /> 1. Load Shell (400ms)
                </div>
                <div className="flex items-center gap-2 text-zinc-500 pl-4">
                  <ArrowRight className="h-3 w-3" /> 2. Load Auth MFE (300ms)
                </div>
                <div className="flex items-center gap-2 text-zinc-500 pl-8">
                  <ArrowRight className="h-3 w-3" /> 3. Load Dashboard MFE (800ms)
                </div>
                <div className="mt-2 pt-2 border-t border-destructive/20 text-destructive font-bold">
                  TOTAL BLOQUEADO: 1.5s
                </div>
              </div>
            </div>
          </div>

          {/* Visualização do Waterfall */}
          <div className="lg:col-span-3">
            <div className="p-6 rounded-xl border border-border bg-card h-full flex flex-col justify-center">
              <h4 className="text-xs font-bold uppercase text-muted-foreground mb-6">
                Visualização de Pipeline
              </h4>
              
              <div className="mt-8 space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] mb-1 font-bold text-destructive">
                    <span>SEQUENCIAL (BAD)</span>
                    <span>1.5s</span>
                  </div>
                  <div className="h-3 bg-destructive/10 rounded-full overflow-hidden relative">
                    <div className="absolute inset-y-0 left-0 bg-destructive w-[30%]"></div>
                    <div className="absolute inset-y-0 left-[30%] bg-destructive/60 w-[20%]"></div>
                    <div className="absolute inset-y-0 left-[50%] bg-destructive/30 w-[50%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1 font-bold text-emerald-500">
                    <span>PARALELO (GOOD)</span>
                    <span>800ms</span>
                  </div>
                  <div className="h-3 bg-emerald-500/10 rounded-full overflow-hidden relative">
                    <div className="absolute inset-y-0 left-0 bg-emerald-500 w-[30%]"></div>
                    {/* No paralelo, os outros carregam "atrás" do maior */}
                    <div className="absolute inset-y-0 left-0 bg-emerald-500/60 w-[20%]"></div>
                    <div className="absolute inset-y-0 left-0 bg-emerald-500/30 w-[55%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MONITOR DE HEAP */}
      <div className="my-20 p-10 rounded-3xl border border-border bg-zinc-950 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Cpu className="h-24 w-24 text-accent" />
        </div>
        <div className="flex items-center gap-4 mb-10 relative z-10">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              Resource Contention: O Custo da Memória
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
              Simule o que acontece quando cada time decide usar sua própria versão do framework sem Module Federation.
            </p>
          </div>
        </div>
        <div className="relative z-10">
          <MFEMemorySimulator />
        </div>
      </div>

      {/* ERRO FATAL: MATRIOSKA (COM ILUSTRAÇÃO ESTÁTICA) */}
      <div className="my-16">
        <div className="rounded-3xl border-2 border-destructive/30 bg-destructive/5 p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute -right-10 top-10 opacity-5 rotate-12">
            <ShieldAlert className="h-64 w-64 text-destructive" />
          </div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            {/* Texto Explicativo */}
            <div>
              <h3 className="mb-6 text-3xl font-black text-destructive uppercase tracking-tighter leading-none">
                Erro Fatal: <br /> MFEs Matrioska
              </h3>

              <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                O aninhamento de Microfrontends (um MFE dentro de outro) cria uma <strong>dependência de runtime</strong>. 
                Isso força um carregamento em cascata, anulando o benefício do paralelismo.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-xl bg-background/50 border border-border">
                  <div className="mt-1 text-destructive">
                    <Link2Off className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Inércia de Inicialização</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      O MFE "filho" nem sequer começa a baixar seu JavaScript até que o "pai" tenha terminado de baixar, parsear e executar o dele.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-xl bg-background/50 border border-border">
                  <div className="mt-1 text-orange-500">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">TTI (Time-to-Interactive) Degradado</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      O usuário vê o layout, mas os botões internos não respondem até que toda a cadeia de bonecas seja carregada.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ILUSTRAÇÃO DAS BONECAS (ESTÁTICA) */}
            <div className="flex flex-col items-center justify-center pointer-events-none">
               {/* SHELL (OUTER) - Hover effect only */}
               <div className="relative w-60 h-80 bg-background border-4 border-destructive rounded-t-[45%] rounded-b-[20%] shadow-2xl flex flex-col items-center pt-5 z-30 transition-transform hover:scale-[1.02]">
                 <span className="font-bold text-destructive uppercase text-[10px] tracking-widest mb-2">App Shell (Host)</span>
                 <div className="w-10 h-1.5 bg-destructive/10 rounded-full mb-8" />

                 {/* PAGE (MIDDLE) - STATIC (No animate-bounce) */}
                 <div className="relative w-44 h-56 bg-background border-4 border-orange-500 rounded-t-[45%] rounded-b-[20%] shadow-lg flex flex-col items-center pt-4 z-40">
                   <span className="font-bold text-orange-500 uppercase text-[9px] tracking-widest mb-1">MFE Pai (Feature)</span>
                   <div className="w-8 h-1 bg-orange-500/20 rounded-full mb-6" />

                   {/* WIDGET (INNER) - STATIC */}
                   <div className="relative w-28 h-36 bg-background border-4 border-yellow-500 rounded-t-[45%] rounded-b-[20%] shadow-md flex flex-col items-center pt-3 z-50">
                     <span className="font-bold text-yellow-500 uppercase text-[7px] tracking-widest mb-1">MFE Filho (Widget)</span>
                     <div className="w-5 h-1 bg-yellow-500/20 rounded-full mb-4" />

                     {/* ICON (TINY) - Subtle pulse on icon only is usually okay, but removed for total stillness as requested */}
                     <div className="relative w-14 h-16 bg-destructive/10 border-2 border-red-500/50 rounded-t-[45%] rounded-b-[20%] flex flex-col items-center justify-center opacity-80">
                        <Zap className="h-4 w-4 text-red-500" />
                     </div>
                   </div>
                 </div>
               </div>
               {/* Label abaixo */}
                <div className="mt-8 text-center">
                  <span className="text-xs font-mono text-destructive uppercase font-bold bg-destructive/10 px-4 py-2 rounded-full border border-destructive/20">
                    Fluxo Síncrono Obrigatório
                  </span>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONCLUSÃO RÁPIDA */}
      <div className="mt-20 border-t border-border pt-8">
        <ComparisonTable
          headers={["Anti-Pattern", "Consequência Técnica", "Solução Arquitetural"]}
          rows={[
            ["Matrioska (Aninhamento)", "Waterfall de Network + TTI alto", "Composição Plana (Flat) no Shell"],
            ["Múltiplos Frameworks", "Resource Contention (RAM/CPU)", "Module Federation (Shared Scope)"],
            ["Comunicação via Props Brutas", "Acoplamento Forte", "Event Bus / Custom Events"],
          ]}
        />
      </div>
    </section>
  );
}