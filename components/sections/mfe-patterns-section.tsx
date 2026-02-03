"use client"

import {
  AppWindow,
  CheckCircle2,
  Columns,
  Layers,
  Monitor,
  Network,
  Rows,
  Star,
  XCircle,
  Zap
} from "lucide-react"

export function MFEPatternsSection() {
  return (
  <section className="mx-auto max-w-4xl px-4 py-16">
    <div className="mb-12">
    <div className="mb-2 font-mono text-sm text-primary uppercase tracking-wider">Mapeamento de Estratégias</div>
    <h2 className="text-4xl font-bold text-foreground">Divisão Vertical vs Horizontal</h2>
    <p className="mt-4 text-xl text-muted-foreground leading-relaxed">
      Essa é uma distinção fundamental. Entender onde dividir o bolo define qual estratégia técnica você deve escolher.
    </p>
    </div>

    {/* 1. O Conceito Rápido */}
    <div className="grid gap-8 mb-20">
    <div className="rounded-2xl border border-border bg-card/50 p-8">
      <h3 className="mb-6 text-2xl font-bold text-foreground flex items-center gap-3">
      <Zap className="h-6 w-6 text-primary" />
      1. O Conceito Rápido
      </h3>
      <div className="grid gap-8 md:grid-cols-2">
      <div>
        <h4 className="flex items-center gap-2 font-bold text-primary mb-3">
        <Columns className="h-5 w-5" />
        Divisão Vertical (Rota/Jornada)
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
        O usuário carrega uma aplicação por vez. O MFE ocupa a tela inteira (exceto talvez o Shell).
        </p>
        <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <div className="h-1 w-1 rounded-full bg-primary" />
          FOCO: Roteamento e transição de páginas
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground italic">
          <Star className="h-3 w-3 text-yellow-500" /> CASO SPOTIFY: "Sua Biblioteca" vs "Início"
        </div>
        </div>
      </div>
      <div>
        <h4 className="flex items-center gap-2 font-bold text-accent mb-3">
        <Rows className="h-5 w-5" />
        Divisão Horizontal (Fragmento/Widget)
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
        O usuário vê vários MFEs simultaneamente na mesma tela. Composição granular.
        </p>
        <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <div className="h-1.5 w-1.5 rounded-full bg-accent" />
          FOCO: Composição e "Stitching" (Costura)
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground italic">
          <Star className="h-3 w-3 text-yellow-500" /> CASO SPOTIFY: Barra de Reprodução + Barra Lateral de Amigos
        </div>
        </div>
      </div>
      </div>
    </div>
    </div>

    {/* 2. Onde aplicar cada divisão? Matriz */}
    <div className="mb-20">
    <h3 className="mb-8 text-2xl font-bold text-foreground flex items-center gap-3">
      <Layers className="h-6 w-6 text-primary" />
      2. Onde aplicar cada divisão?
    </h3>
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-muted/50 border-b border-border">
        <th className="p-4 font-mono text-xs uppercase tracking-wider">Estratégia</th>
        <th className="p-4 font-mono text-xs uppercase tracking-wider text-center">Divisão Vertical</th>
        <th className="p-4 font-mono text-xs uppercase tracking-wider text-center">Divisão Horizontal</th>
        <th className="p-4 font-mono text-xs uppercase tracking-wider">Veredicto</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        <tr>
        <td className="p-4 font-bold text-sm">Module Federation</td>
        <td className="p-4 text-center"><Star className="inline h-4 w-4 text-yellow-500 fill-yellow-500" /> Excelente</td>
        <td className="p-4 text-center"><Star className="inline h-4 w-4 text-yellow-500 fill-yellow-500" /> Excelente</td>
        <td className="p-4 text-xs text-muted-foreground">O único que faz ambos com alta performance (compartilhando dependências).</td>
        </tr>
        <tr>
        <td className="p-4 font-bold text-sm">Composição no Servidor</td>
        <td className="p-4 text-center text-yellow-500 text-sm">🟡 Bom (via Link)</td>
        <td className="p-4 text-center"><Star className="inline h-4 w-4 text-yellow-500 fill-yellow-500" /> Excelente</td>
        <td className="p-4 text-xs text-muted-foreground">Rei da Divisão Horizontal. Monta Cabeçalho+Rodapé+Corpo no servidor.</td>
        </tr>
        <tr>
        <td className="p-4 font-bold text-sm">Composição na Borda</td>
        <td className="p-4 text-center text-yellow-500 text-sm">🟡 Bom (via Rota)</td>
        <td className="p-4 text-center"><Star className="inline h-4 w-4 text-yellow-500 fill-yellow-500" /> Excelente</td>
        <td className="p-4 text-xs text-muted-foreground">Incrível para Divisão Horizontal. Monta a página na CDN.</td>
        </tr>
        <tr>
        <td className="p-4 font-bold text-sm">Web Components</td>
        <td className="p-4 text-center text-yellow-500 text-sm">🟡 Possível</td>
        <td className="p-4 text-center text-blue-500 text-sm">⭐ Muito Bom</td>
        <td className="p-4 text-xs text-muted-foreground">Ótimo para "folhas" da árvore (botões, cartões, widgets isolados).</td>
        </tr>
        <tr>
        <td className="p-4 font-bold text-sm">Iframe</td>
        <td className="p-4 text-center text-green-500 text-sm">⭐ Bom (Legado)</td>
        <td className="p-4 text-center"><XCircle className="inline h-4 w-4 text-red-500" /> Péssimo</td>
        <td className="p-4 text-xs text-muted-foreground">Usado pelo Spotify no Desktop antigo para isolar Squads.</td>
        </tr>
        <tr>
        <td className="p-4 font-bold text-sm">Tempo de Construção</td>
        <td className="p-4 text-center"><XCircle className="inline h-4 w-4 text-red-500" /> Ruim</td>
        <td className="p-4 text-center text-yellow-500 text-sm">🟡 Possível</td>
        <td className="p-4 text-xs text-muted-foreground">Cria uma aplicação monolítica. Evite.</td>
        </tr>
      </tbody>
      </table>
    </div>
    </div>

    {/* 3. Análise Detalhada */}
    <div className="mb-20 space-y-12">
    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
      <Monitor className="h-6 w-6 text-primary" />
      3. Análise Detalhada (Como fazer)
    </h3>

    <div className="grid gap-8">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8">
      <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="text-primary">A.</span> Onde aplicar Divisão Horizontal
      </h4>
      <p className="text-muted-foreground mb-6">
        Se você precisa compor uma página com pedaços vindos de lugares diferentes.
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
        <div className="flex items-center gap-2 font-bold text-sm border-b border-border pb-2">
          <Star className="h-4 w-4 text-yellow-500" /> Caso Spotify
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          No player, o componente de **Letras** e a **Barra de Reprodução** são MFEs horizontais. Se as letras falharem, o player continua tocando a música (isolamento de falha visual).
        </p>
        </div>
        <div className="space-y-2">
        <div className="font-bold text-sm">Dica: Module Federation (Cliente)</div>
        <p className="text-xs text-muted-foreground italic">Use esqueleto CSS para evitar "Mudança de Layout" quando o widget carregar.</p>
        <div className="flex gap-2">
          <div className="h-10 w-full bg-muted animate-pulse rounded" />
        </div>
        </div>
      </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8">
      <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="text-primary">B.</span> Onde aplicar Divisão Vertical
      </h4>
      <p className="text-muted-foreground mb-6">
        Se você está dividindo o sistema por domínios de negócio inteiros.
      </p>
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-4">
        <div className="flex items-center gap-2 font-bold text-sm border-b border-border pb-2 text-primary">
          <AppWindow className="h-4 w-4" /> Exemplo: Fluxo de Pagamento
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
          <div className="h-6 w-6 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">1</div>
          <div className="text-xs">Usa **Roteador** para mudar de `/carrinho` para `/pagamento`.</div>
          </div>
          <div className="flex items-center gap-3">
          <div className="h-6 w-6 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">2</div>
          <div className="text-xs">O **Shell** mantém apenas o Cabeçalho global.</div>
          </div>
          <div className="flex items-center gap-3">
          <div className="h-6 w-6 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">3</div>
          <div className="text-xs">O MFE de Pagamento carrega seu próprio CSS/JS isolado.</div>
          </div>
        </div>
        </div>
        <div className="space-y-4">
        <div className="flex items-center gap-2 font-bold text-sm border-b border-border pb-2 text-yellow-500">
          <Star className="h-4 w-4" /> Caso Spotify
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          A página de **Artistas** e a página de **Configurações** são jornadas verticais. O Shell orquestra a troca dessas "Mini-Apps".
        </p>
        </div>
      </div>
      </div>
    </div>
    </div>

    {/* 4. Aplicação no SEU Cenário */}
    <div className="mb-20">
    <div className="rounded-2xl bg-primary/10 border border-primary/20 p-8">
      <h3 className="mb-6 text-2xl font-bold text-foreground flex items-center gap-3">
      <Network className="h-6 w-6 text-primary" />
      4. Aplicação no SEU Cenário (O Pulo do Gato)
      </h3>
      <p className="font-mono text-sm text-primary mb-6">"Nossa arquitetura usa uma abordagem Híbrida Inteligente baseada em Module Federation:"</p>
      
      <div className="space-y-6">
      <div className="flex gap-4">
        <div className="h-8 w-8 shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">1</div>
        <div>
        <div className="font-bold">Macro-Arquitetura (Vertical)</div>
        <p className="text-sm text-muted-foreground">Usamos a divisão vertical para separar as Jornadas (A e B). Cada jornada é um MFE carregado sob demanda via Rota.</p>
        <div className="mt-2 text-[10px] font-mono text-primary uppercase">Ganho: Times independentes e donos do fluxo</div>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="h-8 w-8 shrink-0 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold">2</div>
        <div>
        <div className="font-bold">Micro-Arquitetura (Horizontal)</div>
        <p className="text-sm text-muted-foreground">Dentro das jornadas, usamos divisão horizontal para funcionalidades transversais.</p>
        <div className="mt-2 space-y-1">
          <div className="text-[10px] font-mono text-muted-foreground flex items-center gap-1 italic">
          <CheckCircle2 className="h-3 w-3 text-accent" /> Bibliotecas Compartilhadas: Formulário de Cadastro carregado em A e B.
          </div>
          <div className="text-[10px] font-mono text-muted-foreground flex items-center gap-1 italic">
          <CheckCircle2 className="h-3 w-3 text-accent" /> Composição: Shell fixo (Cabeçalho/Menu) compondo com a Jornada.
          </div>
        </div>
        </div>
      </div>
      </div>
    </div>
    </div>

    {/* Resumo Slide */}
    <div className="grid gap-6 sm:grid-cols-2">
    <div className="rounded-xl border border-border bg-card p-6 border-l-4 border-l-primary">
      <h4 className="flex items-center gap-2 font-bold mb-2">
      <Columns className="h-5 w-5 text-primary" />
      Vertical
      </h4>
      <p className="text-sm text-muted-foreground">Para separar Times e Jornadas de Negócio (Baseado em Roteador).</p>
    </div>
    <div className="rounded-xl border border-border bg-card p-6 border-l-4 border-l-accent">
      <h4 className="flex items-center gap-2 font-bold mb-2">
      <Rows className="h-5 w-5 text-accent" />
      Horizontal
      </h4>
      <p className="text-sm text-muted-foreground">Para separar Componentes Reutilizáveis na mesma tela (Baseado em Composição).</p>
    </div>
    </div>
    
    <div className="mt-8 p-4 rounded-lg bg-muted text-center italic text-sm text-muted-foreground">
    "Module Federation cobre ambos os casos mantendo o Single Runtime e alta performance."
    </div>
  </section>
  )
}
