"use client";

import { CodeBlock } from "@/components/code-block";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  EyeOff,
  History,
  Lock,
  Paintbrush,
  Search as SearchIcon,
  ShoppingCart,
  Terminal,
  XCircle,
} from "lucide-react";
import { useState } from "react";

export function ChallengeTwoSection() {
  const [mfeState, setMfeState] = useState<"only-a" | "conflict" | "shadow-on">(
    "only-a",
  );
  const [logs, setLogs] = useState<
    { mfe: string; msg: string; trace?: string; color: string }[]
  >([]);

  // Simulação de Logs de Observabilidade
  const addLog = (
    mfe: string,
    msg: string,
    color: string,
    hasTrace = false,
  ) => {
    const newLog = {
      mfe,
      msg,
      color,
      trace: hasTrace ? "tr-88f-sbc" : undefined,
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 5));
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      {/* HEADER */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-4 py-2 mb-4">
          <History className="h-4 w-4 text-destructive" />
          <span className="font-mono text-[10px] text-destructive font-bold uppercase tracking-widest">
            Análise de Post-Mortem
          </span>
        </div>
        <h2 className="text-3xl font-bold text-foreground md:text-5xl tracking-tighter">
          Vazamento de Estilo e Observabilidade
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
          No mundo dos Microfrontends, o isolamento é uma ilusão. Sem
          governança, o<strong> efeito colateral</strong> de um time vira o{" "}
          <strong>incidente</strong> de outro.
        </p>
      </div>

      {/* 1. O VIZINHO BARULHENTO (INCIDENTE CSS) */}
      <div className="mb-24 space-y-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold flex items-center gap-2 text-destructive">
            <Paintbrush className="h-6 w-6" />
            1. Vazamento de Estilo: O Vizinho Barulhento
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            No backend, o isolamento é via <strong>Schema</strong>. No frontend,
            o CSS é global. Se o Time de Busca (MFE B) injeta um estilo
            genérico, ele quebra o Checkout (MFE A) sem permissão.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-zinc-950 p-8 shadow-2xl overflow-hidden relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* VISUALIZAÇÃO DO BROWSER */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  DOM State: {mfeState}
                </span>
                {mfeState === "conflict" && (
                  <div className="flex items-center gap-1 text-destructive animate-pulse text-[10px] font-bold">
                    <AlertTriangle className="h-3 w-3" />{" "}
                    STYLE_COLLISION_DETECTED
                  </div>
                )}
              </div>

              <div className="space-y-4 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                {/* MFE A - CHECKOUT */}
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                  <div className="flex items-center gap-2 mb-3 text-emerald-500 text-[10px] font-bold uppercase">
                    <ShoppingCart className="h-3 w-3" /> MFE_Checkout
                  </div>
                  {/* O BOTÃO QUE MUDA */}
                  <button
                    className={cn(
                      "w-full py-3 rounded-lg font-bold transition-all duration-500",
                      mfeState === "only-a" &&
                        "bg-emerald-600 text-white shadow-lg",
                      mfeState === "conflict" &&
                        "opacity-0 scale-90 bg-transparent text-transparent border-dashed border-zinc-700",
                      mfeState === "shadow-on" &&
                        "bg-emerald-600 text-white ring-4 ring-primary/20",
                    )}
                  >
                    {mfeState === "conflict" ? "???" : "FINALIZAR COMPRA"}
                  </button>
                </div>

                {/* MFE B - SEARCH (SÓ APARECE NO CONFLITO) */}
                {(mfeState === "conflict" || mfeState === "shadow-on") && (
                  <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-2 mb-3 text-blue-400 text-[10px] font-bold uppercase">
                      <SearchIcon className="h-3 w-3" /> MFE_Search (Squad B)
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 h-8 bg-zinc-800 rounded border border-zinc-700" />
                      <button className="px-3 bg-zinc-700 rounded text-[10px] text-white">
                        Buscar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CONTROLES DIDÁTICOS */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setMfeState("only-a")}
                  className={cn(
                    "p-4 rounded-xl border font-bold text-xs transition-all",
                    mfeState === "only-a"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-zinc-800 bg-zinc-900 text-zinc-500",
                  )}
                >
                  1. Só MFE_Checkout (OK)
                </button>
                <button
                  onClick={() => setMfeState("conflict")}
                  className={cn(
                    "p-4 rounded-xl border font-bold text-xs transition-all",
                    mfeState === "conflict"
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-zinc-800 bg-zinc-900 text-zinc-500",
                  )}
                >
                  2. Injetar MFE_Search (QUEBRA TUDO)
                </button>
                <button
                  onClick={() => setMfeState("shadow-on")}
                  className={cn(
                    "p-4 rounded-xl border font-bold text-xs transition-all",
                    mfeState === "shadow-on"
                      ? "border-primary bg-primary/20 text-white shadow-lg"
                      : "border-zinc-800 bg-zinc-900 text-zinc-500",
                  )}
                >
                  3. Ativar SHADOW DOM (PROTEÇÃO)
                </button>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <h4 className="text-[10px] font-bold uppercase text-zinc-500 mb-2 tracking-widest">
                  O que está acontecendo?
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {mfeState === "conflict" ? (
                    <span className="text-destructive font-bold">
                      O MFE_Search injetou "button {"{ opacity: 0 }"}" no escopo
                      global. Como o browser compartilha o mesmo DOM, o botão do
                      Checkout sumiu!
                    </span>
                  ) : mfeState === "shadow-on" ? (
                    <span className="text-emerald-500 font-bold">
                      Shadow DOM ativo: O MFE_Checkout agora está em uma
                      "firewall" nativa. O estilo destrutivo da Busca não
                      consegue cruzar a barreira.
                    </span>
                  ) : (
                    "O sistema está estável porque apenas um contexto de estilo está ativo."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SHADOW DOM EXPLAINER */}
      <div className="mb-24 space-y-8">
        <div className="flex items-center gap-3">
          <Lock className="h-8 w-8 text-primary" />
          <h3 className="text-2xl font-bold uppercase tracking-tight text-white">
            Shadow DOM: A Firewall do Frontend
          </h3>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          O <strong>Shadow DOM</strong> é o equivalente ao{" "}
          <strong>Namespace de Kernel</strong> ou um <strong>Container</strong>{" "}
          no backend. Ele garante que o código interno tenha seu próprio
          "universo" privado.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50">
            <h5 className="text-xs font-bold text-primary uppercase mb-4 tracking-widest">
              O Encapsulamento Nativo
            </h5>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />{" "}
                <span>
                  <strong>Scoped CSS:</strong> Estilos declarados dentro não
                  vazam para fora.
                </span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />{" "}
                <span>
                  <strong>Isolamento de ID:</strong> IDs duplicados entre MFEs
                  deixam de ser um problema.
                </span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />{" "}
                <span>
                  <strong>Proteção de Eventos:</strong> Eventos podem ser
                  "retargeted" para não vazar detalhes internos.
                </span>
              </li>
            </ul>
          </div>
          <CodeBlock language="javascript" filename="shadow-dom-example.js">
            {`const shadow = el.attachShadow({ mode: 'closed' });
shadow.innerHTML = \`
  <style>
    /* Este botão NUNCA será afetado por fora */
    button { background: #10b981; color: white; }
  </style>
  <button>Pago e Seguro</button>
\`;`}
          </CodeBlock>
        </div>
      </div>

      {/* 3. A CRISE DE OBSERVABILIDADE (LOGS CONCORRENTES) */}
      <div className="my-24 space-y-8">
        <div className="flex items-center gap-3">
          <Activity className="h-8 w-8 text-primary" />
          <h3 className="text-2xl font-bold uppercase tracking-tight text-white">
            Observabilidade Distribuída
          </h3>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          No backend, você tem <strong>Jaeger</strong> ou{" "}
          <strong>Zipkin</strong>. No Frontend distribuído, se dois MFEs
          disparam eventos ao mesmo tempo, você fica "cego" sem um Contexto de
          Trace.
        </p>

        <div className="rounded-3xl border border-border bg-zinc-950 p-8 lg:p-12 shadow-2xl overflow-hidden relative min-h-[500px]">
          <div className="grid lg:grid-cols-2 gap-12 h-full">
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                Simulador de Eventos Concorrentes
              </h4>
              <div className="flex gap-4">
                <button
                  onClick={() =>
                    addLog("MFE_Auth", "Refresh Token Start", "text-blue-400")
                  }
                  className="flex-1 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-blue-400/50 transition-all text-[10px] font-bold"
                >
                  Disparar MFE_Auth
                </button>
                <button
                  onClick={() =>
                    addLog("MFE_Cart", "Add Item to Cart", "text-emerald-400")
                  }
                  className="flex-1 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-emerald-400/50 transition-all text-[10px] font-bold"
                >
                  Disparar MFE_Cart
                </button>
              </div>
              <button
                onClick={() => {
                  addLog("MFE_Auth", "Login Flow", "text-blue-400", true);
                  addLog("MFE_Cart", "Checkout Flow", "text-emerald-400", true);
                }}
                className="w-full p-4 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-all text-[10px] font-bold"
              >
                SIMULAR EVENTOS COM TRACING (CORRECT)
              </button>

              <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-xl space-y-2">
                <h5 className="text-[10px] font-bold text-destructive flex items-center gap-1">
                  <EyeOff className="h-3 w-3" /> GARGALO: RACE CONDITIONS
                </h5>
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  Sem <strong>Correlation IDs</strong>, os logs no
                  Datadog/Sentry chegam misturados. Você não consegue saber se o
                  erro no Carrinho foi causado por uma falha silenciosa na
                  Autenticação.
                </p>
              </div>
            </div>

            {/* TERMINAL DE LOGS */}
            <div className="bg-black/80 rounded-2xl border border-zinc-800 p-6 font-mono text-xs overflow-hidden shadow-inner flex flex-col">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-zinc-900">
                <Terminal className="h-4 w-4 text-zinc-500" />
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  Runtime Console Log
                </span>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto">
                {logs.length === 0 && (
                  <div className="text-zinc-700 italic">
                    Aguardando eventos...
                  </div>
                )}
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className="animate-in slide-in-from-left-2 duration-300"
                  >
                    <span className={cn("font-bold", log.color)}>
                      [{log.mfe}]
                    </span>
                    <span className="text-zinc-300 ml-2">{log.msg}</span>
                    {log.trace ? (
                      <span className="ml-3 px-1 bg-emerald-500/10 text-emerald-500 text-[9px] border border-emerald-500/20 rounded">
                        Trace: {log.trace}
                      </span>
                    ) : (
                      <span className="ml-3 px-1 bg-destructive/10 text-destructive text-[9px] border border-destructive/20 rounded">
                        NO_TRACE
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BALA DE PRATA (CONCLUSAO IMPACTANTE) */}
      <div className="mt-40 border-t border-zinc-800 pt-24 text-center">
        <div className="relative inline-block mb-12">
          {/* ILUSTRAÇÃO BALA DE PRATA */}
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
            <div className="w-32 h-10 bg-gradient-to-r from-zinc-300 via-zinc-100 to-zinc-500 rounded-r-full shadow-2xl relative z-10" />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <XCircle
                className="h-full w-full text-destructive opacity-30"
                strokeWidth={0.5}
              />
            </div>
          </div>
          <div className="absolute -top-4 -right-4 bg-destructive text-white px-3 py-1 rounded-full text-xs font-black uppercase shadow-lg">
            STOP
          </div>
        </div>

        <h3 className="text-4xl font-black text-foreground uppercase tracking-tighter mb-8 md:text-7xl">
          MFE não é Bala de Prata.
        </h3>

        <p className="text-xl md:text-2xl text-muted-foreground mb-16 leading-relaxed max-w-4xl mx-auto">
          Microfrontends resolvem <strong>Problemas de Organização</strong>{" "}
          (times gigantes), mas criam <strong>Pesadelos de Engenharia</strong>.
        </p>

        <div className="grid md:grid-cols-2 gap-8 text-left max-w-5xl mx-auto">
          <div className="p-10 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 transition-all hover:bg-emerald-500/10">
            <h5 className="text-emerald-500 font-bold text-sm mb-6 flex items-center gap-3 uppercase tracking-[0.2em]">
              <CheckCircle2 className="h-6 w-6" /> QUANDO ADOTAR
            </h5>
            <ul className="text-lg md:text-xl text-zinc-300 space-y-4">
              <li className="flex gap-3">
                <span>•</span> <span>3+ squads no mesmo produto</span>
              </li>
              <li className="flex gap-3">
                <span>•</span>{" "}
                <span>Necessidade real de deploy independente</span>
              </li>
              <li className="flex gap-3">
                <span>•</span> <span>Monólito impossível de compilar</span>
              </li>
            </ul>
          </div>
          <div className="p-10 rounded-3xl bg-destructive/5 border border-destructive/10 transition-all hover:bg-destructive/10">
            <h5 className="text-destructive font-bold text-sm mb-6 flex items-center gap-3 uppercase tracking-[0.2em]">
              <XCircle className="h-6 w-6" /> QUANDO EVITAR
            </h5>
            <ul className="text-lg md:text-xl text-zinc-300 space-y-4">
              <li className="flex gap-3">
                <span>•</span> <span>Times pequenos (menos de 10 pessoas)</span>
              </li>
              <li className="flex gap-3">
                <span>•</span> <span>Foco absoluto em Performance / SEO</span>
              </li>
              <li className="flex gap-3">
                <span>•</span> <span>Aplicação simples (CRUD)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-24 pt-16 border-t border-zinc-900">
          <blockquote className="text-2xl md:text-5xl text-zinc-500 font-mono italic leading-tight tracking-tighter">
            "Se você não gerencia as dependências de um monólito, <br />
            você terá um{" "}
            <span className="text-destructive font-black underline decoration-destructive/30">
              pesadelo distribuído
            </span>{" "}
            no browser."
          </blockquote>
        </div>
      </div>
    </section>
  );
}
