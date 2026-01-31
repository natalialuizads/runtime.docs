"use client"

import { AsciiDiagram } from "@/components/ascii-diagram"
import { CodeBlock } from "@/components/code-block"
import { ComparisonTable } from "@/components/comparison-table"

export function ModuleFederationSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <div className="mb-2 font-mono text-sm text-accent">FASE 2.3</div>
        <h2 className="mb-4 text-3xl font-bold text-foreground">
          Module Federation: Dynamic Linking no Browser
        </h2>
        <p className="text-lg text-muted-foreground">
          A solucao para Dependency Hell - compartilhando modulos em runtime.
        </p>
      </div>

      <p className="mb-6 text-muted-foreground">
        Para um dev backend, <strong className="text-foreground">Module Federation</strong> e 
        como <strong className="text-primary">Dynamic Linking</strong> de bibliotecas (.so/.dll) 
        em tempo de execucao:
      </p>

      <AsciiDiagram title="Dynamic Linking: Backend vs Frontend">
{`BACKEND: Dynamic Linking (Linux)
                                          
┌─────────────────┐      ┌─────────────────┐
│    app.exe      │      │   libc.so.6     │
│  ┌───────────┐  │      │  ┌───────────┐  │
│  │  main()   │──┼──────┼─▶│  printf() │  │
│  └───────────┘  │      │  └───────────┘  │
└─────────────────┘      └─────────────────┘
                                ▲
┌─────────────────┐             │
│   another.exe   │─────────────┘
│  (reusa libc)   │   Mesma copia em memoria
└─────────────────┘


FRONTEND: Module Federation (Webpack 5)
                                          
┌─────────────────┐      ┌─────────────────┐
│   MFE Header    │      │  react@shared   │
│  ┌───────────┐  │      │  ┌───────────┐  │
│  │ Component │──┼──────┼─▶│ useState  │  │
│  └───────────┘  │      │  └───────────┘  │
└─────────────────┘      └─────────────────┘
                                ▲
┌─────────────────┐             │
│    MFE Cart     │─────────────┘
│  (reusa react)  │   Mesma copia em memoria
└─────────────────┘`}
      </AsciiDiagram>

      <ComparisonTable
        headers={["Conceito Backend", "Equivalente Module Federation"]}
        rows={[
          ["Shared Library (.so/.dll)", "Shared Module (react, lodash)"],
          ["Dynamic Linker (ld.so)", "Webpack Runtime"],
          ["Symbol Resolution", "Module Resolution at Runtime"],
          ["Version Mismatch Error", "Fallback to Local Copy"],
          ["LD_PRELOAD", "Override com singleton: true"],
        ]}
      />

      <h3 className="mb-4 mt-12 font-mono text-lg font-semibold text-foreground">
        Configuracao Pratica
      </h3>

      <CodeBlock language="javascript" filename="webpack.config.js (Host/Shell)">
{`// HOST (Shell Application)
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        // "Imports" de outros MFEs - como declarar dependencias externas
        mfe_header: 'mfe_header@https://cdn.example.com/header/remoteEntry.js',
        mfe_cart: 'mfe_cart@https://cdn.example.com/cart/remoteEntry.js',
      },
      shared: {
        // Dependencias que serao compartilhadas entre todos os MFEs
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        lodash: { singleton: true },
      },
    }),
  ],
};`}
      </CodeBlock>

      <CodeBlock language="javascript" filename="webpack.config.js (Remote/MFE)">
{`// REMOTE (MFE Individual)
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe_header',
      filename: 'remoteEntry.js', // Entry point para o Host
      exposes: {
        // O que este MFE "exporta" para outros consumirem
        './Header': './src/components/Header',
        './UserMenu': './src/components/UserMenu',
      },
      shared: {
        // Mesmas dependencias compartilhadas
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
      },
    }),
  ],
};`}
      </CodeBlock>

      <div className="my-8 rounded-lg border border-primary/30 bg-primary/10 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-primary">
          O Fluxo de Resolucao
        </h3>
        <AsciiDiagram title="Runtime Module Resolution">
{`1. Usuario acessa shell.example.com
   │
   ▼
2. Shell carrega e executa seu bundle
   │
   ├─▶ React 18.2.0 carregado (primeira vez)
   │
   ▼
3. Shell precisa renderizar <Header />
   │
   ▼
4. Webpack Runtime: "Header esta em mfe_header remote"
   │
   ▼
5. Fetch: cdn.example.com/header/remoteEntry.js
   │
   ▼
6. MFE Header inicializa
   │
   ├─▶ Precisa de React?
   │   │
   │   ▼
   │   Webpack: "React ja existe no Shell, versao compativel"
   │   │
   │   ▼
   │   REUSA o React do Shell (ZERO bytes adicionais!)
   │
   ▼
7. Header renderiza no DOM do Shell`}
        </AsciiDiagram>
      </div>

      <h3 className="mb-4 mt-12 font-mono text-lg font-semibold text-foreground">
        Estrategias de Versionamento
      </h3>

      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-background p-4">
          <h4 className="mb-2 font-mono text-sm font-semibold text-accent">singleton: true</h4>
          <p className="text-sm text-muted-foreground">
            Apenas UMA versao pode existir. Se houver conflito, a primeira carregada vence.
            Use para libs que tem estado global (React, Redux).
          </p>
          <CodeBlock language="javascript" filename="">
{`shared: {
  react: { 
    singleton: true, 
    strictVersion: true, // Erro se versoes incompativeis
    requiredVersion: '^18.0.0' 
  }
}`}
          </CodeBlock>
        </div>

        <div className="rounded-lg border border-border bg-background p-4">
          <h4 className="mb-2 font-mono text-sm font-semibold text-chart-4">eager: true</h4>
          <p className="text-sm text-muted-foreground">
            Carrega a dependencia imediatamente no bundle inicial, sem async import.
            Use para dependencias criticas que nao podem esperar.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-background p-4">
          <h4 className="mb-2 font-mono text-sm font-semibold text-destructive">Fallback Behavior</h4>
          <p className="text-sm text-muted-foreground">
            Se um MFE precisar de uma versao que o Shell nao tem, ele carrega sua propria copia.
            Isso evita crashes, mas pode causar duplicacao - monitore com bundle analyzer.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-chart-4/30 bg-chart-4/10 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-chart-4">
          Analogia Final: Kubernetes Service Mesh
        </h3>
        <p className="text-sm text-chart-4/80">
          Module Federation e como um <strong>Service Mesh</strong> para o frontend:
        </p>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted-foreground">
          <li><strong className="text-foreground">remoteEntry.js</strong> = Service Discovery endpoint</li>
          <li><strong className="text-foreground">shared dependencies</strong> = Sidecar proxies compartilhando conexoes</li>
          <li><strong className="text-foreground">Webpack Runtime</strong> = Control Plane decidindo roteamento</li>
          <li><strong className="text-foreground">Fallback to local</strong> = Circuit breaker pattern</li>
        </ul>
      </div>
    </section>
  )
}
