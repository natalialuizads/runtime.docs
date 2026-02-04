"use client";

import { Button } from "@/components/ui/button";
import { Activity, ArrowRight, Cpu, Monitor, Server, Zap } from "lucide-react";

interface HeroSectionProps {
  onStart: () => void;
}

export function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* BACKGROUND: Grid de Infraestrutura */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex flex-wrap gap-3 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 shadow-sm">
            <Cpu className="h-3 w-3 text-primary" />
            <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-widest">
              Node: Shared-Execution-Environment
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 shadow-sm">
            <Zap className="h-3 w-3 text-emerald-500" />
            <span className="font-mono text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
              Orchestration: Module Federation
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 shadow-sm">
            <Activity className="h-3 w-3 text-zinc-400" />
            <span className="font-mono text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
              Availability: Single-Threaded
            </span>
          </div>
        </div>

        {/* HEADER PRINCIPAL */}
        <div className="max-w-4xl space-y-6">
          <h1 className="font-sans text-5xl font-black leading-[1.1] text-foreground sm:text-7xl lg:text-8xl tracking-tighter">
            O Browser como <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
              S.O. Distribuído
            </span>
          </h1>

          <p className="max-w-2xl text-pretty text-lg text-muted-foreground sm:text-2xl leading-relaxed">
            Esqueça o HTML/CSS por um momento. No seu novo condomínio digital, o
            navegador é um <strong>ambiente de execução síncrono</strong> com
            recursos finitos e sem auto-scaling.
          </p>
        </div>

        {/* MTRICAS DE INFRAESTRUTURA (CARDS DIDÁTICOS) */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-2xl">
            <Server className="mb-4 h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
            <h3 className="font-mono text-sm font-bold text-foreground uppercase tracking-widest mb-2">
              Memory Contention
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No backend você escala pods. No frontend, você divide o mesmo{" "}
              <strong>Shared Heap</strong> entre todos os seus Microfrontends.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:shadow-2xl">
            <Monitor className="mb-4 h-8 w-8 text-accent group-hover:scale-110 transition-transform" />
            <h3 className="font-mono text-sm font-bold text-foreground uppercase tracking-widest mb-2">
              Single-Threaded I/O
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Diferente de um servidor multi-threaded, o browser roda quase tudo
              no <strong>Main Thread</strong>. Bloqueou o script? Congelou a UI.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-chart-4/50 hover:shadow-2xl">
            <Cpu className="mb-4 h-8 w-8 text-chart-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-mono text-sm font-bold text-foreground uppercase tracking-widest mb-2">
              No Auto-Scaling
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Você não controla o hardware. Seu "servidor" pode ser um iPhone 15
              ou um Android de 2018. A <strong>latência de parse</strong> é
              real.
            </p>
          </div>
        </div>

        {/* CTA FINAL */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
          <Button
            onClick={onStart}
            size="lg"
            className="h-14 px-10 gap-3 font-mono text-lg shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] transition-all hover:scale-105 active:scale-95"
          >
            Conectar ao Runtime
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
