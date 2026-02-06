"use client";

import { DynamicDiagram } from "@/components/dynamic-diagram";
import { cn } from "@/lib/utils";
import {
  Box,
  CheckCircle2,
  Cloud,
  Fingerprint,
  Key,
  Lock,
  Network,
  Server,
  ShieldAlert,
  ShieldCheck,
  User,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";

type AuthPattern = "shell-orchestrated" | "self-contained";

interface AuthPatternInfo {
  id: AuthPattern;
  name: string;
  backendAnalogy: string;
  icon: React.ElementType;
}

const authPatterns: AuthPatternInfo[] = [
  {
    id: "shell-orchestrated",
    name: "Estratégia: Shell Gateway",
    backendAnalogy: "API Gateway centralizado",
    icon: ShieldCheck,
  },
  {
    id: "self-contained",
    name: "Estratégia: Zero Trust (Self-Contained)",
    backendAnalogy: "Microserviço com Auth SDK embutido",
    icon: Fingerprint,
  },
];

export function AuthSection() {
  const [selectedPattern, setSelectedPattern] =
    useState<AuthPattern>("shell-orchestrated");

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 mb-4">
          <Lock className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs text-primary">
            GOVERNANÇA DE ACESSO
          </span>
        </div>
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          Quem manda no Token?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          Em Microfrontends, a autenticação define o nível de acoplamento. 
          O MFE deve confiar no Shell (Gateway) ou deve ser paranoico e gerenciar sua própria segurança?
        </p>
      </div>

      <div className="mb-12 grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6 border-l-4 border-l-primary">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
            <Server className="h-5 w-5 text-primary" />
            Mentalidade Backend
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            É a diferença entre ter um <strong>API Gateway</strong> que valida o token e repassa o request limpo, 
            versus cada Microserviço ter a biblioteca do OIDC instalada e validar a assinatura do JWT individualmente.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 border-l-4 border-l-accent">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
            <Key className="h-5 w-5 text-accent" />O Dilema da Autonomia
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Se o MFE cuida da própria Auth, você pode rodá-lo em `localhost:3000` sem precisar subir o sistema inteiro.
            Porém, o usuário pode ter que logar 2 vezes se os cookies não forem compartilhados.
          </p>
        </div>
      </div>

      <div className="mb-16 space-y-8">
        {/* BOTÕES DE SELEÇÃO */}
        <div className="flex flex-wrap gap-3">
          {authPatterns.map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => setSelectedPattern(pattern.id)}
              className={cn(
                "flex flex-col items-start gap-1 p-4 rounded-xl border transition-all text-left min-w-[200px]",
                selectedPattern === pattern.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-md"
                  : "border-border bg-card hover:bg-secondary/50 text-muted-foreground",
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <pattern.icon
                  className={cn(
                    "h-4 w-4",
                    selectedPattern === pattern.id ? "text-primary" : "",
                  )}
                />
                <span className="font-bold text-sm text-foreground">
                  {pattern.name}
                </span>
              </div>
              <span className="text-[10px] font-mono opacity-70 uppercase">
                {pattern.backendAnalogy}
              </span>
            </button>
          ))}
        </div>

        {/* DIAGRAMA E EXPLICAÇÃO */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-inner">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-xl">
              <h4 className="text-xl font-bold text-foreground">
                {selectedPattern === "shell-orchestrated"
                  ? "Orquestração Centralizada (Gateway)"
                  : "Autonomia Total (Zero Trust)"}
              </h4>
              <p className="mt-2 text-sm text-muted-foreground">
                {selectedPattern === "shell-orchestrated"
                  ? "O Shell atua como o 'Gatekeeper'. Ele faz o login único (SSO) e injeta o token nos MFEs via Props. Os MFEs são 'passivos' quanto à segurança."
                  : "Cada MFE possui seu próprio SDK de Auth. Ao carregar, o MFE verifica se tem sessão. Se não, ele mesmo redireciona para o Identity Provider. O Shell é apenas um container visual."}
              </p>
            </div>
            <div
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold border",
                selectedPattern === "shell-orchestrated"
                  ? "border-primary/20 bg-primary/5 text-primary"
                  : "border-accent/20 bg-accent/5 text-accent",
              )}
            >
              {selectedPattern === "shell-orchestrated"
                ? "Recomendado para User Experience (UX)"
                : "Recomendado para DX e Isolamento"}
            </div>
          </div>
          <DynamicDiagram
            title={
              selectedPattern === "shell-orchestrated"
                ? "Fluxo centralizado: Shell gerencia Sessão"
                : "Fluxo descentralizado: MFE gerencia Sessão"
            }
            nodes={
              selectedPattern === "shell-orchestrated"
                ? [
                    { id: "user", label: "Usuário", icon: User, x: 10, y: 50 },
                    {
                      id: "shell",
                      label: "App Shell\n(Auth Owner)",
                      icon: ShieldCheck,
                      x: 35,
                      y: 50,
                      color: "border-primary",
                    },
                    {
                      id: "mfe1",
                      label: "Checkout MFE\n(Stateless)",
                      icon: Box,
                      x: 65,
                      y: 30,
                    },
                    {
                      id: "api",
                      label: "Backend API",
                      icon: Cloud,
                      x: 90,
                      y: 50,
                      color: "border-green-500",
                    },
                  ]
                : [
                    { id: "user", label: "Usuário", icon: User, x: 10, y: 50 },
                    {
                      id: "shell",
                      label: "App Shell\n(Dumb Host)",
                      icon: Box,
                      x: 35,
                      y: 50,
                      color: "border-border dashed",
                    },
                    {
                      id: "mfe_biz",
                      label: "Checkout MFE\n(Auth Owner)",
                      icon: Fingerprint,
                      x: 60,
                      y: 50,
                      color: "border-accent",
                    },
                    {
                      id: "idp",
                      label: "Identity Provider\n(Auth0/Okta)",
                      icon: Key,
                      x: 60,
                      y: 10,
                      color: "border-orange-500",
                    },
                    {
                      id: "api",
                      label: "Checkout API",
                      icon: Cloud,
                      x: 90,
                      y: 50,
                      color: "border-green-500",
                    },
                  ]
            }
            edges={
              selectedPattern === "shell-orchestrated"
                ? [
                    {
                      from: "user",
                      to: "shell",
                      animated: true,
                      label: "1. Login",
                    },
                    { from: "shell", to: "mfe1", label: "2. Pass Token (Props)" },
                    {
                      from: "mfe1",
                      to: "api",
                      animated: true,
                      label: "3. API Request",
                    },
                  ]
                : [
                    {
                      from: "user",
                      to: "mfe_biz",
                      animated: true,
                      label: "1. Access",
                    },
                    {
                      from: "mfe_biz",
                      to: "idp",
                      label: "2. Redirect/Verify",
                      animated: true,
                      color: "stroke-orange-500",
                    },
                    {
                      from: "idp",
                      to: "mfe_biz",
                      label: "3. Token",
                      color: "stroke-orange-500",
                    },
                    {
                      from: "mfe_biz",
                      to: "api",
                      animated: true,
                      label: "4. API Request",
                    },
                  ]
            }
          />
        </div>
      </div>

      {/* MATRIZ DE TRADE-OFFS */}
      <div className="mb-20">
        <h3 className="mb-8 text-2xl font-bold text-foreground flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          Matriz de Decisão Arquitetural
        </h3>
        <div className="rounded-xl border border-border overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="p-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Critério
                </th>
                <th className="p-4 font-mono text-[10px] uppercase tracking-wider text-primary border-l border-border">
                  Shell Gateway (Centralizado)
                </th>
                <th className="p-4 font-mono text-[10px] uppercase tracking-wider text-accent border-l border-border">
                  Self-Contained (Distribuído)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {[
                {
                  c: "Desenvolvimento (DX)",
                  s: "Ruim: Precisa do Shell rodando para logar",
                  m: "Excelente: MFE roda isolado (standalone)",
                },
                {
                  c: "User Experience (UX)",
                  s: "Fluida: Login único para tudo",
                  m: "Risco: Pode exigir múltiplos logins se mal configurado",
                },
                {
                  c: "Acoplamento",
                  s: "Alto: MFE 'quebra' sem as props do Shell",
                  m: "Zero: MFE é independente do Host",
                },
                {
                  c: "Tamanho do Bundle",
                  s: "Menor: Lógica de auth carregada 1 vez",
                  m: "Maior: Cada MFE traz seu próprio SDK de auth",
                },
                {
                  c: "Complexidade",
                  s: "Baixa (Ideal para times coesos)",
                  m: "Alta (Ideal para times totalmente isolados)",
                },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-bold text-xs">{row.c}</td>
                  <td className="p-4 text-xs text-muted-foreground border-l border-border">
                    {row.s}
                  </td>
                  <td className="p-4 text-xs text-muted-foreground border-l border-border">
                    {row.m}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEGURANÇA (FIXO) */}
      <div className="rounded-2xl border border-border bg-secondary/10 p-10">
        <h3 className="mb-8 text-2xl font-bold text-foreground flex items-center gap-2">
          <ShieldAlert className="h-7 w-7 text-destructive" />
          Vulnerabilidades e Defesa
        </h3>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-destructive font-bold uppercase text-xs tracking-widest">
              <XCircle className="h-4 w-4" /> Riscos
            </div>
            <ul className="space-y-6">
              <li className="text-sm">
                <strong className="block text-foreground font-bold mb-1 italic">
                  Token Storage Hell
                </strong>
                No modelo Self-Contained, onde guardar o token? Se usar 
                <code>localStorage</code>, qualquer script malicioso na página pode ler todos os tokens de todos os MFEs.
              </li>
              <li className="text-sm">
                <strong className="block text-foreground font-bold mb-1 italic">
                  Refresh Token Race Condition
                </strong>
                Se 3 MFEs tentarem renovar o token ao mesmo tempo, você pode invalidar a sessão do usuário por concorrência.
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-green-600 font-bold uppercase text-xs tracking-widest">
              <CheckCircle2 className="h-4 w-4" /> Soluções
            </div>
            <ul className="space-y-6">
              <li className="text-sm">
                <strong className="block text-foreground font-bold mb-1 italic">
                  Cookies HttpOnly Compartilhados
                </strong>
                Mesmo no modelo autônomo, o ideal é que o IDP sete um Cookie HttpOnly no domínio raiz. 
                Assim, os MFEs leem o cookie implicitamente sem acesso via JS.
              </li>
              <li className="text-sm">
                <strong className="block text-foreground font-bold mb-1 italic">
                  BFF (Backend for Frontend)
                </strong>
                Mova a complexidade de Auth para um BFF leve em Node/Go. O Front vira apenas "View" e não toca em tokens.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}