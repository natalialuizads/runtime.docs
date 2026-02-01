"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Monitor, Server, Terminal } from "lucide-react"

interface HeroSectionProps {
  onStart: () => void
}

export function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <section className="relative min-h-[80vh] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent dark:from-primary/5" />
      
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-32">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-4 py-2 dark:bg-primary/10">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs text-primary font-semibold tracking-wide">Para Engenheiros de Backend</span>
        </div>
        
        <h1 className="mb-6 max-w-4xl text-balance font-sans text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
          O Browser como{" "}
          <span className="text-primary">Sistema Operacional</span>
        </h1>
        
        <p className="mb-8 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
          Um deep dive nos fundamentos de runtime do navegador, 
          usando linguagem de infraestrutura que voce ja conhece: 
          threads, latencia, I/O e sistemas distribuidos.
        </p>

        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
            <Server className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <div className="font-mono text-sm font-medium text-foreground">Backend Mindset</div>
              <div className="text-sm text-muted-foreground">
                Analogias com servidores, Docker e microservicos
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
            <Monitor className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <div className="font-mono text-sm font-medium text-foreground">Runtime Constraints</div>
              <div className="text-sm text-muted-foreground">
                Por que voce nao pode escalar horizontalmente no client
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
            <Terminal className="mt-0.5 h-5 w-5 shrink-0 text-chart-4" />
            <div>
              <div className="font-mono text-sm font-medium text-foreground">Desafios Praticos</div>
              <div className="text-sm text-muted-foreground">
                Cenarios de debug onde o backend pattern falha
              </div>
            </div>
          </div>
        </div>

        <Button onClick={onStart} size="lg" className="gap-2 font-mono">
          Iniciar Deep Dive
          <ArrowRight className="h-4 w-4" />
        </Button>

        <div className="mt-16 rounded-lg border border-border bg-card/50 p-4 sm:p-6">
          <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-muted-foreground sm:text-sm">
{`// Voce esta acostumado com isso:
const server = new HTTPServer({ workers: 8 });  // Escala horizontal
server.on('request', async (req) => {
  const data = await heavyComputation();  // Executa em worker thread
  return Response.json(data);
});

// No browser, voce tem isso:
const browser = new SingleThreadRuntime();  // UMA thread para tudo
browser.on('click', () => {
  heavyComputation();  // BLOQUEIA a UI inteira
  // Usuario: "Por que o site travou?"
});`}
          </pre>
        </div>
      </div>
    </section>
  )
}
