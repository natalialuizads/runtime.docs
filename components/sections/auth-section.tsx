"use client";

import { CodeBlock } from "@/components/code-block";
import { ComparisonTable } from "@/components/comparison-table";
import { DynamicDiagram } from "@/components/dynamic-diagram";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Box,
  Cloud,
  Key,
  Lock,
  Server,
  Shield,
  ShieldCheck,
  User,
  Zap,
} from "lucide-react";
import { useState } from "react";

type AuthPattern = "session" | "jwt" | "oauth" | "mfe";

interface AuthPatternInfo {
  id: AuthPattern;
  name: string;
  icon: React.ElementType;
  description: string;
  flow: string[];
}

const authPatterns: AuthPatternInfo[] = [
  {
    id: "session",
    name: "Session-Based",
    icon: Server,
    description:
      "Servidor mantém estado da sessão. Cookie identifica o usuário.",
    flow: [
      "Usuário faz login",
      "Servidor cria sessão no Redis/DB",
      "Cookie enviado ao browser",
      "Requisições incluem cookie automaticamente",
    ],
  },
  {
    id: "jwt",
    name: "JWT (Stateless)",
    icon: Key,
    description: "Token contém todas as informações. Servidor não mantém estado.",
    flow: [
      "Usuário faz login",
      "Servidor gera JWT assinado",
      "Token armazenado no cliente",
      "Requisições incluem token no header",
    ],
  },
  {
    id: "oauth",
    name: "OAuth 2.0 / OIDC",
    icon: Shield,
    description:
      "Delegação de autenticação para provedor externo (Google, GitHub).",
    flow: [
      "Redirect para provedor",
      "Usuário autoriza",
      "Callback com code",
      "Troca code por tokens",
    ],
  },
  {
    id: "mfe",
    name: "Auth em MFEs",
    icon: Box,
    description:
      "Como compartilhar estado de autenticação entre microfrontends?",
    flow: [
      "Shell gerencia auth",
      "Token propagado via props/context",
      "MFEs validam token",
      "Refresh centralizado no Shell",
    ],
  },
];

