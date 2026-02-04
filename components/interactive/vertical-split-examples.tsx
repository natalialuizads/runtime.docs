"use client";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  CreditCard,
  FileText,
  Globe,
  Heart,
  Home,
  Layers,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Star,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import React, { useState } from "react";

type ExampleType = "ecommerce" | "banking" | "saas";

interface MFEInfo {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  features: string[];
  team: string;
  deployFreq: string;
}

interface ExampleData {
  id: ExampleType;
  name: string;
  description: string;
  mfes: MFEInfo[];
}

const examples: ExampleData[] = [
  {
    id: "ecommerce",
    name: "E-Commerce (Amazon-like)",
    description:
      "Divisão vertical por jornada do cliente: descoberta, compra, conta.",
    mfes: [
      {
        id: "catalog",
        name: "Catálogo",
        icon: Search,
        color: "primary",
        features: ["Busca", "Filtros", "Listagem de Produtos"],
        team: "Squad Discovery",
        deployFreq: "4x/dia",
      },
      {
        id: "product",
        name: "Produto",
        icon: Package,
        color: "accent",
        features: ["Detalhes", "Avaliações", "Produtos Relacionados"],
        team: "Squad Product",
        deployFreq: "3x/dia",
      },
      {
        id: "cart",
        name: "Carrinho",
        icon: ShoppingCart,
        color: "chart-4",
        features: ["Itens", "Cupons", "Frete"],
        team: "Squad Cart",
        deployFreq: "2x/dia",
      },
      {
        id: "checkout",
        name: "Checkout",
        icon: CreditCard,
        color: "chart-3",
        features: ["Pagamento", "Endereço", "Confirmação"],
        team: "Squad Payments",
        deployFreq: "1x/dia",
      },
      {
        id: "account",
        name: "Minha Conta",
        icon: User,
        color: "chart-5",
        features: ["Pedidos", "Dados", "Endereços"],
        team: "Squad Customer",
        deployFreq: "2x/dia",
      },
    ],
  },
  {
    id: "banking",
    name: "Banking App (Itau)",
    description:
      "Divisão por produto financeiro: conta, cartão, investimentos.",
    mfes: [
      {
        id: "home",
        name: "Home",
        icon: Home,
        color: "primary",
        features: ["Saldo", "Atalhos", "Timeline"],
        team: "Squad Home",
        deployFreq: "5x/dia",
      },
      {
        id: "account",
        name: "Conta",
        icon: Layers,
        color: "accent",
        features: ["Extrato", "Transferências", "Pix"],
        team: "Squad Banking",
        deployFreq: "3x/dia",
      },
      {
        id: "card",
        name: "Cartão",
        icon: CreditCard,
        color: "chart-4",
        features: ["Fatura", "Limite", "Parcelamento"],
        team: "Squad Card",
        deployFreq: "2x/dia",
      },
      {
        id: "invest",
        name: "Investimentos",
        icon: TrendingUp,
        color: "chart-3",
        features: ["Portfólio", "Rendimentos", "Aplicações"],
        team: "Squad Invest",
        deployFreq: "2x/dia",
      },
      {
        id: "rewards",
        name: "Benefícios",
        icon: Star,
        color: "chart-5",
        features: ["Pontos", "Cashback", "Parceiros"],
        team: "Squad Rewards",
        deployFreq: "1x/dia",
      },
    ],
  },
  {
    id: "saas",
    name: "SaaS Dashboard (Notion-like)",
    description: "Divisão por funcionalidade core: workspace, docs, analytics.",
    mfes: [
      {
        id: "workspace",
        name: "Workspace",
        icon: Layers,
        color: "primary",
        features: ["Navegação", "Sidebar", "Favoritos"],
        team: "Squad Platform",
        deployFreq: "3x/dia",
      },
      {
        id: "editor",
        name: "Editor",
        icon: FileText,
        color: "accent",
        features: ["Rich Text", "Blocks", "Colaboração"],
        team: "Squad Editor",
        deployFreq: "5x/dia",
      },
      {
        id: "database",
        name: "Database",
        icon: BarChart3,
        color: "chart-4",
        features: ["Tabelas", "Filtros", "Views"],
        team: "Squad Data",
        deployFreq: "4x/dia",
      },
      {
        id: "sharing",
        name: "Sharing",
        icon: Users,
        color: "chart-3",
        features: ["Permissões", "Links", "Comentários"],
        team: "Squad Collab",
        deployFreq: "2x/dia",
      },
      {
        id: "settings",
        name: "Settings",
        icon: Settings,
        color: "chart-5",
        features: ["Billing", "Team", "Integrations"],
        team: "Squad Admin",
        deployFreq: "1x/dia",
      },
    ],
  },
];

