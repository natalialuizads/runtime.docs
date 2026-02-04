"use client";

import { CodeBlock } from "@/components/code-block";
import { ComparisonTable } from "@/components/comparison-table";
import { DynamicDiagram } from "@/components/dynamic-diagram";
import { cn } from "@/lib/utils";
import {
  Box,
  Cloud,
  Layers,
  RefreshCw,
  Server,
  Smartphone,
  Zap,
} from "lucide-react";
import { useState } from "react";

type SDUIPattern = "traditional" | "sdui" | "hybrid";

interface PatternInfo {
  id: SDUIPattern;
  name: string;
  icon: React.ElementType;
  description: string;
  pros: string[];
  cons: string[];
}

const patterns: PatternInfo[] = [
  {
    id: "traditional",
    name: "UI Tradicional",
    icon: Smartphone,
    description:
      "UI definida no código do cliente. Mudancas requerem novo deploy/release.",
    pros: [
      "Controle total no cliente",
      "Performance otimizada",
      "Type-safety completo",
    ],
    cons: [
      "Deploys frequentes",
      "Review de App Store",
      "Versões fragmentadas",
    ],
  },
  {
    id: "sdui",
    name: "Server-Driven UI",
    icon: Server,
    description:
      "Servidor envia a estrutura da UI como dados. Cliente apenas renderiza.",
    pros: [
      "Atualizações instantâneas",
      "Sem review de App Store",
      "A/B testing nativo",
    ],
    cons: [
      "Complexidade no servidor",
      "Latência de rede",
      "Flexibilidade limitada",
    ],
  },
  {
    id: "hybrid",
    name: "Híbrido",
    icon: Layers,
    description:
      "Combina componentes nativos com configuração dinâmica do servidor.",
    pros: ["Melhor dos dois mundos", "Performance + Flexibilidade", "Gradual adoption"],
    cons: [
      "Mais complexo de manter",
      "Fronteira nem sempre clara",
      "Requer bom design system",
    ],
  },
];

