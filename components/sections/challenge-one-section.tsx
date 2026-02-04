"use client";

import { DebugChallenge } from "@/components/debug-challenge";

export function ChallengeOneSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <div className="mb-2 font-mono text-sm text-destructive">
          CHECKPOINT
        </div>
        <h2 className="mb-4 text-3xl font-bold text-foreground">
          Desafio de Debug #1
        </h2>
        <p className="text-lg text-muted-foreground">
          Voce e um engenheiro backend acostumado a resolver problemas com
          paralelizacao. Como voce aplica esse conhecimento no frontend?
        </p>
      </div>

      {/* Contexto importante */}
      <div className="mb-8 rounded-xl border border-chart-4/30 bg-chart-4/5 p-6">
        <h3 className="mb-4 font-mono text-sm font-semibold text-chart-4">
          Armadilhas Comuns do Frontend
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-background/50 p-4">
            <h4 className="mb-2 font-mono text-xs font-semibold text-foreground">
              Listas Muito Grandes
            </h4>
            <p className="text-sm text-muted-foreground">
              Renderizar 10.000 itens de uma vez trava a UI. O browser precisa
              calcular layout, pintar pixels e manter tudo na memoria.
            </p>
          </div>
          <div className="rounded-lg bg-background/50 p-4">
            <h4 className="mb-2 font-mono text-xs font-semibold text-foreground">
              async/await Nao Resolve Tudo
            </h4>
            <p className="text-sm text-muted-foreground">
              async/await so ajuda com I/O (fetch, timers). Processamento
              CPU-bound continua bloqueando a thread principal.
            </p>
          </div>
          <div className="rounded-lg bg-background/50 p-4">
            <h4 className="mb-2 font-mono text-xs font-semibold text-foreground">
              Muitas Requests Simultaneas
            </h4>
            <p className="text-sm text-muted-foreground">
              Browsers limitam conexoes (6-8 por dominio). 50 fetches
              simultaneos criam fila e competem por recursos.
            </p>
          </div>
          <div className="rounded-lg bg-background/50 p-4">
            <h4 className="mb-2 font-mono text-xs font-semibold text-foreground">
              Dificuldade em Observabilidade
            </h4>
            <p className="text-sm text-muted-foreground">
              Diferente do backend, voce nao tem metricas de CPU/memoria em
              tempo real. Debugging depende do DevTools do usuario.
            </p>
          </div>
        </div>
      </div>

      <DebugChallenge
        title="Paralelizacao vs Single Thread"
        scenario="Sua aplicacao frontend precisa: 1) Buscar dados do usuario na API (GET /user), 2) Buscar permissoes do usuario (GET /permissions), 3) Renderizar um dashboard complexo com esses dados."
        backendApproach={`# Backend Pattern - Paralelo
async def get_dashboard_data():
    user, permissions = await asyncio.gather(
        fetch_user(),        # I/O paralelo
        fetch_permissions()  # I/O paralelo
    )
    return compute_dashboard(user, permissions)  # CPU em Worker Thread`}
        problem="Um dev junior implementou isso no frontend usando Promise.all para os fetches (correto!), mas depois chama heavyDataProcessing() que demora 800ms sincronamente. Durante esses 800ms: cliques não respondem, scroll trava, animações congelam."
        hints={[
          "Web Workers existem e rodam em threads separadas, mas não têm acesso ao DOM",
          "requestIdleCallback permite executar codigo quando o browser esta 'ocioso'",
          "Time-slicing pode quebrar uma tarefa grande em chunks menores usando setTimeout/requestAnimationFrame",
          "Pense no pattern de 'Chunked Processing' - como um cursor de banco de dados processa batches",
        ]}
        solution={`// SOLUCAO 1: Web Worker (melhor para CPU-heavy puro)
const worker = new Worker('data-processor.js');
worker.postMessage({ user, permissions });
worker.onmessage = (e) => renderDashboard(e.data);

// SOLUCAO 2: Time-slicing com requestIdleCallback
function processInChunks(items, chunkSize = 100) {
  let index = 0;
  
  function processChunk(deadline) {
    while (index < items.length && deadline.timeRemaining() > 0) {
      processItem(items[index]);
      index++;
    }
    
    if (index < items.length) {
      requestIdleCallback(processChunk);
    } else {
      renderDashboard(results);
    }
  }
  
  requestIdleCallback(processChunk);
}

// ANALOGIA BACKEND: É como usar um cursor de DB
// em vez de SELECT * FROM huge_table
// você faz SELECT ... LIMIT 100 OFFSET n`}
      />
    </section>
  );
}
