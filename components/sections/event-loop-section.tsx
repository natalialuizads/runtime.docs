"use client"

import { AsciiDiagram } from "@/components/ascii-diagram"
import { CodeBlock } from "@/components/code-block"
import { ComparisonTable } from "@/components/comparison-table"
import { EventLoopSimulator } from "@/components/interactive/event-loop-simulator"

export function EventLoopSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <div className="mb-2 font-mono text-sm text-primary">FASE 1.1</div>
        <h2 className="mb-4 text-3xl font-bold text-foreground">Single Thread & Event Loop</h2>
        <p className="text-lg text-muted-foreground">
          Como o Browser gerencia o "Main Thread" - e por que isso importa mais do que voce pensa.
        </p>
      </div>

      <div className="prose prose-invert max-w-none">
        <p className="text-muted-foreground">
          No backend, voce esta acostumado com <strong className="text-foreground">multi-threading</strong>. 
          Um servidor Node.js usa o Event Loop, mas operacoes pesadas podem ser delegadas para Worker Threads. 
          Um servidor Java spawna threads por request.
        </p>
        
        <p className="text-foreground font-medium">No Browser, voce nao tem esse luxo.</p>
      </div>

      <AsciiDiagram title="Arquitetura do Main Thread">
{`┌─────────────────────────────────────────────────────────────────┐
│                        MAIN THREAD                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ JavaScript  │  │  DOM/CSSOM  │  │   Layout    │             │
│  │  Execution  │  │   Parsing   │  │  & Paint    │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                │                     │
│         └────────────────┴────────────────┘                     │
│                          │                                      │
│                    SINGLE CPU CORE                              │
│              (Time-Sliced Execution)                            │
└─────────────────────────────────────────────────────────────────┘`}
      </AsciiDiagram>

      <div className="my-8 rounded-lg border border-chart-4/30 bg-chart-4/10 p-4">
        <h3 className="mb-3 font-mono text-sm font-semibold text-chart-4">
          A Analogia do Servidor Single-Threaded
        </h3>
        <p className="mb-4 text-sm text-chart-4/80">
          Imagine um servidor HTTP que processa requests em uma unica thread:
        </p>
      </div>

      <AsciiDiagram title="Request Queue Blocking">
{`[Request Queue]
    │
    ▼
┌─────────────────────────────────────────┐
│           SINGLE WORKER                 │
│                                         │
│  Request 1: GET /health    → 1ms   ✓   │
│  Request 2: GET /users     → 5ms   ✓   │
│  Request 3: POST /compute  → 3000ms ⏳ │  ← BLOCKING!
│  Request 4: GET /health    → ???   🔒  │  ← Waiting...
│  Request 5: GET /health    → ???   🔒  │  ← Waiting...
└─────────────────────────────────────────┘`}
      </AsciiDiagram>

      <p className="my-6 text-muted-foreground">
        Enquanto <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm text-foreground">POST /compute</code> executa, 
        <strong className="text-foreground"> nenhum health check responde</strong>. 
        O Load Balancer marca o servidor como "down".
      </p>

      <ComparisonTable
        headers={["Backend (Servidor)", "Frontend (Browser)"]}
        rows={[
          ["POST /compute pesado", "for loop de 1 milhao de iteracoes"],
          ["Health check nao responde", "Clique do usuario nao responde"],
          ["Servidor parece \"morto\"", "UI parece \"travada\""],
          ["Timeout do Load Balancer", "Usuario fecha a aba"],
        ]}
      />

      <div className="my-8 rounded-lg border border-primary/30 bg-primary/10 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-primary">O Frame Budget</h3>
        <p className="mb-4 text-sm text-foreground">
          O Browser precisa renderizar a <strong>60 FPS</strong> para parecer fluido. Isso significa:
        </p>
        <div className="rounded bg-background/50 p-4 text-center">
          <code className="font-mono text-lg text-primary">
            Budget por Frame = 1000ms / 60 ≈ 16.67ms
          </code>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Se seu JavaScript executar por <strong className="text-destructive">50ms</strong>, 
          voce perdeu <strong className="text-destructive">3 frames</strong>. 
          O usuario percebe "jank" (travamento visual).
        </p>
      </div>

      <AsciiDiagram title="Timeline de Frames (60 FPS target)">
{`Timeline (60 FPS target):
│
├── Frame 1: 16ms ──────────────────┤ ✓ Smooth
├── Frame 2: 16ms ──────────────────┤ ✓ Smooth
├── Frame 3: [█████ JS 50ms █████████████████] ✗ JANK!
├── Frame 4: (dropped)
├── Frame 5: (dropped)
├── Frame 6: 16ms ──────────────────┤ ✓ Recovery`}
      </AsciiDiagram>

      <CodeBlock language="javascript" filename="frame-budget-violation.js">
{`// Isso causa JANK
button.addEventListener('click', () => {
  // Processamento sincrono de 50ms
  const result = processLargeDataset(data); // Bloqueia TUDO
  updateUI(result);
});

// Durante esses 50ms:
// - Animacoes CSS: PAUSADAS
// - Scroll: TRAVADO  
// - Outros cliques: IGNORADOS
// - Usuario: FRUSTRADO`}
      </CodeBlock>

      <div className="my-12 border-t border-border pt-8">
        <h3 className="mb-4 text-xl font-bold text-foreground">Experimente Voce Mesmo</h3>
        <p className="mb-6 text-muted-foreground">
          Compare o comportamento de codigo blocking vs chunked. Tente clicar no botao durante
          a execucao de <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm">heavyComputation()</code>:
        </p>
        <EventLoopSimulator />
      </div>
    </section>
  )
}
