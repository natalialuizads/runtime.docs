"use client";

import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowRight,
  Blocks,
  Box,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  FileCode2,
  FileJson,
  Folder,
  FolderGit2,
  GitFork,
  Globe,
  HeartHandshake,
  Laptop2,
  Scale,
  Scissors,
  Users,
} from "lucide-react";
import { useState } from "react";

// --- TIPOS ---
type StrategyType = "monolith" | "modular" | "mfe";

// Estrutura para a árvore de arquivos
interface FileNode {
  name: string;
  type: "folder" | "file" | "repo" | "root";
  level: number;
  highlight?: boolean; // Para destacar pastas importantes
  children?: FileNode[];
}

interface StrategyData {
  id: StrategyType;
  title: string;
  subtitle: string;
  teamSize: string;
  icon: React.ElementType;
  color: string;
  pros: string[];
  cons: string[];
  tools: string[];
  fileStructure: FileNode[]; // Mudamos de diagram nodes para fileStructure
}

// --- DADOS ---
const strategies: StrategyData[] = [
  {
    id: "monolith",
    title: "Monolito Clássico",
    subtitle: "Simplicidade e Velocidade",
    teamSize: "1 - 10 devs",
    icon: Box,
    color: "blue",
    pros: [
      "Refatoração trivial (Ctrl+C / Ctrl+V)",
      "Zero latência de rede entre módulos",
      "Deploy atômico (tudo ou nada)",
    ],
    cons: [
      "Builds ficam lentos com o tempo",
      "Acoplamento acidental (Spaghetti Code)",
    ],
    tools: ["Vite", "CRA", "Next.js"],
    fileStructure: [
      { name: "my-app", type: "root", level: 0, children: [
        { name: "src", type: "folder", level: 1, children: [
          { name: "components", type: "folder", level: 2, children: [
            { name: "Header.tsx", type: "file", level: 3 },
            { name: "Cart.tsx", type: "file", level: 3 },
            { name: "Button.tsx", type: "file", level: 3 },
          ]},
          { name: "hooks", type: "folder", level: 2 },
          { name: "utils", type: "folder", level: 2 },
          { name: "App.tsx", type: "file", level: 2 },
        ]},
        { name: "package.json", type: "file", level: 1 },
      ]}
    ],
  },
  {
    id: "modular",
    title: "Monolito Modular",
    subtitle: "O Ponto de Equilíbrio",
    teamSize: "10 - 50 devs",
    icon: Blocks,
    color: "emerald",
    pros: [
      "Limites estritos de código (Lint)",
      "Deploy único, desenvolvimento isolado",
      "Compartilha tipos nativamente",
    ],
    cons: [
      "Requer tooling robusto (Nx/Turbo)",
      "Curva de aprendizado da ferramenta",
    ],
    tools: ["Nx", "Turborepo", "Pnpm"],
    fileStructure: [
      { name: "monorepo-root", type: "root", level: 0, children: [
        { name: "apps", type: "folder", level: 1, highlight: true, children: [
          { name: "client-web", type: "folder", level: 2 },
          { name: "admin-panel", type: "folder", level: 2 },
        ]},
        { name: "libs", type: "folder", level: 1, highlight: true, children: [
          { name: "shared-ui", type: "folder", level: 2 },
          { name: "cart-logic", type: "folder", level: 2 },
          { name: "auth-utils", type: "folder", level: 2 },
        ]},
        { name: "package.json", type: "file", level: 1 },
        { name: "nx.json", type: "file", level: 1 },
      ]}
    ],
  },
  {
    id: "mfe",
    title: "Microfrontends",
    subtitle: "Escala Extrema",
    teamSize: "50+ devs",
    icon: GitFork,
    color: "rose",
    pros: [
      "Deploy independente real",
      "Tecnologias agnósticas",
      "Times autônomos",
    ],
    cons: [
      "Complexidade de infra brutal",
      "Dependências duplicadas",
    ],
    tools: ["Webpack MF", "Vite Federation"],
    fileStructure: [
      { name: "GIT REPO: SHELL", type: "repo", level: 0, children: [
        { name: "src", type: "folder", level: 1 },
        { name: "webpack.config.js", type: "file", level: 1, highlight: true },
      ]},
      { name: "GIT REPO: SHOP", type: "repo", level: 0, children: [
        { name: "src", type: "folder", level: 1 },
        { name: "webpack.config.js", type: "file", level: 1, highlight: true },
      ]},
      { name: "GIT REPO: CHECKOUT", type: "repo", level: 0, children: [
        { name: "src", type: "folder", level: 1 },
        { name: "webpack.config.js", type: "file", level: 1, highlight: true },
      ]},
    ],
  },
];

