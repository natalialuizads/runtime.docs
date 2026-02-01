"use client"

import { CodeBlock } from "@/components/code-block"
import { ComparisonTable } from "@/components/comparison-table"
import { DynamicDiagram } from "@/components/dynamic-diagram"
import { Box, FileCode, Layers, Layout, Network, PlaySquare, Zap } from "lucide-react"

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

      <DynamicDiagram 
        title="Dynamic Linking: Backend vs Frontend"
        nodes={[
          { id: 'app', label: 'app.exe', icon: PlaySquare, x: 20, y: 30 },
          { id: 'lib', label: 'libc.so.6', icon: FileCode, x: 80, y: 30, color: 'border-primary' },
          { id: 'shell', label: 'MFE Shell', icon: Layout, x: 20, y: 70 },
          { id: 'react', label: 'react@shared', icon: Layers, x: 80, y: 70, color: 'border-accent' },
        ]}
        edges={[
          { from: 'app', to: 'lib', animated: true, label: 'printf()' },
          { from: 'shell', to: 'react', animated: true, label: 'useState' },
        ]}
      />

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
        <DynamicDiagram 
          title="Runtime Module Resolution"
          nodes={[
            { id: 'user', label: 'User', icon: Network, x: 10, y: 20 },
            { id: 'shell', label: 'Shell Bundle', icon: Layout, x: 30, y: 20 },
            { id: 'react', label: 'React 18', icon: Layers, x: 50, y: 50, color: 'border-accent' },
            { id: 'remote', label: 'Remote MFE', icon: Box, x: 70, y: 20 },
            { id: 'done', label: 'Rendered', icon: Zap, x: 90, y: 20, color: 'border-primary' },
          ]}
          edges={[
            { from: 'user', to: 'shell', animated: true },
            { from: 'shell', to: 'react', label: 'Init' },
            { from: 'shell', to: 'remote', animated: true, label: 'Fetch' },
            { from: 'remote', to: 'react', label: 'Shared' },
            { from: 'remote', to: 'done', animated: true },
          ]}
        />
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
