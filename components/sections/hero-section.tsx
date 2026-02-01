"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Monitor, Server, Terminal } from "lucide-react";

interface HeroSectionProps {
  onStart: () => void;
}

export function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <section className="relative min-h-[80vh] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent dark:from-primary/5" />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-32">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-4 py-2 dark:bg-primary/10">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs text-primary font-semibold tracking-wide">
            Para Engenheiros de Backend
          </span>
        </div>

        <h1 className="mb-6 max-w-4xl text-balance font-sans text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
          O Browser como{" "}
          <span className="text-primary">Sistema Operacional</span>
        </h1>

        <p className="mb-8 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
          Um deep dive nos fundamentos de runtime do navegador, usando linguagem
          de infraestrutura que você já conhece: threads, latência, I/O e
          sistemas distribuídos.
        </p>

        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
            <Server className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <div className="font-mono text-sm font-medium text-foreground">
                Backend Mindset
              </div>
              <div className="text-sm text-muted-foreground">
                Analogias com servidores, Docker e microservicos
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
            <Monitor className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <div className="font-mono text-sm font-medium text-foreground">
                Runtime Constraints
              </div>
              <div className="text-sm text-muted-foreground">
                Por que você não pode escalar horizontalmente no cliente
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
            <Terminal className="mt-0.5 h-5 w-5 shrink-0 text-chart-4" />
            <div>
              <div className="font-mono text-sm font-medium text-foreground">
                Desafios Práticos
              </div>
              <div className="text-sm text-muted-foreground">
                Cenários de debug onde o backend pattern falha
              </div>
            </div>
          </div>
        </div>

        <Button onClick={onStart} size="lg" className="gap-2 font-mono">
          Iniciar Deep Dive
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