// --- COMPONENTE FILE EXPLORER ---
function FileExplorer({ structure, color }: { structure: FileNode[], color: string }) {
  const renderNode = (node: FileNode, i: number) => {
    // Ícones baseados no tipo
    let Icon = FileCode2;
    if (node.type === "folder") Icon = Folder;
    if (node.type === "root") Icon = Laptop2;
    if (node.type === "repo") Icon = FolderGit2;
    if (node.name.includes("json")) Icon = FileJson;

    // Cores dinâmicas
    const isHighlighted = node.highlight;
    const textColor = isHighlighted ? `text-${color}-500` : "text-muted-foreground";
    const iconColor = isHighlighted ? `text-${color}-500` : (node.type === "folder" || node.type === "repo" ? "text-blue-400/80" : "text-zinc-500");

    return (
      <div key={i} className="font-mono text-sm leading-6">
        <div 
            className={cn(
                "flex items-center gap-2 hover:bg-white/5 rounded px-2 py-0.5 cursor-default transition-colors",
                node.type === "repo" && "mt-4 mb-1 border-b border-white/10 pb-1"
            )}
            style={{ paddingLeft: `${node.level * 16 + 8}px` }}
        >
          {/* Seta para pastas */}
          {(node.type === "folder" || node.type === "root" || node.type === "repo") && (
            <ChevronDown className="h-3 w-3 text-muted-foreground/50" />
          )}
          {/* Espaçamento para arquivos */}
          {node.type === "file" && <span className="w-3" />}
          
          <Icon className={cn("h-4 w-4", iconColor)} />
          
          <span className={cn(
              node.type === "repo" ? "font-bold text-foreground" : textColor,
              node.type === "root" && "font-bold"
          )}>
            {node.name}
          </span>
        </div>
        
        {/* Recursão para filhos */}
        {node.children && node.children.map((child, idx) => renderNode(child, idx))}
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-zinc-300 p-4 font-mono text-sm overflow-y-auto rounded-lg shadow-inner border border-white/5">
      <div className="flex items-center justify-between mb-4 px-2 pb-2 border-b border-white/10">
        <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Explorer</span>
        <div className="flex gap-1">
             <div className="w-2 h-2 rounded-full bg-red-500/50" />
             <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
             <div className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
      </div>
      <div className="flex flex-col">
        {structure.map((node, i) => renderNode(node, i))}
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---
export function AlternativesSection() {
  const [selected, setSelected] = useState<StrategyType>("modular");
  const current = strategies.find((s) => s.id === selected)!;

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 mb-4">
          <Scale className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs font-bold text-primary">
            REALITY CHECK
          </span>
        </div>
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          Você realmente precisa de Microfrontends?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          A complexidade da solução nunca deve exceder a complexidade do problema.
          Muitas vezes, um <strong>Monolito bem organizado</strong> é superior a
          uma arquitetura distribuída mal implementada.
        </p>
      </div>

      {/* SELETOR DE CENÁRIO */}
      <div className="mb-10 p-1 bg-muted/50 rounded-xl inline-flex w-full md:w-auto overflow-x-auto">
        {strategies.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelected(s.id)}
            className={cn(
              "flex-1 md:flex-none px-6 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap",
              selected === s.id
                ? "bg-background shadow-sm text-foreground ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <s.icon className="h-4 w-4" />
            {s.title}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* CARD PRINCIPAL (INFO) */}
        <div className="lg:col-span-3 space-y-6">
          <div className={cn(
              "rounded-2xl border bg-card p-8 transition-all duration-500 h-full",
              `border-${current.color}-500/20 shadow-lg shadow-${current.color}-500/5`
          )}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className={cn("text-2xl font-bold mb-1", `text-${current.color}-500`)}>
                  {current.title}
                </h3>
                <p className="text-muted-foreground font-medium">
                  {current.subtitle}
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-secondary rounded-full text-xs font-mono">
                <Users className="h-3 w-3" />
                Time: {current.teamSize}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Pros */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                  <HeartHandshake className="h-4 w-4 text-green-500" /> Vantagens
                </h4>
                <ul className="space-y-3">
                  {current.pros.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                  <AlertTriangle className="h-4 w-4 text-destructive" /> Desafios
                </h4>
                <ul className="space-y-3">
                  {current.cons.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-border flex flex-wrap gap-4 items-center">
                <span className="text-xs font-bold uppercase text-muted-foreground">Stack Sugerida:</span>
                {current.tools.map((t, i) => (
                    <span key={i} className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-mono border border-border">
                        {t}
                    </span>
                ))}
            </div>
          </div>
        </div>

        {/* VISUALIZAÇÃO GRÁFICA (FILE EXPLORER) */}
        <div className="lg:col-span-2 flex flex-col">
            <div className="flex-1 rounded-2xl border border-border bg-card/50 p-4 flex flex-col relative overflow-hidden min-h-[450px]">
                <div className="absolute top-4 left-4 text-xs font-mono text-muted-foreground uppercase z-10 flex items-center gap-2">
                    <Laptop2 className="h-3 w-3" />
                    Estrutura de Código
                </div>
                
                <div className="w-full flex-1 relative mt-8">
                     <FileExplorer structure={current.fileStructure} color={current.color} />
                </div>
                
                {/* Legenda Explicativa */}
                <div className="mt-4 text-center px-4 py-3 bg-muted/30 rounded-lg border border-border/50">
                    {selected === 'monolith' && (
                        <p className="text-xs text-muted-foreground">
                            Tudo vive na pasta <code>src/</code>. <br/>Risco: <strong>Spaghetti Code</strong> se não tiver disciplina.
                        </p>
                    )}
                    {selected === 'modular' && (
                        <p className="text-xs text-muted-foreground">
                            Separação lógica em <code>libs/</code> e <code>apps/</code>. <br/>
                            <span className="text-emerald-500 font-bold">Código isolado, Deploy unificado.</span>
                        </p>
                    )}
                    {selected === 'mfe' && (
                        <p className="text-xs text-muted-foreground">
                            Separação física (Repos diferentes). <br/>
                            Use apenas se os times precisarem de <strong>ciclos de vida totalmente independentes</strong>.
                        </p>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* CONCLUSÃO DA APRESENTAÇÃO */}
      <div className="mt-16 bg-gradient-to-r from-primary/10 via-background to-accent/10 rounded-3xl p-8 md:p-12 border border-primary/20 text-center">
        <Building2 className="h-12 w-12 text-primary mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-foreground mb-4">
          Conclusão: A Lei de Conway Reversa
        </h3>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
          Não desenhe sua arquitetura baseada no que o Google faz. 
          Desenhe baseada na <strong>comunicação do seu time</strong>.
          <br/><br/>
          Se você tem 5 desenvolvedores, MFE vai te matar. Se você tem 500, o Monolito vai te matar.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-4">
            <div className="px-5 py-3 rounded-lg bg-background border border-border shadow-sm flex items-center justify-center gap-2 text-sm font-medium">
                <Scissors className="h-4 w-4 text-muted-foreground" />
                Mantenha Simples (KISS)
            </div>
            <ArrowRight className="hidden md:block h-4 w-4 text-muted-foreground self-center" />
            <ArrowRight className="md:hidden h-4 w-4 text-muted-foreground self-center rotate-90" />
            <div className="px-5 py-3 rounded-lg bg-background border border-border shadow-sm flex items-center justify-center gap-2 text-sm font-medium">
                <Blocks className="h-4 w-4 text-emerald-500" />
                Modularize Primeiro
            </div>
            <ArrowRight className="hidden md:block h-4 w-4 text-muted-foreground self-center" />
            <ArrowRight className="md:hidden h-4 w-4 text-muted-foreground self-center rotate-90" />
            <div className="px-5 py-3 rounded-lg bg-background border border-border shadow-sm flex items-center justify-center gap-2 text-sm font-medium">
                <GitFork className="h-4 w-4 text-rose-500" />
                Distribua Só Se Necessário
            </div>
        </div>
      </div>
    </section>
  );
}