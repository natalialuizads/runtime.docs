"use client";

import { CodeBlock } from "@/components/code-block";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Archive,
  BarChart3,
  Box,
  Check,
  Cpu,
  FileCode,
  Globe,
  ImageIcon,
  Laptop,
  Play,
  Smartphone,
  Timer,
  Zap,
} from "lucide-react";
import { useState } from "react";

// --- DEMO 1: SIMULADOR DE HARDWARE ---
function HardwareSimulator() {
  const [device, setDevice] = useState<"desktop" | "flagship" | "mid-range" | "low-end">("desktop");
  const [phase, setPhase] = useState<"idle" | "network" | "parse" | "exec" | "done">("idle");
  const [metrics, setMetrics] = useState({ network: 0, parse: 0, exec: 0, total: 0 });

  const devices = {
    desktop: {
      name: "MacBook Pro / Gaming PC",
      cpuLabel: "M3 Max / Core i9",
      networkSpeed: 0.5, // Ethernet/WiFi 6
      cpuSpeed: 0.2,     // Ultra fast
      color: "text-blue-500",
      bg: "bg-blue-500",
      icon: Laptop,
    },
    flagship: {
      name: "iPhone 15 Pro",
      cpuLabel: "A17 Pro",
      networkSpeed: 1, 
      cpuSpeed: 1,     // Baseline
      color: "text-green-500",
      bg: "bg-green-500",
      icon: Smartphone,
    },
    "mid-range": {
      name: "Galaxy A54 / Pixel",
      cpuLabel: "Exynos (Mid)",
      networkSpeed: 1.5,
      cpuSpeed: 4,     // 4x slower than flagship
      color: "text-yellow-500",
      bg: "bg-yellow-500",
      icon: Smartphone,
    },
    "low-end": {
      name: "Moto G / Android Go",
      cpuLabel: "Snapdragon 4xx",
      networkSpeed: 2,
      cpuSpeed: 12,    // 12x slower
      color: "text-destructive",
      bg: "bg-destructive",
      icon: Smartphone,
    },
  };

  const runBenchmark = async () => {
    if (phase !== "idle") return;
    
    const specs = devices[device];
    const baseNetwork = 200;
    const baseParse = 150;
    const baseExec = 100;

    setMetrics({ network: 0, parse: 0, exec: 0, total: 0 });

    setPhase("network");
    const netTime = baseNetwork * specs.networkSpeed;
    await new Promise(r => setTimeout(r, netTime));
    setMetrics(m => ({ ...m, network: netTime }));

    setPhase("parse");
    const parseTime = baseParse * specs.cpuSpeed;
    await new Promise(r => setTimeout(r, parseTime));
    setMetrics(m => ({ ...m, parse: parseTime }));

    setPhase("exec");
    const execTime = baseExec * specs.cpuSpeed;
    await new Promise(r => setTimeout(r, execTime));
    setMetrics(m => ({ ...m, exec: execTime, total: netTime + parseTime + execTime }));

    setPhase("done");
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
        <div>
          <h4 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Cpu className="h-5 w-5 text-primary" />
            Simulador: O Custo do Hardware
          </h4>
          <p className="text-sm text-muted-foreground">
            O mesmo arquivo JS de 500KB rodando em diferentes CPUs.
          </p>
        </div>
        {phase === "done" && (
           <div className="text-right animate-in fade-in slide-in-from-right-4">
             <div className="text-xs text-muted-foreground uppercase font-mono">Tempo Total</div>
             <div className={cn("text-2xl font-mono font-bold", devices[device].color)}>
               {(metrics.total / 1000).toFixed(2)}s
             </div>
           </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {(Object.entries(devices) as [keyof typeof devices, typeof devices["desktop"]][]).map(([key, info]) => {
          const Icon = info.icon;
          return (
            <button
              key={key}
              onClick={() => { setDevice(key); setPhase("idle"); }}
              className={cn(
                "flex flex-col items-start p-3 rounded-lg border transition-all relative overflow-hidden text-left",
                device === key 
                  ? "border-primary bg-primary/5 ring-1 ring-primary" 
                  : "border-border bg-card hover:bg-muted"
              )}
            >
              <div className="mb-2 p-2 rounded-full bg-muted/50">
                <Icon className="h-4 w-4" />
              </div>
              <div className="font-bold text-xs mb-1 leading-tight">{info.name}</div>
              <div className="text-[10px] text-muted-foreground font-mono">{info.cpuLabel}</div>
              {device === key && phase === "idle" && (
                  <div className="absolute top-2 right-2">
                      <Check className="h-3 w-3 text-primary" />
                  </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-6 relative">
        <div className="h-16 w-full bg-secondary/50 rounded-lg overflow-hidden flex relative">
            {/* Network Bar */}
            <div 
                className="h-full bg-blue-500/80 flex items-center justify-center text-[10px] font-bold text-white transition-all duration-300"
                style={{ width: phase === "idle" ? "0%" : phase === "network" ? "100%" : "20%" }}
            >
                {phase !== "idle" && <Globe className="h-4 w-4" />}
            </div>
            
            {/* Parse Bar */}
            <div 
                className="h-full bg-yellow-500/80 flex items-center justify-center text-[10px] font-bold text-white transition-all duration-300"
                style={{ width: phase === "idle" || phase === "network" ? "0%" : phase === "parse" ? "100%" : (device === 'desktop' ? "10%" : device === 'flagship' ? "30%" : "40%") }}
            >
                {(phase === "parse" || phase === "exec" || phase === "done") && <FileCode className="h-4 w-4 animate-pulse" />}
            </div>

            {/* Exec Bar */}
             <div 
                className="h-full bg-green-500/80 flex items-center justify-center text-[10px] font-bold text-white transition-all duration-300"
                style={{ width: phase === "exec" || phase === "done" ? "100%" : "0%" }}
            >
                {(phase === "exec" || phase === "done") && <Zap className="h-4 w-4" />}
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <span className="bg-background/80 px-3 py-1 rounded text-xs font-mono font-bold shadow-sm backdrop-blur-sm">
                    {phase === "idle" && "Aguardando Início..."}
                    {phase === "network" && "Downloading (I/O)..."}
                    {phase === "parse" && "Parsing & Compiling (CPU)..."}
                    {phase === "exec" && "Hydrating & Executing (CPU)..."}
                    {phase === "done" && "Interativo!"}
                 </span>
            </div>
        </div>

        <button
            onClick={runBenchmark}
            disabled={phase !== "idle" && phase !== "done"}
            className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
            {phase === "idle" || phase === "done" ? <Play className="h-4 w-4" /> : <Timer className="h-4 w-4 animate-spin" />}
            {phase === "idle" ? "Rodar Bundle (1MB JS)" : phase === "done" ? "Rodar Novamente" : "Processando..."}
        </button>

        {phase === "done" && (
            <div className="grid grid-cols-3 gap-2 text-center pt-2 animate-in slide-in-from-bottom-2">
                <div className="p-2 bg-muted/30 rounded border border-border">
                    <div className="text-[10px] text-muted-foreground uppercase">Rede</div>
                    <div className="font-mono font-bold text-sm">{(metrics.network).toFixed(0)}ms</div>
                </div>
                <div className={cn("p-2 rounded border", device === 'low-end' ? "bg-destructive/10 border-destructive/30" : "bg-muted/30 border-border")}>
                    <div className="text-[10px] text-muted-foreground uppercase">Parse</div>
                    <div className={cn("font-mono font-bold text-sm", device === 'low-end' && "text-destructive")}>
                        {(metrics.parse).toFixed(0)}ms
                    </div>
                </div>
                 <div className={cn("p-2 rounded border", device === 'low-end' ? "bg-destructive/10 border-destructive/30" : "bg-muted/30 border-border")}>
                    <div className="text-[10px] text-muted-foreground uppercase">Exec</div>
                    <div className={cn("font-mono font-bold text-sm", device === 'low-end' && "text-destructive")}>
                        {(metrics.exec).toFixed(0)}ms
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

// --- DEMO 2: RESOURCE COST (Image vs JS) ---
function ResourceCostComparison() {
    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm mt-8">
            <div className="mb-6">
                <h4 className="flex items-center gap-2 text-lg font-bold text-foreground">
                    <BarChart3 className="h-5 w-5 text-accent" />
                    Bytes não são iguais
                </h4>
                <p className="text-sm text-muted-foreground">
                    Comparando o custo de processamento de <strong>500KB</strong> de Imagem vs <strong>500KB</strong> de JavaScript.
                </p>
            </div>

            <div className="space-y-6">
                {/* 1. IMAGEM */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2 font-bold text-foreground">
                            <ImageIcon className="h-4 w-4 text-blue-500" />
                            Imagem (JPEG)
                        </div>
                        <span className="font-mono text-muted-foreground">~0.1s Total</span>
                    </div>
                    <div className="h-8 flex rounded-md overflow-hidden text-xs font-bold text-white leading-8">
                        <div className="w-[80%] bg-blue-500/50 flex items-center justify-center border-r border-background/20" title="Network">Network</div>
                        <div className="w-[20%] bg-blue-500 flex items-center justify-center" title="Decode">Decode</div>
                    </div>
                </div>

                {/* 2. JAVASCRIPT */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2 font-bold text-foreground">
                            <FileCode className="h-4 w-4 text-orange-500" />
                            JavaScript
                        </div>
                        <span className="font-mono text-destructive font-bold">~1.5s Total (Mobile)</span>
                    </div>
                    <div className="h-8 flex rounded-md overflow-hidden text-xs font-bold text-white leading-8">
                        <div className="w-[30%] bg-blue-500/50 flex items-center justify-center border-r border-background/20" title="Network">Net</div>
                        <div className="w-[30%] bg-orange-400 flex items-center justify-center border-r border-background/20" title="Parse">Parse</div>
                        <div className="w-[20%] bg-orange-500 flex items-center justify-center border-r border-background/20" title="Compile">Comp</div>
                        <div className="w-[20%] bg-orange-600 flex items-center justify-center" title="Execute">Exec</div>
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground pt-1">
                        <span>O download é o mesmo...</span>
                        <span className="text-destructive font-bold">...mas o custo de CPU é massivo.</span>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 p-4 bg-muted/30 rounded border border-border text-sm">
                 <p className="text-muted-foreground">
                    <strong className="text-foreground">Por que isso acontece?</strong> Uma imagem é apenas dados passivos de pixels. JavaScript é lógica complexa (AST) que precisa ser compilada para Bytecode e executada na thread principal.
                 </p>
            </div>
        </div>
    )
}

// --- DEMO 3: IMPORT COST (Tree Shaking) ---
function ImportCostDemo() {
    const [optimized, setOptimized] = useState(false);

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm mt-8">
            <div className="mb-6">
                <h4 className="flex items-center gap-2 text-lg font-bold text-foreground">
                    <Archive className="h-5 w-5 text-accent" />
                    Solução: Tree Shaking
                </h4>
                <p className="text-sm text-muted-foreground">
                    Importar a biblioteca inteira vs. apenas o que você precisa.
                </p>
            </div>

            <div className="flex flex-col gap-6">
                {/* 1. SEÇÃO VISUAL (RESULTADO) EM CIMA */}
                <div className="flex flex-col md:flex-row items-center justify-around p-8 bg-muted/20 rounded-xl border border-border border-dashed gap-8">
                     {/* Painel Esquerdo: Métricas e Controles */}
                     <div className="flex flex-col gap-4 items-start w-full md:w-auto">
                         <div className="space-y-1">
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Tamanho do Bundle</div>
                            <div className={cn("text-4xl font-mono font-bold animate-in fade-in zoom-in", optimized ? "text-green-500" : "text-destructive")}>
                                {optimized ? "18 KB" : "450 KB"}
                            </div>
                         </div>
                         
                         <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Tempo de Parse (Mobile)</div>
                            <div className="font-mono font-bold flex items-center gap-2">
                                {optimized ? "~20ms" : "~400ms"}
                                {!optimized && <AlertTriangleIcon className="h-3 w-3 text-destructive animate-pulse" />}
                            </div>
                         </div>

                         <button 
                            onClick={() => setOptimized(!optimized)}
                            className={cn(
                                "mt-2 px-4 py-2 rounded-md text-sm font-bold transition-all border",
                                optimized 
                                    ? "bg-secondary text-foreground border-border hover:bg-muted" 
                                    : "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                            )}
                        >
                            {optimized ? "Desfazer Otimização" : "Aplicar Tree Shaking"}
                        </button>
                     </div>

                     {/* Painel Direito: Gráfico de Barras */}
                     <div className="flex items-end gap-6 h-40 w-full md:w-auto justify-center md:justify-end">
                         {/* Barra Full */}
                         <div className="flex flex-col items-center gap-2">
                             <div 
                                className={cn(
                                    "w-20 rounded-t-lg transition-all duration-700 ease-out flex items-center justify-center text-white font-bold relative group",
                                    optimized ? "h-8 bg-green-500/20 border-2 border-green-500 border-dashed" : "h-40 bg-destructive"
                                )}
                             >
                                <span className={cn("text-xs", optimized && "text-green-500")}>{optimized ? "18k" : "450k"}</span>
                             </div>
                             <div className="text-[10px] font-mono text-muted-foreground">main.js</div>
                         </div>

                         {/* Barra de Código Morto (Só aparece quando não otimizado) */}
                         <div className="flex flex-col items-center gap-2 transition-opacity duration-500" style={{ opacity: optimized ? 0.2 : 1 }}>
                             <div className="w-16 h-32 bg-background border-2 border-destructive/30 border-dashed rounded-t-lg flex items-center justify-center relative">
                                 <span className="text-[10px] text-muted-foreground text-center px-1">Unused Code</span>
                             </div>
                             <div className="text-[10px] font-mono text-muted-foreground">bloat</div>
                         </div>
                     </div>
                </div>

                {/* 2. SEÇÃO CÓDIGO (FONTE) EM BAIXO - FULL WIDTH */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-muted-foreground px-1">
                        <span>utils.ts (Código Fonte)</span>
                        <span>{optimized ? "✅ Modular Import" : "❌ Wildcard Import"}</span>
                    </div>
                    
                    <CodeBlock language="typescript" filename="utils.ts">
{optimized 
? `// ✅ Tree Shaking Ativo:
// Importamos apenas a função específica.
// O bundler (Webpack/Vite) detecta que o resto da lib não é usado e remove.

import format from 'date-fns/format';

export const formatDate = (date) => {
  return format(date, 'yyyy-MM-dd');
}`
: `// ❌ Tree Shaking Falha:
// Importamos o objeto inteiro da biblioteca.
// O bundler é forçado a incluir Locales, Timezones e Helpers no bundle final.

import * as DateFns from 'date-fns';

export const formatDate = (date) => {
  return DateFns.format(date, 'yyyy-MM-dd');
}`}
                    </CodeBlock>
                </div>
            </div>
        </div>
    )
}

function AlertTriangleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
        </svg>
    )
}

export function BundleSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <div className="mb-2 font-mono text-sm text-primary">FASE 1.2</div>
        <h2 className="mb-4 text-3xl font-bold text-foreground">
          O Custo do Bundle (Cold Start)
        </h2>
        <p className="text-lg text-muted-foreground">
          Frontend não tem "servidor potente". O código roda na máquina do cliente, e nem todos têm um iPhone ou Desktop de última geração.
        </p>
      </div>

      <div className="mb-8 grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-muted/20 rounded-lg border border-border">
              <h3 className="font-bold flex items-center gap-2 mb-2">
                  <Box className="h-4 w-4 text-muted-foreground" />
                  Analogia Backend
              </h3>
              <p className="text-sm text-muted-foreground">
                  Imagine que para rodar um container Docker, você precisasse fazer o <strong>download da imagem + unzip + boot</strong> toda vez que o usuário fizesse um request. É isso que acontece no browser com JS.
              </p>
          </div>
          <div className="p-4 bg-muted/20 rounded-lg border border-border">
              <h3 className="font-bold flex items-center gap-2 mb-2">
                   <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  A Realidade
              </h3>
              <p className="text-sm text-muted-foreground">
                  Minificar arquivo (remover espaços) resolve o download, mas não resolve o <strong>Parse & Compile</strong>. A CPU do dispositivo precisa ler e entender esse código antes de rodar.
              </p>
          </div>
      </div>

      <HardwareSimulator />
      
      <ResourceCostComparison />
      
      <ImportCostDemo />

      <div className="my-8 rounded-lg border border-chart-4/30 bg-chart-4/10 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-chart-4 flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Lição para Engenharia
        </h3>
        <p className="text-sm text-foreground mb-4">
            No Backend, se a performance está ruim, você paga por instâncias maiores (Scale Up). No Frontend, você não controla o hardware.
        </p>
        <ul className="space-y-2 text-sm text-chart-4/90">
            <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span><strong>Tree Shaking:</strong> Configure seu bundler para remover código morto. É como o Linker do C++.</span>
            </li>
            <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span><strong>Code Splitting:</strong> Não envie o código do "Admin Dashboard" para o usuário que está na "Home".</span>
            </li>
            <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span><strong>Third Party Scripts:</strong> Analytics e Ads são os maiores vilões. Carregue-os com <code>defer</code> ou via Web Workers (Partytown).</span>
            </li>
        </ul>
      </div>
    </section>
  );
}