export function VerticalSplitExamples() {
  const [selectedExample, setSelectedExample] = useState<ExampleType>("ecommerce");
  const [selectedMFE, setSelectedMFE] = useState<string | null>(null);

  const current = examples.find((e) => e.id === selectedExample)!;
  const selected = current.mfes.find((m) => m.id === selectedMFE);

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-5 w-5 text-primary" />
            <h3 className="font-mono text-lg font-semibold text-foreground">
              Exemplos de Divisão Vertical
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Diferentes indústrias aplicam divisão vertical de formas distintas.
            Explore exemplos de E-commerce, Banking e SaaS.
          </p>
        </div>

        {/* Example Selector */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {examples.map((example) => (
            <button
              key={example.id}
              onClick={() => {
                setSelectedExample(example.id);
                setSelectedMFE(null);
              }}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all",
                selectedExample === example.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              )}
            >
              {example.name}
            </button>
          ))}
        </div>

        <p className="mb-6 text-sm text-muted-foreground italic">
          {current.description}
        </p>

        {/* Visual MFE Layout */}
        <div className="mb-6 rounded-lg border border-border bg-background overflow-hidden">
          {/* Shell Header */}
          <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-2">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center">
                <Layers className="h-4 w-4 text-primary" />
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                APP SHELL
              </span>
            </div>
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-destructive/60" />
              <div className="h-2 w-2 rounded-full bg-chart-4/60" />
              <div className="h-2 w-2 rounded-full bg-accent/60" />
            </div>
          </div>

          <div className="flex min-h-80">
            {/* Sidebar Navigation */}
            <div className="w-48 border-r border-border bg-secondary/30 p-4 shrink-0">
              <nav className="space-y-1">
                {current.mfes.map((mfe) => {
                  const Icon = mfe.icon;
                  return (
                    <button
                      key={mfe.id}
                      onClick={() => setSelectedMFE(mfe.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
                        selectedMFE === mfe.id
                          ? `bg-${mfe.color}/20 text-${mfe.color} ring-1 ring-${mfe.color}/30`
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                      onMouseEnter={() => setSelectedMFE(mfe.id)}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{mfe.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6">
              {selected ? (
                <div
                  className={cn(
                    "h-full rounded-lg border p-6 transition-all",
                    `border-${selected.color}/30 bg-${selected.color}/5`
                  )}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <selected.icon className={`h-8 w-8 text-${selected.color}`} />
                    <div>
                      <h4 className="font-bold text-foreground">{selected.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {selected.team} - Deploy: {selected.deployFreq}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    {selected.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded bg-background/50 px-3 py-2"
                      >
                        <div className={`h-2 w-2 rounded-full bg-${selected.color}`} />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <p className="text-sm">Selecione um MFE na sidebar</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MFE Summary */}
        {selected && (
          <div
            className={`rounded-lg border border-${selected.color}/30 bg-${selected.color}/5 p-4`}
          >
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="mb-2 font-mono text-xs text-muted-foreground">
                  FEATURES
                </p>
                <ul className="space-y-1">
                  {selected.features.map((feature, i) => (
                    <li key={i} className="text-sm text-foreground">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 font-mono text-xs text-muted-foreground">
                  TEAM OWNER
                </p>
                <p className="text-sm font-medium text-foreground">
                  {selected.team}
                </p>
              </div>
              <div>
                <p className="mb-2 font-mono text-xs text-muted-foreground">
                  DEPLOY FREQUENCY
                </p>
                <p className="text-sm font-medium text-foreground">
                  {selected.deployFreq}
                </p>
              </div>
            </div>
          </div>
        )}

        {!selected && (
          <p className="text-center text-sm text-muted-foreground">
            Passe o mouse ou clique nos itens da sidebar para ver detalhes de cada MFE
          </p>
        )}

        {/* Key Insight */}
        <div className="mt-6 rounded-lg bg-primary/10 border border-primary/20 p-4">
          <h4 className="mb-2 font-mono text-sm font-semibold text-primary">
            Insight: Divisão por Domínio de Negócio
          </h4>
          <p className="text-sm text-foreground/80">
            {selectedExample === "ecommerce" &&
              "No e-commerce, cada MFE representa uma etapa da jornada de compra. O time de Checkout pode fazer mudancas sem afetar o Catálogo, permitindo deploys independentes e ownership claro."}
            {selectedExample === "banking" &&
              "Em banking, a divisão segue produtos financeiros regulados separadamente. O MFE de Investimentos tem requisitos de compliance diferentes do MFE de Conta, justificando a separação."}
            {selectedExample === "saas" &&
              "Em SaaS, o Editor é o core do produto e recebe mais deploys. Funcionalidades auxiliares como Settings mudam menos frequentemente, mas precisam de autonomia para o time de Admin."}
          </p>
        </div>

        {/* Total Deploys */}
        <div className="mt-6 grid grid-cols-5 gap-2 text-center">
          {current.mfes.map((mfe) => (
            <div key={mfe.id} className="rounded bg-secondary/50 p-2">
              <mfe.icon className={`mx-auto h-4 w-4 text-${mfe.color}`} />
              <p className="mt-1 text-[10px] text-muted-foreground">
                {mfe.deployFreq}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Total:{" "}
          {current.mfes.reduce((acc, mfe) => {
            const num = parseInt(mfe.deployFreq);
            return acc + num;
          }, 0)}
          x deploys/dia independentes
        </p>
      </div>
    </section>
  );
}
