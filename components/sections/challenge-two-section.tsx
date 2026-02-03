"use client";

import { DebugChallenge } from "@/components/debug-challenge";
import { DynamicDiagram } from "@/components/dynamic-diagram";
import {
  AlertTriangle,
  Box,
  CheckCircle2,
  Layout,
  Paintbrush,
} from "lucide-react";

export function ChallengeTwoSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <div className="mb-2 font-mono text-sm text-destructive">
          CHECKPOINT FINAL
        </div>
        <h2 className="mb-4 text-3xl font-bold text-foreground">
          Desafio de Debug #2
        </h2>
        <p className="text-lg text-muted-foreground">
          Conflitos de Efeito Colateral - o equivalente a um serviço alterar o
          banco de outro sem permissão.
        </p>
      </div>

      <DynamicDiagram
        title="O Cenario do Bug"
        nodes={[
          {
            id: "ha",
            label: "MFE Header v2.3",
            icon: Layout,
            x: 20,
            y: 30,
            color: "border-destructive",
          },
          {
            id: "css",
            label: "Global CSS (.btn)",
            icon: Paintbrush,
            x: 50,
            y: 30,
            color: "border-destructive",
          },
          {
            id: "cart",
            label: "MFE Cart (Unchanged)",
            icon: Box,
            x: 80,
            y: 30,
          },
          {
            id: "bug",
            label: "Visual Regression",
            icon: AlertTriangle,
            x: 50,
            y: 70,
            color: "border-destructive",
          },
        ]}
        edges={[
          { from: "ha", to: "css", label: "Deploy" },
          { from: "css", to: "cart", animated: true, label: "Collision" },
          { from: "cart", to: "bug", animated: true },
        ]}
      />

      <div className="my-10">
        <DebugChallenge
          title="CSS Global Collision"
          scenario="O Time A deployou uma atualizacao no MFE Header que inclui CSS global. O Time B, sem fazer nenhuma mudanca, comecou a receber tickets de bug porque o botao de Checkout do carrinho mudou de aparencia."
          backendApproach={`# Backend: Cada servico tem seu proprio banco/schema
# Service A altera sua tabela: OK
# Service A altera tabela do Service B: ERRO de permissão

# Schema isolation:
CREATE SCHEMA service_a;
CREATE SCHEMA service_b;
GRANT ALL ON SCHEMA service_a TO service_a_user;
-- service_a_user NÃO consegue alterar service_b`}
          problem="No frontend, não existe 'schema isolation' por padrão. CSS global é como dar GRANT ALL em todas as tabelas para todos os serviços. Qualquer MFE pode (acidentalmente) quebrar qualquer outro MFE."
          hints={[
            "CSS Modules ou CSS-in-JS geram classes unicas por componente (scoping automatico)",
            "Shadow DOM cria um boundary de encapsulamento real (Web Components)",
            "BEM ou outras convencoes de nomenclatura podem funcionar como 'namespaces'",
            "PostCSS pode prefixar automaticamente todas as classes de um MFE",
            "Pense em como o Kubernetes usa namespaces para isolar recursos",
          ]}
          solution={`// SOLUCAO 1: CSS Modules (Scoping via Build)
// header.module.css
.btn { padding: 8px 16px; }
// Compila para: .Header_btn_x7ks2 { ... }

// SOLUCAO 2: Shadow DOM (Encapsulamento Real)
class MFEHeader extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    // CSS aqui NÃO vaza para fora
    shadow.innerHTML = \`
      <style>.btn { padding: 8px 16px; }</style>
      <button class="btn">Login</button>
    \`;
  }
}

// SOLUCAO 3: Namespace Convention (Runtime)
// Cada MFE prefixa suas classes
.mfe-header__btn { }
.mfe-cart__btn { }

// SOLUCAO 4: CSS Containment via PostCSS
// postcss.config.js no MFE Header
module.exports = {
  plugins: [
    require('postcss-prefix-selector')({
      prefix: '[data-mfe="header"]'
    })
  ]
}
// .btn -> [data-mfe="header"] .btn

// ANALOGIA BACKEND:
// É como colocar cada serviço em seu próprio namespace K8s
// com Network Policies que impedem comunicação não autorizada`}
        />
      </div>

      <div className="mt-12 rounded-lg border border-primary/30 bg-primary/10 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-primary">
          Conclusão: Frontend e Infraestrutura
        </h3>
        <p className="mb-4 text-sm text-foreground">
          Depois de entender esses conceitos, você percebe que:
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-1 h-4 w-4 text-primary shrink-0" />
            <span>
              O Browser é um{" "}
              <strong className="text-foreground">runtime hostil</strong> que
              você não controla
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-1 h-4 w-4 text-primary shrink-0" />
            <span>
              Frontend não escala horizontalmente -{" "}
              <strong className="text-foreground">
                otimização é obrigatória
              </strong>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-1 h-4 w-4 text-primary shrink-0" />
            <span>
              MFEs são{" "}
              <strong className="text-foreground">sistemas distribuídos</strong>{" "}
              sem o isolamento que você está acostumado
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-1 h-4 w-4 text-primary shrink-0" />
            <span>
              Arquitetura ruim no frontend ={" "}
              <strong className="text-foreground">morte por mil cortes</strong>{" "}
              na UX
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
