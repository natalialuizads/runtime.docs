"use client";

import { CodeBlock } from "@/components/code-block";
import { ComparisonTable } from "@/components/comparison-table";
import { DynamicDiagram } from "@/components/dynamic-diagram";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowLeftRight,
  Box,
  Boxes,
  MessageSquare,
  Radio,
  Share2,
  Zap,
} from "lucide-react";
import { useState } from "react";

type CommPattern = "events" | "props" | "state" | "url" | "broadcast";

interface CommPatternInfo {
  id: CommPattern;
  name: string;
  icon: React.ElementType;
  coupling: "baixo" | "médio" | "alto";
  complexity: "baixa" | "média" | "alta";
  description: string;
  useCase: string;
}

const commPatterns: CommPatternInfo[] = [
  {
    id: "events",
    name: "Custom Events",
    icon: Radio,
    coupling: "baixo",
    complexity: "baixa",
    description:
      "Eventos disparados no window/document. MFEs publicam e escutam eventos nomeados.",
    useCase: "Notificações, updates de estado global, ações cross-MFE",
  },
  {
    id: "props",
    name: "Props/Attributes",
    icon: ArrowLeftRight,
    coupling: "médio",
    complexity: "baixa",
    description:
      "Shell passa dados como props para MFEs. Comunicação unidirecional.",
    useCase: "Configuração inicial, dados do usuário, feature flags",
  },
  {
    id: "state",
    name: "Shared State",
    icon: Share2,
    coupling: "alto",
    complexity: "média",
    description:
      "Store global compartilhada (Redux, Zustand). MFEs leem e escrevem.",
    useCase: "Carrinho de compras, dados de sessão, preferências",
  },
  {
    id: "url",
    name: "URL/Router",
    icon: Boxes,
    coupling: "baixo",
    complexity: "baixa",
    description:
      "Comunicação via query params e rotas. Shell gerencia navegação.",
    useCase: "Deep linking, navegação entre MFEs, filtros compartilhados",
  },
  {
    id: "broadcast",
    name: "BroadcastChannel",
    icon: MessageSquare,
    coupling: "baixo",
    complexity: "média",
    description:
      "API nativa para comunicação entre tabs/iframes do mesmo origem.",
    useCase: "Sync entre tabs, logout global, real-time updates",
  },
];

