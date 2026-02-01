"use client"

import { DynamicDiagram } from "@/components/dynamic-diagram"
import { BundleCalculator } from "@/components/interactive/bundle-calculator"
import { TimelineVisual } from "@/components/timeline-visual"
import { Box, Check, Container, Cpu, FileCode, Globe, ImageIcon, Play, Zap } from "lucide-react"

export function BundleSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <div className="mb-2 font-mono text-sm text-primary">FASE 1.3</div>
        <h2 className="mb-4 text-3xl font-bold text-foreground">O Custo do Bundle (Cold Start)</h2>
        <p className="text-lg text-muted-foreground">
          Diferencie download de tempo de execucao - carregar JS nao e so I/O de rede.
        </p>
      </div>

      <p className="mb-6 text-muted-foreground">
        No backend, voce conhece o <strong className="text-foreground">Cold Start</strong> de Lambdas/Cloud Functions:
      </p>

      <DynamicDiagram 
        title="Lambda Cold Start"
        nodes={[
          { id: 'dl', label: 'Download Container', icon: Container, x: 20, y: 50 },
          { id: 'init', label: 'Init Runtime', icon: Play, x: 50, y: 50, color: 'border-chart-4' },
          { id: 'exec', label: 'Execute', icon: Zap, x: 80, y: 50, color: 'border-primary' },
        ]}
        edges={[
          { from: 'dl', to: 'init', animated: true, label: '~200ms' },
          { from: 'init', to: 'exec', animated: true, label: '~300ms' },
        ]}
      />

      <p className="my-6 text-foreground font-medium">
        JavaScript no Browser tem o mesmo problema:
      </p>

      <DynamicDiagram 
        title="JS Bundle Cold Start"
        nodes={[
          { id: 'net', label: 'Network Download', icon: Globe, x: 10, y: 30 },
          { id: 'zip', label: 'Decompress', icon: Box, x: 30, y: 30 },
          { id: 'parse', label: 'Parse/Tokenize', icon: FileCode, x: 50, y: 30, color: 'border-destructive' },
          { id: 'comp', label: 'Compile', icon: Cpu, x: 70, y: 30, color: 'border-destructive' },
          { id: 'exec', label: 'Execute', icon: Zap, x: 90, y: 30, color: 'border-primary' },
        ]}
        edges={[
          { from: 'net', to: 'zip', animated: true, label: 'I/O' },
          { from: 'zip', to: 'parse', animated: true },
          { from: 'parse', to: 'comp', animated: true, label: 'CPU' },
          { from: 'comp', to: 'exec', animated: true },
        ]}
      />

      <div className="my-8 rounded-lg border border-destructive/30 bg-destructive/10 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-destructive">O Erro Comum</h3>
        <blockquote className="border-l-2 border-destructive pl-4 italic text-destructive/80">
          "Minifiquei meu JS de 2MB para 500KB. Problema resolvido!"
        </blockquote>
        <p className="mt-4 text-sm text-destructive/80">
          <strong>Errado.</strong> Voce resolveu apenas o I/O de rede. 
          O tempo de <strong>Parse + Compile + Execute</strong> ainda e proporcional ao codigo.
        </p>
      </div>

      <h3 className="mb-4 mt-8 font-mono text-lg font-semibold text-foreground">
        Comparacao de Custos por Tipo de Arquivo
      </h3>

      <DynamicDiagram 
        title="200KB: JPEG vs JavaScript"
        nodes={[
          { id: 'net', label: 'Download (200KB)', icon: Globe, x: 15, y: 30 },
          { id: 'jpeg', label: 'JPEG (GPU)', icon: ImageIcon, x: 50, y: 15, color: 'border-green-500' },
          { id: 'js', label: 'JS (CPU)', icon: FileCode, x: 50, y: 45, color: 'border-destructive' },
          { id: 'done', label: 'Ready', icon: Check, x: 85, y: 30, color: 'border-primary' },
        ]}
        edges={[
          { from: 'net', to: 'jpeg', animated: true, label: '~150ms' },
          { from: 'net', to: 'js', animated: true, label: '~150ms' },
          { from: 'jpeg', to: 'done', label: '+5ms' },
          { from: 'js', to: 'done', animated: true, label: '+250ms' },
        ]}
      />

      <TimelineVisual
        title="Mesmo bundle de 1MB, hardware diferente:"
        maxDuration={2000}
        items={[
          { label: "MacBook Pro M3", duration: 200, color: "accent" },
          { label: "iPhone 15", duration: 350, color: "accent" },
          { label: "Pixel 7", duration: 500, color: "primary" },
          { label: "Android mid-range", duration: 2000, color: "destructive", blocked: true },
        ]}
      />

      <div className="my-8 rounded-lg border border-chart-4/30 bg-chart-4/10 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-chart-4">Por que isso importa?</h3>
        <p className="text-sm text-chart-4/80">
          No backend, se sua Lambda demora para iniciar, voce aumenta a memoria ou 
          provisiona "Warm instances".
        </p>
        <p className="mt-4 text-sm text-foreground font-medium">
          No frontend, voce nao controla o hardware do usuario.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Aquele bundle de 1MB que roda em 200ms no seu MacBook Pro pode demorar{" "}
          <strong className="text-destructive">3 segundos</strong> em um celular Android mid-range.
        </p>
      </div>

      <div className="my-12 border-t border-border pt-8">
        <h3 className="mb-4 text-xl font-bold text-foreground">Calcule o Custo Real</h3>
        <p className="mb-6 text-muted-foreground">
          Ajuste o tamanho do bundle, dispositivo e conexao para ver o impacto real no tempo
          de carregamento. Note como o custo de CPU supera o custo de rede em dispositivos mais fracos:
        </p>
        <BundleCalculator />
      </div>
    </section>
  )
}