export function AuthSection() {
  const [selectedPattern, setSelectedPattern] = useState<AuthPattern>("session");
  const current = authPatterns.find((p) => p.id === selectedPattern)!;

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 mb-4">
          <Lock className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs text-primary">AUTENTICACAO</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground">
          Autenticação no Frontend: Do JWT ao MFE
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Você conhece autenticação no backend. Agora vamos ver como isso se
          traduz para o frontend - e os desafios específicos de MFEs.
        </p>
      </div>

      {/* Tradutor Backend -> Frontend */}
      <div className="mb-12 rounded-xl border border-border bg-card p-6">
        <h3 className="mb-6 font-mono text-lg font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Tradutor: Backend para Frontend Auth
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              backend: "Session Store (Redis)",
              frontend: "Cookie HttpOnly",
              explanation: "Sessão no servidor, identificador no cliente",
            },
            {
              backend: "JWT Secret",
              frontend: "Token Signature Validation",
              explanation: "Assinatura garante integridade do token",
            },
            {
              backend: "API Gateway Auth",
              frontend: "App Shell Auth Provider",
              explanation: "Ponto central que valida e propaga auth",
            },
            {
              backend: "RBAC/ABAC",
              frontend: "Route Guards + UI Conditionals",
              explanation: "Controle de acesso refletido na UI",
            },
            {
              backend: "Token Refresh Service",
              frontend: "Silent Refresh / Interceptor",
              explanation: "Renovação automática antes de expirar",
            },
            {
              backend: "Service-to-Service Auth",
              frontend: "MFE-to-MFE Token Propagation",
              explanation: "Como MFEs compartilham credenciais",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-secondary/30 p-4"
            >
              <div className="mb-2 flex items-center gap-2 flex-wrap">
                <span className="rounded bg-primary/20 px-2 py-0.5 font-mono text-xs text-primary">
                  {item.backend}
                </span>
                <span className="text-muted-foreground">=</span>
                <span className="rounded bg-accent/20 px-2 py-0.5 font-mono text-xs text-accent">
                  {item.frontend}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{item.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern Selector */}
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          Padrões de Autenticação
        </h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {authPatterns.map((pattern) => {
            const Icon = pattern.icon;
            return (
              <button
                key={pattern.id}
                onClick={() => setSelectedPattern(pattern.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border p-4 transition-all",
                  selectedPattern === pattern.id
                    ? "border-primary/50 bg-primary/10"
                    : "border-border bg-card hover:border-border/80"
                )}
              >
                <Icon
                  className={cn(
                    "h-6 w-6",
                    selectedPattern === pattern.id
                      ? "text-primary"
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

      {/* Selected Pattern */}
      <div className="mb-12 rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <current.icon className="h-6 w-6 text-primary" />
          <h4 className="text-xl font-bold text-foreground">{current.name}</h4>
        </div>
        <p className="mb-6 text-muted-foreground">{current.description}</p>

        <div className="rounded-lg bg-secondary/30 p-4">
          <h5 className="mb-3 font-mono text-sm font-semibold text-foreground">
            Fluxo
          </h5>
          <div className="flex flex-wrap items-center gap-2">
            {current.flow.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-full bg-background px-3 py-1.5">
                  <span className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-xs text-foreground">{step}</span>
                </div>
                {i < current.flow.length - 1 && (
                  <span className="text-muted-foreground">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* JWT Deep Dive */}
      <div className="mb-12">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          JWT no Frontend: Onde Armazenar?
        </h3>
        <p className="mb-6 text-muted-foreground">
          A eterna questão: localStorage, sessionStorage, cookie ou memory?
        </p>

        <ComparisonTable
          headers={["Storage", "XSS Vulnerável", "CSRF Vulnerável", "Persistência", "Recomendação"]}
          rows={[
            ["localStorage", "Sim", "Não", "Permanente", "Evite para tokens sensíveis"],
            ["sessionStorage", "Sim", "Não", "Tab apenas", "OK para apps simples"],
            ["Cookie HttpOnly", "Não", "Sim (mitigável)", "Configurável", "Melhor para auth"],
            ["Memory (variável)", "Não", "Não", "Nenhuma", "Mais seguro, pior UX"],
          ]}
        />

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <CodeBlock language="typescript" filename="secure-storage.ts">
            {`// Padrão recomendado: BFF com Cookie
// O token JWT fica apenas no servidor

// Frontend faz login
const login = async (credentials) => {
  await fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'include', // Cookie!
    body: JSON.stringify(credentials)
  });
};

// Requisições autenticadas
const fetchData = async () => {
  return fetch('/api/data', {
    credentials: 'include' // Cookie automático
  });
};`}
          </CodeBlock>

          <CodeBlock language="typescript" filename="token-refresh.ts">
            {`// Refresh silencioso antes de expirar
class AuthManager {
  private refreshTimer: number | null = null;
  
  scheduleRefresh(expiresIn: number) {
    // Refresh 1min antes de expirar
    const refreshIn = (expiresIn - 60) * 1000;
    
    this.refreshTimer = setTimeout(async () => {
      await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });
      // Re-schedule após refresh
    }, refreshIn);
  }
}`}
          </CodeBlock>
        </div>
      </div>

      {/* MFE Auth Architecture */}
      <div className="mb-12">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          Autenticação em Microfrontends
        </h3>
        <p className="mb-6 text-muted-foreground">
          O maior desafio: como compartilhar estado de auth entre MFEs isolados?
        </p>

        <DynamicDiagram
          title="Auth Flow em MFEs"
          nodes={[
            { id: "user", label: "Usuário", icon: User, x: 10, y: 50 },
            { id: "shell", label: "App Shell (Auth)", icon: Shield, x: 35, y: 50, color: "border-primary" },
            { id: "mfe1", label: "MFE Dashboard", icon: Box, x: 60, y: 25 },
            { id: "mfe2", label: "MFE Profile", icon: Box, x: 60, y: 75 },
            { id: "api", label: "Auth API", icon: Cloud, x: 85, y: 50, color: "border-accent" },
          ]}
          edges={[
            { from: "user", to: "shell", animated: true, label: "Login" },
            { from: "shell", to: "api", animated: true, label: "Validate" },
            { from: "shell", to: "mfe1", animated: true, label: "Token/Context" },
            { from: "shell", to: "mfe2", animated: true, label: "Token/Context" },
            { from: "mfe1", to: "api", label: "API + Token" },
            { from: "mfe2", to: "api", label: "API + Token" },
          ]}
        />
      </div>

      {/* Implementation Patterns */}
      <div className="mb-12">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          Padrões de Implementação MFE + Auth
        </h3>

        <div className="grid gap-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="mb-3 font-mono text-sm font-semibold text-primary flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Padrão 1: Auth Provider no Shell
            </h4>
            <CodeBlock language="typescript" filename="shell-auth-provider.tsx">
              {`// Shell expõe AuthProvider global
// shell/src/AuthProvider.tsx
export const AuthContext = createContext<AuthState>(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  // Shell gerencia login/logout/refresh
  const login = async (creds) => { /* ... */ };
  const logout = () => { /* ... */ };
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// MFE consome via Module Federation
// mfe-dashboard/src/App.tsx
import { useAuth } from 'shell/AuthContext';

function Dashboard() {
  const { user, token } = useAuth();
  // Use token para API calls
}`}
            </CodeBlock>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="mb-3 font-mono text-sm font-semibold text-accent flex items-center gap-2">
              <Key className="h-4 w-4" />
              Padrão 2: Event-Based Auth
            </h4>
            <CodeBlock language="typescript" filename="event-based-auth.ts">
              {`// Para MFEs mais isolados (iframes, Web Components)
// Shell publica eventos de auth
window.dispatchEvent(new CustomEvent('auth:login', {
  detail: { user, token }
}));

window.dispatchEvent(new CustomEvent('auth:logout'));

// MFE escuta eventos
window.addEventListener('auth:login', (e) => {
  const { user, token } = e.detail;
  setAuthState({ user, token });
});

window.addEventListener('auth:logout', () => {
  clearAuthState();
  redirectToLogin();
});`}
            </CodeBlock>
          </div>
        </div>
      </div>

      {/* Security Considerations */}
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-destructive flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Considerações de Segurança
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: "XSS Protection",
              description: "Tokens em localStorage são vulneráveis. Use HttpOnly cookies.",
              solution: "Content Security Policy + Cookie HttpOnly",
            },
            {
              title: "CSRF Protection",
              description: "Cookies são enviados automaticamente em requests cross-origin.",
              solution: "SameSite=Strict + CSRF Token",
            },
            {
              title: "Token Exposure",
              description: "Evite expor tokens em URLs ou logs.",
              solution: "Headers Authorization + Log sanitization",
            },
            {
              title: "MFE Isolation",
              description: "MFE malicioso pode roubar token se tiver acesso.",
              solution: "Validação de origem + Tokens escopados",
            },
          ].map((item, i) => (
            <div key={i} className="rounded-lg bg-background/50 p-4">
              <h4 className="mb-1 font-mono text-sm font-semibold text-destructive">
                {item.title}
              </h4>
              <p className="mb-2 text-sm text-foreground/70">{item.description}</p>
              <p className="text-xs text-accent">Solução: {item.solution}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
