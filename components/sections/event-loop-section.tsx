"use client";

import { CodeBlock } from "@/components/code-block";
import { ComparisonTable } from "@/components/comparison-table";
import { DynamicDiagram } from "@/components/dynamic-diagram";
import { EventLoopSimulator } from "@/components/interactive/event-loop-simulator";
import { Activity, Clock, Code2, Cpu, Layers, Layout } from "lucide-react";

export function EventLoopSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <div className="mb-2 font-mono text-sm text-primary">FASE 1.1</div>
        <h2 className="mb-4 text-3xl font-bold text-foreground">
          Single Thread & Event Loop
        </h2>
        <p className="text-lg text-muted-foreground">
          Como o Browser gerencia o "Main Thread" - e por que isso importa mais
          do que você pensa.
        </p>
      </div>

      {/* Conceito Fundamental */}
      <div className="prose prose-invert max-w-none">
        <p className="text-muted-foreground">
          JavaScript é fundamentalmente{" "}
          <strong className="text-foreground">single-threaded</strong>. Não
          importa onde execute - no Browser ou no servidor - tudo acontece em
          uma única thread. Não há paralelismo real, sem múltiplas threads
          executando código simultaneamente.
        </p>

      </div>

      {/* Analogia do Atendente (Introdução) */}
      <div className="my-8 rounded-lg border border-chart-4/30 bg-chart-4/10 p-6">
        <h3 className="mb-4 font-mono text-sm font-semibold text-chart-4">
          Analogia: O atendente único
        </h3>
        <p className="mb-4 text-sm text-chart-4/80">
          Pense no JavaScript como um atendente que processa clientes em fila,
          um de cada vez:
        </p>
        <ul className="space-y-2 text-sm text-chart-4/80">
          <li className="flex items-start gap-2">
            <span className="text-chart-4">•</span>
            <span>
              <strong>Cliente 1 chega:</strong> Atendente começa a processar
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-chart-4">•</span>
            <span>
              <strong>Cliente 2 chega:</strong> Espera na fila
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-chart-4">•</span>
            <span>
              <strong>Cliente 1 demora 50 minutos:</strong> Clientes 2, 3 e 4
              ficam esperando
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-chart-4">•</span>
            <span>
              <strong>Resultado:</strong> Experiência ruim para todos
            </span>
          </li>
        </ul>
      </div>

      {/* Arquitetura */}
      <div className="my-8">
        <h3 className="mb-4 font-semibold text-foreground">
          Arquitetura do Main Thread
        </h3>
        <DynamicDiagram
          title="Como funciona internamente"
          nodes={[
            {
              id: "js",
              label: "JS Execution",
              icon: Code2,
              x: 20,
              y: 20,
              color: "border-yellow-500/50",
            },
            {
              id: "dom",
              label: "DOM/CSSOM",
              icon: Layers,
              x: 50,
              y: 10,
              color: "border-blue-500/50",
            },
            {
              id: "paint",
              label: "Layout & Paint",
              icon: Layout,
              x: 80,
              y: 20,
              color: "border-green-500/50",
            },
            {
              id: "cpu",
              label: "Single CPU Core",
              icon: Cpu,
              x: 50,
              y: 60,
              color: "border-primary",
            },
          ]}
          edges={[
            { from: "js", to: "cpu" },
            { from: "dom", to: "cpu" },
            { from: "paint", to: "cpu" },
          ]}
        />
      </div>

      {/* Event Loop Visual */}
      <div className="my-8">
        <h3 className="mb-4 font-semibold text-foreground">
          O Event Loop em ação
        </h3>
        <DynamicDiagram
          title="Fila de Eventos (Event Queue)"
          nodes={[
            { id: "q", label: "Event Queue", icon: Clock, x: 20, y: 50 },
            {
              id: "worker",
              label: "JavaScript Thread",
              icon: Activity,
              x: 60,
              y: 50,
              color: "border-destructive",
            },
            { id: "r1", label: "Click Event", x: 85, y: 20 },
            {
              id: "r2",
              label: "Heavy Computation",
              x: 85,
              y: 50,
              color: "border-destructive",
            },
            { id: "r3", label: "Scroll Event (ESPERANDO)", x: 85, y: 80 },
          ]}
          edges={[
            { from: "q", to: "worker", animated: true, label: "Processando" },
            { from: "worker", to: "r1", label: "✓ Concluído" },
            { from: "worker", to: "r2", animated: true, label: "🔴 BLOQUEADO" },
            { from: "worker", to: "r3", label: "⏳ Aguardando" },
          ]}
        />

        <p className="my-6 text-muted-foreground">
          Enquanto o JavaScript processa um{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm text-foreground">
            Heavy Computation
          </code>
          ,{" "}
          <strong className="text-foreground">
            nenhum outro evento é processado
          </strong>
          . Cliques, scroll, animações - tudo fica na fila esperando seu
          momento.
        </p>
      </div>

      {/* Frame Budget */}
      <div className="my-8 rounded-lg border border-primary/30 bg-primary/10 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-primary">
          O Frame Budget
        </h3>
        <p className="mb-4 text-sm text-foreground">
          O Browser precisa renderizar a <strong>60 FPS</strong> (quadros por
          segundo) para parecer fluido. Isso significa:
        </p>
        <div className="rounded bg-background/50 p-4 text-center">
          <code className="font-mono text-lg text-primary">
            Tempo por Frame = 1000ms ÷ 60 = <strong>16.67ms</strong>
          </code>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Se seu JavaScript executar por{" "}
          <strong className="text-destructive">50ms</strong>, você perde{" "}
          <strong className="text-destructive">3 frames</strong>. O usuário vê a
          página "travar" momentaneamente.
        </p>
      </div>

      {/* Comparação: O que bloqueia */}
      <div className="my-8">
        <h3 className="mb-4 font-semibold text-foreground">
          O que acontece durante um bloqueio?
        </h3>
        <ComparisonTable
          headers={["Evento na Fila", "Status"]}
          rows={[
            ["1. Clique do usuário", "✓ Executa imediatamente"],
            ["2. For loop pesado (50ms)", "🔴 Bloqueia TUDO"],
            ["3. Scroll do usuário", "⏳ Fica esperando"],
            ["4. Animação CSS", "⏸️ Pausada, travada"],
            ["5. Próximo clique", "⏳ Ainda esperando"],
          ]}
        />
      </div>

      {/* Simulador Interativo */}
      <div className="my-12  pt-8">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          Experimente você mesmo
        </h3>
        <p className="mb-6 text-muted-foreground">
          Veja ao vivo a diferença entre código que bloqueia vs código
          otimizado. Tente clicar no botão e interagir durante a execução:
        </p>
        <EventLoopSimulator />
      </div>

      {/* Resumo Final */}
      <div className="my-8 rounded-lg border border-green-500/30 bg-green-500/10 p-6">
        <h3 className="mb-3 font-mono text-sm font-semibold text-green-500">
          Resumo Importante
        </h3>
        <ul className="space-y-2 text-sm text-green-500/80">
          <li>
            • JavaScript é <strong>sempre single-threaded</strong>
          </li>
          <li>
            • Eventos são processados um por vez na <strong>Event Queue</strong>
          </li>
          <li>
            • Operações longas <strong>bloqueiam tudo</strong>
          </li>
          <li>
            • Você tem apenas <strong>16.67ms por frame</strong> para não travar
          </li>
          <li>• Usar Web Workers ou chunking resolve o problema</li>
        </ul>
      </div>
    </section>
  );
}
