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
          Você é um engenheiro backend acostumado a resolver problemas com
          paralelização. Como você aplica esse conhecimento no frontend?
        </p>
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
