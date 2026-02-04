"use client";

import { CodeBlock } from "@/components/code-block";
import { ComparisonTable } from "@/components/comparison-table";
import { DynamicDiagram } from "@/components/dynamic-diagram";
import { cn } from "@/lib/utils";
import {
  Activity,
  Box,
  CheckCircle2,
  Cpu,
  Database,
  FileCode,
  Layers,
  Layout,
  Network,
  PlaySquare,
  Share2,
  Zap,
  ArrowDown,
  Globe,
  Link,
  Container,
  ArrowRight
} from "lucide-react";

export function ModuleFederationSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      {/* 1. HEADER E INTRODUÇÃO (MANTIDOS) */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 mb-4">
          <Share2 className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs text-primary font-bold uppercase">Orquestração em Runtime</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground md:text-5xl tracking-tighter">
          Module Federation: O Linker Dinâmico.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
          Para um dev backend, o Module Federation é o equivalente ao <strong>Dynamic Linking</strong> de bibliotecas 
          (.so/.dll) em tempo de execução. A solução definitiva para o Dependency Hell.
        </p>
      </div>

      {/* 2. ANALOGIA DE SISTEMAS (MANTIDA) */}
      <div className="mb-16 grid md:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl border border-border bg-card">
          <h3 className="text-sm font-bold uppercase tracking-widest text-blue-500 mb-4 flex items-center gap-2">
            <Cpu className="h-4 w-4" /> Paradigma de Sistemas
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            É como o <strong>Dynamic Linking</strong>. O executável não contém o código da biblioteca, apenas uma referência. 
            O Linker resolve o endereço de memória no momento da execução.
          </p>
        </div>
        <div className="p-6 rounded-2xl border border-border bg-card ring-1 ring-primary/20">
          <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
            <Network className="h-4 w-4" /> Paradigma Web
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            O browser atua como o <strong>Linker</strong>. Ele decide se baixa o módulo ou se usa uma versão 
            que já está no <em>Shared Scope</em> da memória.
          </p>
        </div>
      </div>

      {/* 3. DIAGRAMA CONCEITUAL (MANTIDO) */}
      <div className="mb-20">
        <DynamicDiagram
          title="O Conceito: Linker Dinâmico vs Webpack Runtime"
          nodes={[
            { id: "app", label: "Main Process\n(app.exe)", icon: PlaySquare, x: 20, y: 30 },
            { id: "lib", label: "Shared Library\n(libc.so.6)", icon: FileCode, x: 80, y: 30, color: "border-blue-500" },
            { id: "shell", label: "MFE Host\n(App Shell)", icon: Layout, x: 20, y: 70 },
            { id: "react", label: "Remote Module\n(shared-ui.js)", icon: Layers, x: 80, y: 70, color: "border-primary" },
          ]}
          edges={[
            { from: "app", to: "lib", animated: true, label: "printf()" },
            { from: "shell", to: "react", animated: true, label: "useState" },
          ]}
        />
      </div>

      <hr className="my-20 border-border" />

      {/* 4. CONFIGURAÇÃO COMO SERVICE DEFINITION (NOVO - EMPILHADO) */}
      <div className="mb-24 space-y-8">
        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            Configuração como "Service Definition"
          </h3>
          <p className="text-muted-foreground mb-8 text-sm max-w-2xl">
            Para o backend, o Webpack/Rspack funciona como o seu <strong>Service Discovery</strong>. 
            Abaixo, a definição do Gateway (Host) e do Service Provider (Remote).
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between px-4">
               <span className="text-[10px] font-bold text-primary uppercase tracking-widest">A. O Gateway (App Shell)</span>
            </div>
            <CodeBlock language="javascript" filename="shell-host.config.js">
{`new ModuleFederationPlugin({
  name: 'shell',
  remotes: {
    // Discovery: Onde os remotos estão expostos
    'vendas_mfe': 'vendas@https://cdn.com/vendas/remoteEntry.js',
  },
  shared: {
    // Injeção de Dependência Singleton
    'react': { singleton: true, requiredVersion: '^18.2.0' }
  }
})`}
            </CodeBlock>
          </div>

          <div className="flex justify-center">
             <ArrowDown className="h-6 w-6 text-muted-foreground/30" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-4">
               <span className="text-[10px] font-bold text-accent uppercase tracking-widest">B. O Service Provider (Remote MFE)</span>
            </div>
            <CodeBlock language="javascript" filename="vendas-remote.config.js">
{`new ModuleFederationPlugin({
  name: 'vendas',
  filename: 'remoteEntry.js', // O Manifesto
  exposes: {
    // Interface Pública (Endpoints de UI)
    './Checkout': './src/pages/Checkout',
  },
  shared: { 'react': { singleton: true } }
})`}
            </CodeBlock>
          </div>
        </div>
      </div>

      {/* 5. TRACE DE EXECUÇÃO: O LINKER (NOVO - LARGURA TOTAL) */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded bg-primary/10 border border-primary/30">
                <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-foreground uppercase tracking-tight">Trace de Execução: O "Linker" do Browser</h3>
                <p className="text-sm text-muted-foreground mt-1">Resolução de símbolos e injeção de dependência em tempo real.</p>
            </div>
        </div>

        <div className="rounded-3xl border border-border bg-zinc-950 p-8 lg:p-16 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-center">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                {/* HOST */}
                <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
                    <Layout className="h-12 w-12 text-zinc-400" />
                    <h5 className="font-bold text-white uppercase text-xs tracking-widest">App Shell</h5>
                    <div className="w-full bg-primary/20 border border-primary/40 rounded py-2 px-3 text-[10px] font-mono text-primary animate-pulse">
                        CALL: import('vendas/Checkout')
                    </div>
                </div>

                {/* RESOLVER */}
                <div className="flex flex-col items-center space-y-6 relative">
                    <div className="relative p-8 rounded-full border-4 border-primary bg-primary/5 shadow-[0_0_50px_rgba(var(--primary),0.3)]">
                        <Cpu className="h-14 w-14 text-primary animate-pulse" />
                    </div>
                    <div className="w-full space-y-2">
                        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            <span className="text-[10px] font-mono text-zinc-300">Linker: Resolve 'React'</span>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[10px] font-mono text-zinc-300">Fetch: 'remoteEntry.js'</span>
                        </div>
                    </div>
                </div>

                {/* REMOTE */}
                <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5">
                    <Globe className="h-12 w-12 text-blue-400/80" />
                    <h5 className="font-bold text-white uppercase text-xs tracking-widest">MFE Remote</h5>
                    <div className="w-full border border-dashed border-blue-500/30 rounded py-2 px-3 text-[10px] font-mono text-blue-400">
                        RESOLVED: ./Checkout
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 6. VERSIONAMENTO TÉCNICO (MANTIDO/MELHORADO) */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {[
          { title: "Singleton: true", icon: CheckCircle2, color: "text-emerald-500", desc: "Evita runtimes duplicados. Garante que libs com estado (React) tenham uma única instância no Heap de memória." },
          { title: "Strict Version", icon: Zap, color: "text-primary", desc: "O 'Circuit Breaker' da UI. Interrompe a execução se houver incompatibilidade de versão entre Host e Remote." },
          { title: "Automatic Fallback", icon: Share2, color: "text-blue-400", desc: "Se o Host não prover a lib, o MFE baixa sua própria cópia privada. Resiliência a custo de performance." }
        ].map((item, i) => (
          <div key={i} className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all">
            <item.icon className={cn("h-5 w-5 mb-4", item.color)} />
            <h4 className="text-sm font-bold mb-2">{item.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}