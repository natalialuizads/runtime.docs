"use client";

import { CodeBlock } from "@/components/code-block";
import { ComparisonTable } from "@/components/comparison-table";
import { cn } from "@/lib/utils";
import { 
  Box, 
  Layers, 
  Monitor, 
  Zap, 
  ShieldCheck, 
  Globe, 
  ServerCrash,
  Cpu
} from "lucide-react";

export function MFEIntegrationSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      {/* HEADER DIDÁTICO */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 mb-4">
          <Layers className="h-4 w-4 text-accent" />
          <span className="font-mono text-xs text-accent">ESTRATÉGIAS DE RUNTIME</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          Como os pedaços se unem?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
          Integrar Microfrontends é decidir o nível de <strong>isolamento vs. performance</strong>. 
          Pense nisso como escolher entre rodar uma VM, um Container ou uma DLL.
        </p>
      </div>

      <div className="space-y-20">
        
        {/* 1. IFRAMES */}
        <div className="grid md:grid-cols-5 gap-8 items-start">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <Monitor className="h-5 w-5 text-muted-foreground" />
              1. Iframes (A Virtual Machine)
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              É o isolamento mais bruto. Cada MFE é um "mini-site" completo dentro de uma janela. 
              <strong> Para o Backend:</strong> É como rodar cada serviço em uma VM separada, com seu próprio OS e recursos dedicados.
            </p>
            <div className="flex gap-2">
               <span className="px-2 py-1 rounded bg-green-500/10 text-green-500 text-[10px] font-bold">SEGURANÇA MÁXIMA</span>
               <span className="px-2 py-1 rounded bg-destructive/10 text-destructive text-[10px] font-bold">ALTA LATÊNCIA</span>
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="mt-4 grid grid-cols-2 gap-4">
               <div className="p-4 rounded-lg bg-card border border-border">
                  <h4 className="text-xs font-bold mb-1 flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-green-500"/> Pros</h4>
                  <p className="text-[11px] text-muted-foreground">Nada vaza. O CSS de um não quebra o outro. Se um trava, o resto vive.</p>
               </div>
               <div className="p-4 rounded-lg bg-card border border-border">
                  <h4 className="text-xs font-bold mb-1 flex items-center gap-1"><ServerCrash className="h-3 w-3 text-destructive"/> Contras</h4>
                  <p className="text-[11px] text-muted-foreground">Performance ruim. O browser precisa baixar o framework 10 vezes.</p>
               </div>
            </div>
          </div>
        </div>

        {/* 2. WEB COMPONENTS */}
        <div className="grid md:grid-cols-5 gap-8 items-start">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <Box className="h-5 w-5 text-primary" />
              2. Web Components (O Container)
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Usa o <strong>Shadow DOM</strong> para criar uma cápsula. O JS compartilha o "kernel" (browser), mas o CSS é isolado.
              <strong> Para o Backend:</strong> É como rodar via Docker. Os processos compartilham a CPU/RAM, mas têm namespaces isolados.
            </p>
            <div className="flex gap-2">
               <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-[10px] font-bold">BROWSER NATIVO</span>
               <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 text-[10px] font-bold">SEO COMPLEXO</span>
            </div>
          </div>
          <div className="md:col-span-3">
            <CodeBlock language="javascript" filename="mfe-button.js">
{`class MfeHeader extends HTMLElement {
  connectedCallback() {
    // Shadow DOM isola o estilo
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.innerHTML = \`<style>h1 { color: blue; }</style>
                         <h1>Dashboard Vendas</h1>\`;
  }
}
customElements.define('mfe-header', MfeHeader);`}
            </CodeBlock>
          </div>
        </div>

        {/* 3. MODULE FEDERATION */}
        <div className="grid md:grid-cols-5 gap-8 items-start">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <Zap className="h-5 w-5 text-accent" />
              3. Module Federation (DLL / Shared Object)
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O estado da arte. Permite carregar código JS em runtime e compartilhar dependências (ex: não baixar o React duas vezes).
              <strong> Para o Backend:</strong> É como o <strong>Dynamic Linking</strong>. O executável principal (Shell) carrega bibliotecas `.so` ou `.dll` conforme a necessidade.
            </p>
            <div className="flex gap-2">
               <span className="px-2 py-1 rounded bg-accent/10 text-accent text-[10px] font-bold">PERFORMANCE ELITE</span>
               <span className="px-2 py-1 rounded bg-orange-500/10 text-orange-500 text-[10px] font-bold">COMPLEXIDADE BUILD</span>
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="h-4 w-4 text-accent" />
                <span className="font-mono text-xs font-bold text-accent">INFRA INSIGHT</span>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">
                Diferente do NPM tradicional (estático), o Module Federation resolve o grafo de dependências 
                <strong> no browser do cliente</strong>. Se o MFE A e B usam Angular, o Shell garante que apenas 
                uma instância do Angular seja carregada.
              </p>
            </div>
          </div>
        </div>

        {/* COMPARISON MATRIZ */}
        <div className="pt-8">
          <h3 className="mb-8 text-2xl font-bold text-foreground text-center">Matriz de Decisão</h3>
          <ComparisonTable
            headers={["Critério", "Iframes", "Web Components", "Module Fed."]}
            rows={[
              ["Analogia", "VM (Isolado)", "Container (Scoped)", "Dynamic Linking"],
              ["Isolamento JS", "Mínimo Risco", "Médio Risco", "Shared Global"],
              ["Isolamento CSS", "Total", "Nativo (Shadow)", "Namespace / Modules"],
              ["Performance", "Lenta", "Rápida", "Ultra Rápida"],
              ["Deploy", "Independente", "Independente", "Independente"],
            ]}
          />
        </div>
      </div>
    </section>
  );
}