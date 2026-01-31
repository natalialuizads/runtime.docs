"use client"

import { AsciiDiagram } from "@/components/ascii-diagram"
import { CodeBlock } from "@/components/code-block"
import { CRPPipeline } from "@/components/interactive/crp-pipeline"

export function CRPSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <div className="mb-2 font-mono text-sm text-primary">FASE 1.2</div>
        <h2 className="mb-4 text-3xl font-bold text-foreground">Critical Rendering Path</h2>
        <p className="text-lg text-muted-foreground">
          O Pipeline de "Build" do Browser - como texto vira pixels.
        </p>
      </div>

      <p className="mb-6 text-muted-foreground">
        Pense no Browser como um <strong className="text-foreground">CI/CD Pipeline</strong> que 
        transforma texto (HTML/CSS) em pixels:
      </p>

      <AsciiDiagram title="Critical Rendering Path (Build Pipeline)">
{`                    CRITICAL RENDERING PATH
                    (Build Pipeline do Browser)

     ┌──────────┐      ┌──────────┐      ┌──────────┐
     │   HTML   │      │   CSS    │      │    JS    │
     │  (Source)│      │ (Styles) │      │ (Logic)  │
     └────┬─────┘      └────┬─────┘      └────┬─────┘
          │                 │                 │
          ▼                 ▼                 │
     ┌──────────┐      ┌──────────┐           │
     │   DOM    │      │  CSSOM   │           │
     │  (Tree)  │      │  (Tree)  │           │
     └────┬─────┘      └────┬─────┘           │
          │                 │                 │
          └────────┬────────┘                 │
                   │                          │
                   ▼                          │
             ┌──────────┐                     │
             │  Render  │◄────────────────────┘
             │   Tree   │   (pode modificar DOM/CSSOM)
             └────┬─────┘
                  │
                  ▼
             ┌──────────┐
             │  Layout  │  ← Calcula geometria (x, y, width, height)
             └────┬─────┘
                  │
                  ▼
             ┌──────────┐
             │  Paint   │  ← Rasteriza pixels
             └────┬─────┘
                  │
                  ▼
             ┌──────────┐
             │Composite │  ← Combina layers (GPU)
             └──────────┘`}
      </AsciiDiagram>

      <div className="my-8 rounded-lg border border-destructive/30 bg-destructive/10 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-destructive">
          Por que CSS e "Render Blocking"?
        </h3>
        <p className="text-sm text-destructive/80">
          O Browser <strong>nao pode pintar um unico pixel</strong> ate que o CSSOM esteja completo.
        </p>
      </div>

      <p className="my-6 text-muted-foreground">Imagine este cenario:</p>

      <CodeBlock language="html" filename="index.html">
{`<!-- index.html -->
<head>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Hello World</h1>
</body>`}
      </CodeBlock>

      <CodeBlock language="css" filename="styles.css">
{`/* styles.css (carrega em 2 segundos) */
h1 { display: none; }`}
      </CodeBlock>

      <p className="my-6 text-muted-foreground">
        Se o Browser renderizasse <strong className="text-foreground">antes</strong> do CSS carregar:
      </p>

      <ol className="my-4 list-inside list-decimal space-y-2 text-muted-foreground">
        <li>Usuario ve "Hello World"</li>
        <li>CSS carrega</li>
        <li><code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm text-foreground">{"<h1>"}</code> desaparece</li>
      </ol>

      <p className="my-6 text-muted-foreground">
        Isso e chamado <strong className="text-destructive">FOUC (Flash of Unstyled Content)</strong> — uma UX terrivel.
      </p>

      <AsciiDiagram title="CSS Render Blocking Timeline">
{`Timeline:

[HTML Parse]──────────────────────────────────────────►
             │
             ├─[Encontra <link>]
             │        │
             │        ▼
             │  [CSS Download]═══════════════════► (I/O Network)
             │                                  │
             │  [CSSOM Build]◄──────────────────┘
             │        │
             └────────┴────► [Render Tree] → [Layout] → [Paint]
                             
                             ▲
                             │
                    BLOCKED ATE CSSOM PRONTO`}
      </AsciiDiagram>

      <div className="my-8 rounded-lg border border-accent/30 bg-accent/10 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-accent">Analogia Backend</h3>
        <p className="mb-4 text-sm text-accent/80">
          E como uma <strong>Foreign Key Constraint</strong> em um banco de dados:
        </p>
        <CodeBlock language="sql" filename="analogy.sql">
{`-- Voce nao pode inserir um Pedido sem o Cliente existir
INSERT INTO orders (customer_id, product) 
VALUES (123, 'Widget');  -- BLOCKS ate customer 123 existir

-- CSS e a "foreign key" do DOM
-- Voce nao pode "renderizar" DOM sem CSSOM existir`}
        </CodeBlock>
      </div>

      <div className="my-12 border-t border-border pt-8">
        <h3 className="mb-4 text-xl font-bold text-foreground">Visualize o Pipeline</h3>
        <p className="mb-6 text-muted-foreground">
          Observe como o CSS Download bloqueia todo o processo de renderizacao.
          Nenhum pixel aparece na tela ate o CSSOM estar completo:
        </p>
        <CRPPipeline />
      </div>
    </section>
  )
}