export function ServerDrivenUISection() {
  const [selectedPattern, setSelectedPattern] =
    useState<SDUIPattern>("traditional");
  const current = patterns.find((p) => p.id === selectedPattern)!;

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-chart-4/30 bg-chart-4/10 px-4 py-2 mb-4">
          <Server className="h-4 w-4 text-chart-4" />
          <span className="font-mono text-xs text-chart-4">SERVER-DRIVEN UI</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground">
          Server-Driven UI: O Backend Define a Interface
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Imagine se o backend pudesse definir não só os dados, mas também
          <strong> como</strong> eles devem ser exibidos. É isso que Server-Driven UI
          (SDUI) permite.
        </p>
      </div>

      {/* Conceito Principal */}
      <div className="mb-12 rounded-xl border border-border bg-card p-6">
        <h3 className="mb-6 font-mono text-lg font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-5 w-5 text-chart-4" />
          O Conceito: UI como Dados
        </h3>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <h4 className="mb-3 font-mono text-sm font-semibold text-muted-foreground">
              Abordagem Tradicional
            </h4>
            <CodeBlock language="typescript" filename="tradicional.tsx">
              {`// Cliente define a estrutura
function ProductPage({ productId }) {
  const product = useQuery(productId);
  
  return (
    <div>
      <Image src={product.image} />
      <Text>{product.title}</Text>
      <Price value={product.price} />
      <Button>Comprar</Button>
    </div>
  );
}
// Mudou o layout? Novo deploy.`}
            </CodeBlock>
          </div>

          <div className="rounded-lg border border-chart-4/30 bg-chart-4/5 p-4">
            <h4 className="mb-3 font-mono text-sm font-semibold text-chart-4">
              Server-Driven UI
            </h4>
            <CodeBlock language="json" filename="api-response.json">
              {`{
  "components": [
    { "type": "Image", "props": { "src": "..." } },
    { "type": "Text", "props": { "text": "..." } },
    { "type": "Price", "props": { "value": 99.90 } },
    { "type": "Button", "props": { 
        "text": "Comprar",
        "action": { "type": "ADD_TO_CART" }
      }
    }
  ]
}
// Mudou o layout? Apenas altere a API.`}
            </CodeBlock>
          </div>
        </div>
      </div>

      {/* Pattern Selector */}
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          Padrões de Implementação
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {patterns.map((pattern) => {
            const Icon = pattern.icon;
            return (
              <button
                key={pattern.id}
                onClick={() => setSelectedPattern(pattern.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border p-4 transition-all",
                  selectedPattern === pattern.id
                    ? "border-chart-4/50 bg-chart-4/10"
                    : "border-border bg-card hover:border-border/80"
                )}
              >
                <Icon
                  className={cn(
                    "h-6 w-6",
                    selectedPattern === pattern.id
                      ? "text-chart-4"
                      : "text-muted-foreground"
                  )}
                />
                <span className="text-center font-mono text-xs">
                  {pattern.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Pattern Detail */}
      <div className="mb-12 rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <current.icon className="h-6 w-6 text-chart-4" />
          <h4 className="text-xl font-bold text-foreground">{current.name}</h4>
        </div>
        <p className="mb-6 text-muted-foreground">{current.description}</p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
            <h5 className="mb-3 font-mono text-sm font-semibold text-accent">
              Vantagens
            </h5>
            <ul className="space-y-2">
              {current.pros.map((pro, i) => (
                <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                  <span className="text-accent">+</span> {pro}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <h5 className="mb-3 font-mono text-sm font-semibold text-destructive">
              Desvantagens
            </h5>
            <ul className="space-y-2">
              {current.cons.map((con, i) => (
                <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                  <span className="text-destructive">-</span> {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Arquitetura Diagram */}
      <div className="mb-12">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          Arquitetura Server-Driven UI
        </h3>
        <DynamicDiagram
          title="Fluxo SDUI"
          nodes={[
            { id: "client", label: "Cliente (App/Web)", icon: Smartphone, x: 15, y: 50 },
            { id: "bff", label: "BFF / API Gateway", icon: Cloud, x: 40, y: 50, color: "border-chart-4" },
            { id: "schema", label: "UI Schema Service", icon: Layers, x: 65, y: 30, color: "border-primary" },
            { id: "data", label: "Data Services", icon: Server, x: 65, y: 70 },
            { id: "cms", label: "CMS / Config", icon: Box, x: 85, y: 50, color: "border-accent" },
          ]}
          edges={[
            { from: "client", to: "bff", animated: true, label: "GET /screen" },
            { from: "bff", to: "schema", animated: true, label: "UI Spec" },
            { from: "bff", to: "data", animated: true, label: "Data" },
            { from: "schema", to: "cms", label: "Config" },
            { from: "bff", to: "client", animated: true, label: "JSON + UI" },
          ]}
        />
      </div>

      {/* Implementação Prática */}
      <div className="mb-12">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          Implementação: Component Registry
        </h3>
        <p className="mb-6 text-muted-foreground">
          O cliente mantém um registro de componentes disponíveis. O servidor
          referencia esses componentes pelo tipo.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <CodeBlock language="typescript" filename="component-registry.ts">
            {`// Registry de componentes disponíveis
const ComponentRegistry = {
  'HeroBanner': HeroBanner,
  'ProductGrid': ProductGrid,
  'Carousel': Carousel,
  'CTAButton': CTAButton,
  'TextBlock': TextBlock,
  'VideoPlayer': VideoPlayer,
};

// Renderizador dinâmico
function SDUIRenderer({ schema }) {
  return schema.components.map((item, i) => {
    const Component = ComponentRegistry[item.type];
    if (!Component) return null;
    return <Component key={i} {...item.props} />;
  });
}`}
          </CodeBlock>

          <CodeBlock language="typescript" filename="schema-validator.ts">
            {`// Validação do schema (importante!)
import { z } from 'zod';

const ComponentSchema = z.object({
  type: z.enum([
    'HeroBanner', 'ProductGrid', 
    'Carousel', 'CTAButton'
  ]),
  props: z.record(z.unknown()),
  children: z.array(z.lazy(() => 
    ComponentSchema
  )).optional(),
});

const ScreenSchema = z.object({
  version: z.string(),
  components: z.array(ComponentSchema),
});

// Sempre valide antes de renderizar!`}
          </CodeBlock>
        </div>
      </div>

      {/* Casos de Uso Reais */}
      <div className="mb-12">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          Casos de Uso Reais
        </h3>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              <h4 className="font-mono text-sm font-semibold">Airbnb</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Usa SDUI para a tela de busca. Permite A/B testing de layouts sem
              novos deploys do app.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-accent" />
              <h4 className="font-mono text-sm font-semibold">Shopify</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Storefronts são configurados via API. Merchants customizam sem
              código.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-chart-4" />
              <h4 className="font-mono text-sm font-semibold">Instagram</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Feed e Stories usam SDUI para inserir novos tipos de conteúdo
              dinamicamente.
            </p>
          </div>
        </div>
      </div>

      {/* Comparação */}
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          Matriz de Decisão
        </h3>
        <ComparisonTable
          headers={[
            "Critério",
            "UI Tradicional",
            "Server-Driven UI",
            "Híbrido",
          ]}
          rows={[
            ["Velocidade de Mudanças", "Lento (Deploy)", "Instantâneo", "Médio"],
            ["Performance", "Excelente", "Bom", "Muito Bom"],
            ["Complexidade Backend", "Baixa", "Alta", "Média"],
            ["Flexibilidade", "Total", "Limitada ao Schema", "Balanceada"],
            ["A/B Testing", "Complexo", "Nativo", "Parcial"],
            ["Ideal Para", "Apps estáveis", "Apps dinâmicos", "Maioria dos casos"],
          ]}
        />
      </div>

      {/* Recomendação */}
      <div className="rounded-lg border border-chart-4/30 bg-chart-4/10 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-chart-4">
          Recomendação
        </h3>
        <p className="text-sm text-foreground mb-4">
          <strong>Comece Híbrido:</strong> Mantenha componentes complexos como
          código nativo, mas permita que o servidor configure layouts, ordem de
          exibição e feature flags.
        </p>
        <div className="rounded-lg bg-background/50 p-4">
          <p className="text-xs text-muted-foreground font-mono">
            Analogia Backend: SDUI é como GraphQL para a UI. Em vez de endpoints
            fixos retornando dados fixos, você tem um schema flexível que permite
            ao cliente pedir exatamente o que precisa renderizar.
          </p>
        </div>
      </div>
    </section>
  );
}
