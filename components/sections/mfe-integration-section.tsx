"use client";

import { CodeBlock } from "@/components/code-block";
import { ComparisonTable } from "@/components/comparison-table";
import { Box, Link2, Monitor, Zap } from "lucide-react";

export function MFEIntegrationSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <div className="mb-2 font-mono text-sm text-accent">INTEGRAÇÃO</div>
        <h2 className="text-3xl font-bold text-foreground font-sans">
          Estratégias de Runtime
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Como os pedaços de código se encontram no browser? Cada escolha é um
          trade-off entre isolamento e performance.
        </p>
      </div>

      <div className="space-y-16">
        {/* Iframes */}
        <div>
          <h3 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2 font-sans">
            <Monitor className="h-5 w-5 text-muted-foreground" />
            1. Iframes: O Isolamento Total
          </h3>
          <p className="mb-6 text-muted-foreground">
            A forma mais antiga e segura. Cada MFE é um documento HTML completo
            rodando em um processo separado.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-card border border-border rounded-xl p-6">
              <h4 className="font-bold text-green-500 mb-2">Vantagens</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Isolamento total de JS, CSS e DOM</li>
                <li>• Pode rodar linguagens/frameworks diferentes</li>
                <li>• Segurança via Sandbox nativo</li>
              </ul>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h4 className="font-bold text-destructive mb-2">Desvantagens</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Custo de memória altíssimo (duplicate runtimes)</li>
                <li>• Dificuldade de SEO e Deep Linking</li>
                <li>
                  • User experience pobre (layout shifts, modals cortados)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Web Components */}
        <div>
          <h3 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2 font-sans">
            <Box className="h-5 w-5 text-primary" />
            2. Web Components (Shadow DOM)
          </h3>
          <p className="mb-6 text-muted-foreground">
            Usa standards do browser para encapsular componentes. O JS é
            compartilhado, mas o CSS pode ser isolado.
          </p>
          <CodeBlock language="javascript" filename="custom-element.js">
            {`class MyMFE extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = \`<style>h1 { color: red; }</style>
                         <h1>MFE Isolado</h1>\`;
  }
}
customElements.define('mfe-sales', MyMFE);`}
          </CodeBlock>
        </div>

        {/* Module Federation */}
        <div>
          <h3 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2 font-sans">
            <Link2 className="h-5 w-5 text-accent" />
            3. Module Federation
          </h3>
          <p className="mb-6 text-muted-foreground">
            A abordagem moderna. MFEs compartilham bibliotecas (como React/Vue)
            em tempo de execução, evitando downloads duplicados sem perder o
            deploy independente.
          </p>
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-accent" />
              <span className="font-mono text-sm font-bold text-accent">
                Dica de Infra
              </span>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Pense no Module Federation como um <strong>Dynamic Linker</strong>{" "}
              do OS, mas para o seu bundle JavaScript. Ele resolve dependências
              on-demand via network.
            </p>
          </div>
        </div>

        <ComparisonTable
          headers={["Feature", "Iframes", "Web Components", "Mod. Federation"]}
          rows={[
            [
              "Isolamento JS",
              "Total (Runtime separado)",
              "Parcial (Shared global)",
              "Vulnerável (Shared Global)",
            ],
            [
              "Isolamento CSS",
              "Total",
              "Shadow DOM",
              "Namespace / CSS Modules",
            ],
            [
              "Bundle Size",
              "Péssimo (Não compartilha)",
              "Bom (Shared)",
              "Excelente (Deduplicado)",
            ],
            ["UX / Interação", "Difícil", "Nativo", "Nativo"],
            ["Curva de Transição", "Zero", "Média", "Alta (Build tool config)"],
          ]}
        />
      </div>
    </section>
  );
}