export function MFECommunicationSection() {
  const [selectedPattern, setSelectedPattern] = useState<CommPattern>("events");
  const current = commPatterns.find((p) => p.id === selectedPattern)!;

  const getCouplingColor = (coupling: string) => {
    switch (coupling) {
      case "baixo":
        return "text-accent";
      case "médio":
        return "text-chart-4";
      case "alto":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 mb-4">
          <MessageSquare className="h-4 w-4 text-accent" />
          <span className="font-mono text-xs text-accent">COMUNICACAO MFE</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground">
          Comunicação entre Microfrontends
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Como MFEs isolados conversam entre si? Os mesmos padrões de
          microsserviços aplicados ao frontend: eventos, contratos e estado mínimo.
        </p>
      </div>

      {/* Princípios */}
      <div className="mb-12 rounded-xl border border-border bg-card p-6">
        <h3 className="mb-6 font-mono text-lg font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent" />
          Princípios de Comunicação
        </h3>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <h4 className="mb-2 font-mono text-sm font-semibold text-primary">
              1. Baixo Acoplamento
            </h4>
            <p className="text-sm text-muted-foreground">
              MFEs não devem conhecer a implementação uns dos outros. Comunique
              via contratos (eventos nomeados, interfaces).
            </p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <h4 className="mb-2 font-mono text-sm font-semibold text-accent">
              2. Estado Mínimo Compartilhado
            </h4>
            <p className="text-sm text-muted-foreground">
              Compartilhe apenas o essencial: user info, auth token, tema.
              Estado de negócio deve ficar no MFE dono.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <h4 className="mb-2 font-mono text-sm font-semibold text-chart-4">
              3. Falha Graceful
            </h4>
            <p className="text-sm text-muted-foreground">
              Se MFE A não responde, MFE B deve continuar funcionando. Timeouts
              e fallbacks são obrigatórios.
            </p>
          </div>
        </div>
      </div>

      {/* Pattern Selector */}
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          Padrões de Comunicação
        </h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {commPatterns.map((pattern) => {
            const Icon = pattern.icon;
            return (
              <button
                key={pattern.id}
                onClick={() => setSelectedPattern(pattern.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border p-4 transition-all",
                  selectedPattern === pattern.id
                    ? "border-accent/50 bg-accent/10"
                    : "border-border bg-card hover:border-border/80"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    selectedPattern === pattern.id
                      ? "text-accent"
                      : "text-muted-foreground"
                  )}
                />
                <span className="text-center font-mono text-[10px] leading-tight">
                  {pattern.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Pattern Detail */}
      <div className="mb-12 rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <current.icon className="h-6 w-6 text-accent" />
            <h4 className="text-xl font-bold text-foreground">{current.name}</h4>
          </div>
          <div className="flex gap-4 text-xs">
            <span>
              Acoplamento:{" "}
              <span className={cn("font-bold", getCouplingColor(current.coupling))}>
                {current.coupling}
              </span>
            </span>
            <span>
              Complexidade:{" "}
              <span className="font-bold text-muted-foreground">
                {current.complexity}
              </span>
            </span>
          </div>
        </div>
        <p className="mb-4 text-muted-foreground">{current.description}</p>
        <p className="text-sm">
          <strong>Caso de uso:</strong> {current.useCase}
        </p>
      </div>

      {/* Code Examples - Show selected pattern */}
      <div className="mb-12">
        <h3 className="mb-6 text-xl font-bold text-foreground">
          Implementação Prática
        </h3>

        <div className="rounded-xl border border-border bg-card p-6">
          {selectedPattern === "events" && (
            <>
              <h4 className="mb-4 font-mono text-sm font-semibold text-accent flex items-center gap-2">
                <Radio className="h-4 w-4" />
                Event Bus (Pub/Sub Pattern)
              </h4>
              <p className="mb-4 text-sm text-muted-foreground">
                O padrao mais desacoplado. MFEs publicam e escutam eventos sem
                conhecer uns aos outros.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <CodeBlock language="typescript" filename="event-bus.ts">
                  {`// Implementação simples de Event Bus
type EventHandler = (data: any) => void;

class EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();

  subscribe(event: string, handler: EventHandler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
    
    return () => this.handlers.get(event)?.delete(handler);
  }

  publish(event: string, data?: any) {
    this.handlers.get(event)?.forEach(handler => {
      try {
        handler(data);
      } catch (e) {
        console.error(\`Event handler error: \${event}\`, e);
      }
    });
  }
}

export const eventBus = new EventBus();`}
                </CodeBlock>

                <CodeBlock language="typescript" filename="usage-example.ts">
                  {`// MFE Cart: Publica quando item é adicionado
import { eventBus } from '@shell/event-bus';

function addToCart(product: Product) {
  cart.push(product);
  
  eventBus.publish('cart:item-added', {
    productId: product.id,
    quantity: 1,
    timestamp: Date.now()
  });
}

// MFE Header: Escuta para atualizar badge
useEffect(() => {
  const unsubscribe = eventBus.subscribe(
    'cart:item-added', 
    (data) => setCartCount(prev => prev + data.quantity)
  );
  return unsubscribe;
}, []);`}
                </CodeBlock>
              </div>
            </>
          )}

          {selectedPattern === "props" && (
            <>
              <h4 className="mb-4 font-mono text-sm font-semibold text-primary flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4" />
                Props/Attributes (Unidirecional)
              </h4>
              <p className="mb-4 text-sm text-muted-foreground">
                Shell passa dados como props para MFEs filhos. Comunicacao simples e
                previsivel, porem unidirecional.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <CodeBlock language="typescript" filename="shell-app.tsx">
                  {`// Shell: Passa configuração para MFEs
function AppShell() {
  const user = useAuth();
  const flags = useFeatureFlags();
  
  return (
    <div>
      <MFEHeader 
        user={user}
        featureFlags={flags}
        onLogout={handleLogout}
      />
      
      <MFEContent 
        locale={user?.locale || 'pt-BR'}
        theme={theme}
      />
    </div>
  );
}`}
                </CodeBlock>

                <CodeBlock language="typescript" filename="mfe-header.tsx">
                  {`// MFE Header: Recebe props do Shell
interface HeaderProps {
  user: User | null;
  featureFlags: Record<string, boolean>;
  onLogout: () => void;
}

function MFEHeader({ user, featureFlags, onLogout }: HeaderProps) {
  return (
    <header>
      {user && <Avatar user={user} />}
      {featureFlags.newNav && <NewNavigation />}
      <button onClick={onLogout}>Sair</button>
    </header>
  );
}

// Backend equivalente: Injeção de dependência`}
                </CodeBlock>
              </div>
            </>
          )}

          {selectedPattern === "state" && (
            <>
              <h4 className="mb-4 font-mono text-sm font-semibold text-chart-4 flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Shared State (Com Cautela)
              </h4>
              <p className="mb-4 text-sm text-muted-foreground">
                Use apenas para dados realmente globais. Cada MFE deve ter seu
                proprio estado de negocio.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <CodeBlock language="typescript" filename="shared-store.ts">
                  {`// Shell expõe store mínima
import { create } from 'zustand';

interface SharedState {
  // Apenas dados REALMENTE globais
  user: User | null;
  theme: 'light' | 'dark';
  locale: string;
  featureFlags: Record<string, boolean>;
  
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useSharedStore = create<SharedState>((set) => ({
  user: null,
  theme: 'light',
  locale: 'pt-BR',
  featureFlags: {},
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
}));`}
                </CodeBlock>

                <CodeBlock language="typescript" filename="mfe-consumption.tsx">
                  {`// MFE consome via Module Federation
import { useSharedStore } from 'shell/shared-store';

function ProfilePage() {
  // Lê estado global
  const user = useSharedStore((s) => s.user);
  const theme = useSharedStore((s) => s.theme);
  
  // Estado LOCAL do MFE
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  
  // NÃO coloque formData no shared store!
  
  if (!user) return <Redirect to="/login" />;
  
  return <ProfileForm user={user} theme={theme} />;
}`}
                </CodeBlock>
              </div>
            </>
          )}

          {selectedPattern === "url" && (
            <>
              <h4 className="mb-4 font-mono text-sm font-semibold text-accent flex items-center gap-2">
                <Boxes className="h-4 w-4" />
                URL/Router (Deep Linking)
              </h4>
              <p className="mb-4 text-sm text-muted-foreground">
                Comunicacao via query params e rotas. O Shell gerencia a navegacao
                e MFEs leem/escrevem na URL.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <CodeBlock language="typescript" filename="mfe-filters.tsx">
                  {`// MFE Catálogo: Filtros via URL
import { useSearchParams } from 'react-router-dom';

function ProductFilters() {
  const [params, setParams] = useSearchParams();
  
  const category = params.get('category');
  const minPrice = params.get('minPrice');
  
  const handleFilter = (key: string, value: string) => {
    setParams(prev => {
      prev.set(key, value);
      return prev;
    });
  };
  
  // URL: /products?category=eletronicos&minPrice=100
  return <Filters onChange={handleFilter} />;
}`}
                </CodeBlock>

                <CodeBlock language="typescript" filename="mfe-sidebar.tsx">
                  {`// MFE Sidebar: Lê filtros da URL
function Sidebar() {
  const [params] = useSearchParams();
  
  // Reage a mudanças na URL
  const activeCategory = params.get('category');
  
  return (
    <nav>
      {categories.map(cat => (
        <Link 
          key={cat.id}
          to={\`?category=\${cat.id}\`}
          className={activeCategory === cat.id ? 'active' : ''}
        >
          {cat.name}
        </Link>
      ))}
    </nav>
  );
}

// URL é a "single source of truth"`}
                </CodeBlock>
              </div>
            </>
          )}

          {selectedPattern === "broadcast" && (
            <>
              <h4 className="mb-4 font-mono text-sm font-semibold text-chart-4 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                BroadcastChannel API (Cross-Tab)
              </h4>
              <p className="mb-4 text-sm text-muted-foreground">
                API nativa do browser para comunicacao entre tabs/windows da mesma
                origem. Perfeito para logout global.
              </p>
              <CodeBlock language="typescript" filename="broadcast-auth.ts">
                {`// Sync de autenticação entre tabs
const authChannel = new BroadcastChannel('auth');

// Tab 1: Usuário faz logout
function logout() {
  clearAuthState();
  authChannel.postMessage({ type: 'LOGOUT' });
}

// Tab 2, 3, 4: Recebem notificação
authChannel.onmessage = (event) => {
  if (event.data.type === 'LOGOUT') {
    clearAuthState();
    redirectToLogin();
  }
  
  if (event.data.type === 'TOKEN_REFRESH') {
    updateToken(event.data.token);
  }
};

// Lembre-se de fechar ao desmontar
useEffect(() => {
  return () => authChannel.close();
}, []);`}
              </CodeBlock>
            </>
          )}
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="mb-12">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          Arquitetura de Comunicação
        </h3>
        <DynamicDiagram
          title="MFE Communication Patterns"
          nodes={[
            { id: "shell", label: "App Shell", icon: Box, x: 50, y: 15, color: "border-primary" },
            { id: "bus", label: "Event Bus", icon: Radio, x: 50, y: 40, color: "border-accent" },
            { id: "mfe1", label: "MFE Cart", icon: Box, x: 20, y: 65 },
            { id: "mfe2", label: "MFE Header", icon: Box, x: 50, y: 65 },
            { id: "mfe3", label: "MFE Product", icon: Box, x: 80, y: 65 },
            { id: "store", label: "Shared State", icon: Share2, x: 50, y: 90, color: "border-chart-4" },
          ]}
          edges={[
            { from: "shell", to: "bus", label: "Gerencia" },
            { from: "mfe1", to: "bus", animated: true, label: "pub/sub" },
            { from: "mfe2", to: "bus", animated: true, label: "pub/sub" },
            { from: "mfe3", to: "bus", animated: true, label: "pub/sub" },
            { from: "shell", to: "store", label: "Provê" },
            { from: "mfe1", to: "store", label: "read" },
            { from: "mfe2", to: "store", label: "read" },
          ]}
        />
      </div>

      {/* Comparison Table */}
      <div className="mb-12">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          Matriz de Decisão
        </h3>
        <ComparisonTable
          headers={[
            "Padrão",
            "Acoplamento",
            "Complexidade",
            "Performance",
            "Melhor Para",
          ]}
          rows={[
            ["Custom Events", "Baixo", "Baixa", "Excelente", "Notificações, updates"],
            ["Props/Attributes", "Médio", "Baixa", "Excelente", "Config inicial"],
            ["Shared State", "Alto", "Média", "Bom", "User, theme, auth"],
            ["URL/Router", "Baixo", "Baixa", "Excelente", "Navegação, deep links"],
            ["BroadcastChannel", "Baixo", "Média", "Bom", "Cross-tab sync"],
          ]}
        />
      </div>

      {/* Anti-patterns */}
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-destructive flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Anti-Patterns de Comunicação
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: "Direct DOM Manipulation",
              description: "MFE A manipula DOM do MFE B diretamente.",
              fix: "Use eventos ou callbacks via props",
            },
            {
              title: "Shared Mutable State",
              description: "Múltiplos MFEs escrevendo no mesmo objeto sem coordenação.",
              fix: "Imutabilidade + actions controladas",
            },
            {
              title: "Callback Hell",
              description: "MFE A chama MFE B que chama MFE C que chama MFE A...",
              fix: "Event Bus com fluxo unidirecional",
            },
            {
              title: "Over-Communication",
              description: "MFEs conversam demais, criando dependências ocultas.",
              fix: "Revise boundaries - talvez deva ser 1 MFE",
            },
          ].map((pattern, i) => (
            <div key={i} className="rounded-lg bg-background/50 p-4">
              <h4 className="mb-1 font-mono text-sm font-semibold text-destructive">
                {pattern.title}
              </h4>
              <p className="mb-2 text-sm text-foreground/70">{pattern.description}</p>
              <p className="text-xs text-accent">Solução: {pattern.fix}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
