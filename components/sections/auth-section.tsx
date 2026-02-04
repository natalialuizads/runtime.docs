"use client";

import { DynamicDiagram } from "@/components/dynamic-diagram";
import { cn } from "@/lib/utils";
import {
  Box,
  CheckCircle2,
  Cloud,
  Key,
  Lock,
  Network,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";

type AuthPattern = "shell-orchestrated" | "mfe-orchestrated";

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
    backendAnalogy: "API Gateway com Sidecar de Auth",
    icon: Shield,
  },
  {
    id: "mfe-orchestrated",
    name: "Estratégia: Autônomo (MFE)",
    backendAnalogy: "Auth distribuída (Service-to-Service)",
    icon: Network,
  },
];

export function AuthSection() {
  const [selectedPattern, setSelectedPattern] =
    useState<AuthPattern>("shell-orchestrated");

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      {/* HEADER DIDÁTICO */}
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
          Em Microfrontends, a autenticação não é apenas sobre login, mas sobre
          <strong> como o token trafega</strong> entre domínios isolados sem
          criar gargalos.
        </p>
      </div>

      {/* ANALOGIA PARA BACKENDERS */}
      <div className="mb-12 grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6 border-l-4 border-l-primary">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
            <Server className="h-5 w-5 text-primary" />
            Mentalidade Backend
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Escolher entre esses padrões é o mesmo que decidir se o{" "}
            <strong>API Gateway</strong> resolve a auth e injeta o header
            `X-User-ID` ou se cada microserviço valida o JWT de forma
            independente.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 border-l-4 border-l-accent">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
            <Key className="h-5 w-5 text-accent" />O Desafio do Front
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Ao contrário do Backend, o "tráfego" aqui acontece no browser do
            usuário. O risco de <strong>XSS (Cross-Site Scripting)</strong> dita
            as regras do jogo.
          </p>
        </div>
      </div>

      {/* SELEÇÃO E DIAGRAMA */}
      <div className="mb-16 space-y-8">
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
                Analogia: {pattern.backendAnalogy}
              </span>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-inner">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-xl">
              <h4 className="text-xl font-bold text-foreground">
                {selectedPattern === "shell-orchestrated"
                  ? "Orquestração Centralizada"
                  : "Orquestração Distribuída"}
              </h4>
              <p className="mt-2 text-sm text-muted-foreground">
                {selectedPattern === "shell-orchestrated"
                  ? "O Shell atua como o 'Authority Server'. Ele faz o login, gerenta o Refresh Token e injeta o estado para os MFEs via Props."
                  : "O Shell é agnóstico. Um MFE específico (ex: mfe-auth) gerencia a sessão e emite eventos globais. Os outros MFEs apenas 'assinam' o canal."}
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
                ? "Recomendado para Monorepos"
                : "Recomendado para Equipes Independentes"}
            </div>
          </div>
          <DynamicDiagram
            title={
              selectedPattern === "shell-orchestrated"
                ? "Fluxo centralizado: Shell como Gatekeeper"
                : "Fluxo distribuído: MFE como Auth Owner"
            }
            nodes={
              selectedPattern === "shell-orchestrated"
                ? [
                    { id: "user", label: "Usuário", icon: User, x: 10, y: 50 },
                    {
                      id: "shell",
                      label: "App Shell\n(Gatekeeper)",
                      icon: ShieldCheck,
                      x: 35,
                      y: 50,
                      color: "border-primary",
                    },
                    {
                      id: "mfe1",
                      label: "Checkout MFE",
                      icon: Box,
                      x: 65,
                      y: 30,
                    },
                    {
                      id: "mfe2",
                      label: "Orders MFE",
                      icon: Box,
                      x: 65,
                      y: 70,
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
                      label: "App Shell\n(Bus)",
                      icon: Network,
                      x: 35,
                      y: 50,
                    },
                    {
                      id: "mfe_auth",
                      label: "Auth MFE\n(Owner)",
                      icon: Key,
                      x: 65,
                      y: 30,
                      color: "border-accent",
                    },
                    {
                      id: "mfe_biz",
                      label: "Business MFE",
                      icon: Box,
                      x: 65,
                      y: 70,
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
                    { from: "shell", to: "mfe1", label: "2. Pass Token" },
                    { from: "shell", to: "mfe2", label: "2. Pass Token" },
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
                      to: "mfe_auth",
                      animated: true,
                      label: "1. Login",
                    },
                    { from: "mfe_auth", to: "shell", label: "2. Notify Login" },
                    { from: "shell", to: "mfe_biz", label: "3. Share Event" },
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
                  Shell Orquestrador
                </th>
                <th className="p-4 font-mono text-[10px] uppercase tracking-wider text-accent border-l border-border">
                  MFE Orquestrando
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {[
                {
                  c: "Sincronização",
                  s: "Instantânea (Props)",
                  m: "Baseada em Eventos (Assíncrona)",
                },
                {
                  c: "Acoplamento",
                  s: "Alto (MFE depende do Shell)",
                  m: "Baixo (Agnóstico)",
                },
                {
                  c: "Performance",
                  s: "Excelente",
                  m: "Overhead de Mensageria",
                },
                {
                  c: "Refresh Token",
                  s: "Uma única chamada centralizada",
                  m: "Risco de chamadas duplicadas",
                },
                {
                  c: "Complexidade",
                  s: "Baixa (Ideal p/ times internos)",
                  m: "Alta (Ideal p/ times distribuídos)",
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
          {/* Card de Riscos */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-destructive font-bold uppercase text-xs tracking-widest">
              <XCircle className="h-4 w-4" /> Riscos Reais
            </div>
            <ul className="space-y-6">
              <li className="text-sm">
                <strong className="block text-foreground font-bold mb-1 italic">
                  Token Leakage via XSS
                </strong>
                Se o "MFE Vendas" for comprometido, ele pode roubar o token do
                contexto global.
                <span className="block mt-1 text-muted-foreground">
                  O perigo aumenta quando usamos LocalStorage para compartilhar
                  tokens.
                </span>
              </li>
              <li className="text-sm">
                <strong className="block text-foreground font-bold mb-1 italic">
                  Event Spoofing
                </strong>
                Um MFE malicioso pode emitir um evento `USER_LOGGED_IN` falso,
                enganando os outros MFEs para que mostrem dados sensíveis.
              </li>
            </ul>
          </div>

          {/* Card de Mitigação */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-green-600 font-bold uppercase text-xs tracking-widest">
              <CheckCircle2 className="h-4 w-4" /> Defesa em Profundidade
            </div>
            <ul className="space-y-6">
              <li className="text-sm">
                <strong className="block text-foreground font-bold mb-1 italic">
                  HttpOnly Cookies (The King)
                </strong>
                A melhor defesa contra o Front é tirar a posse do token do JS.
                Use cookies HttpOnly + Secure + SameSite.
                <span className="block mt-1 text-muted-foreground">
                  O JS não consegue ler o cookie, protegendo contra XSS.
                </span>
              </li>
              <li className="text-sm">
                <strong className="block text-foreground font-bold mb-1 italic">
                  CSP (Content Security Policy)
                </strong>
                Configure headers para permitir que o browser apenas faça
                requests para domínios de API conhecidos.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
