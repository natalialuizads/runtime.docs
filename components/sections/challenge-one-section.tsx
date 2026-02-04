"use client";

import { CodeBlock } from "@/components/code-block";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Database,
  FormInput,
  Layers,
  LayoutList,
  Loader2,
  Network,
  RefreshCw,
  ServerCrash,
  ShieldAlert,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

// ==========================================
// DEMO 1: LIST RENDERING (CPU BOUND)
// ==========================================
function ListRenderingDemo() {
  const [status, setStatus] = useState<"idle" | "frozen" | "fluid">("idle");
  const [count, setCount] = useState(0);
  const [itemsProcessed, setItemsProcessed] = useState(0);
  const totalItems = 5000;

  useEffect(() => {
    const interval = setInterval(() => setCount((c) => c + 1), 100);
    return () => clearInterval(interval);
  }, []);

  const runHeavyRender = () => {
    setStatus("frozen");
    setItemsProcessed(0);
    setTimeout(() => {
      const start = performance.now();
      while (performance.now() - start < 1500) {
        Math.sqrt(Math.random());
      }
      setItemsProcessed(totalItems);
      setStatus("idle");
    }, 50);
  };

  const runVirtualRender = () => {
    setStatus("fluid");
    setItemsProcessed(0);
    let processed = 0;
    const processVirtualChunk = () => {
      const start = performance.now();
      while (performance.now() - start < 5 && processed < totalItems) {
        Math.sqrt(Math.random());
        processed += 100;
      }
      setItemsProcessed(Math.min(processed, totalItems));
      if (processed < totalItems) requestAnimationFrame(processVirtualChunk);
      else setStatus("idle");
    };
    processVirtualChunk();
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
        <div>
          <h4 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <LayoutList className="h-5 w-5 text-destructive" />
            Cenário 1: O Custo do DOM (Listas Gigantes)
          </h4>
          <p className="text-sm text-muted-foreground">
            Renderizar 5.000 itens JSON de uma vez no navegador.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-mono bg-muted/50 px-3 py-1.5 rounded border border-border">
          <Activity
            className={cn(
              "h-3 w-3",
              status === "frozen"
                ? "text-muted-foreground"
                : "text-green-500 animate-pulse",
            )}
          />
          UI Thread: {count}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center justify-center space-y-6 rounded-lg bg-muted/20 p-8 border border-border/50">
          <div className="relative group">
            <div
              className={cn(
                "absolute -inset-1 rounded-full blur opacity-20 transition duration-1000",
                status === "frozen"
                  ? "bg-destructive opacity-50"
                  : "bg-primary",
              )}
            />
            <div className="relative rounded-full bg-card p-4 ring-1 ring-border">
              <Loader2
                className={cn(
                  "h-12 w-12 text-primary transition-all duration-75",
                  "animate-spin",
                  status === "frozen" && "paused opacity-50 text-destructive",
                )}
                style={{
                  animationPlayState: status === "frozen" ? "paused" : "running",
                }}
              />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h5
              className={cn(
                "text-2xl font-bold transition-colors",
                status === "frozen" ? "text-destructive" : "text-foreground",
              )}
            >
              {status === "frozen" ? "UI CONGELADA" : "UI Fluida"}
            </h5>
            <p className="text-xs text-muted-foreground max-w-[200px]">
              {status === "frozen"
                ? "Browser travado calculando layout de 5.000 divs."
                : "Virtualização: Renderiza apenas o que cabe na tela."}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <button
            onClick={runHeavyRender}
            disabled={status !== "idle"}
            className="group w-full flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/20 disabled:opacity-50 transition-all text-left"
          >
            <div>
              <span className="flex items-center gap-2 font-bold">
                <ServerCrash className="h-4 w-4" />
                Renderizar Tudo
              </span>
              <span className="text-[10px] opacity-80 mt-1 block">
                Simula <code>v-for</code> em lista gigante sem paginação.
              </span>
            </div>
          </button>

          <button
            onClick={runVirtualRender}
            disabled={status !== "idle"}
            className="group w-full flex items-center justify-between rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-primary hover:bg-primary/20 disabled:opacity-50 transition-all text-left"
          >
            <div>
              <span className="flex items-center gap-2 font-bold">
                <Zap className="h-4 w-4" />
                Virtualização (Windowing)
              </span>
              <span className="text-[10px] opacity-80 mt-1 block">
                Renderiza apenas a viewport (ex: 20 itens).
              </span>
            </div>
          </button>

          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              <span>Custo de Renderização</span>
              <span>{Math.round((itemsProcessed / totalItems) * 100)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={cn(
                  "h-full transition-all ease-out",
                  status === "frozen"
                    ? "bg-destructive duration-[1500ms]"
                    : "bg-primary duration-75",
                )}
                style={{ width: `${(itemsProcessed / totalItems) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// DEMO 2: N+1 PROBLEM (NETWORK BOUND)
// ==========================================
function NPlusOneDemo() {
  const [reqStatus, setReqStatus] = useState<
    { id: number; state: "waiting" | "loading" | "done"; delay: number }[]
  >([]);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  const reset = () => {
    setReqStatus(
      Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        state: "waiting",
        delay: 400 + Math.random() * 400,
      })),
    );
    setTotalTime(0);
  };

  useEffect(() => reset(), []);

  const runNPlusOne = async () => {
    if (isRunning) return;
    setIsRunning(true);
    reset();
    await new Promise((r) => setTimeout(r, 100));
    const startTime = performance.now();
    const reqs = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      delay: 500,
    }));

    for (let i = 0; i < reqs.length; i++) {
      setReqStatus((prev) =>
        prev.map((r) => (r.id === i ? { ...r, state: "loading" } : r)),
      );
      await new Promise((resolve) => setTimeout(resolve, reqs[i].delay));
      setReqStatus((prev) =>
        prev.map((r) => (r.id === i ? { ...r, state: "done" } : r)),
      );
    }
    setTotalTime(performance.now() - startTime);
    setIsRunning(false);
  };

  const runBatch = async () => {
    if (isRunning) return;
    setIsRunning(true);
    reset();
    await new Promise((r) => setTimeout(r, 100));
    const startTime = performance.now();
    const reqs = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      delay: 500 + Math.random() * 200,
    }));

    setReqStatus((prev) => prev.map((r) => ({ ...r, state: "loading" })));
    await Promise.all(
      reqs.map(async (req) => {
        await new Promise((resolve) => setTimeout(resolve, req.delay));
        setReqStatus((prev) =>
          prev.map((r) => (r.id === req.id ? { ...r, state: "done" } : r)),
        );
      }),
    );
    setTotalTime(performance.now() - startTime);
    setIsRunning(false);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm mt-8">
      <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
        <div>
          <h4 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Network className="h-5 w-5 text-accent" />
            Cenário 2: O Problema N+1 (Client-Side)
          </h4>
          <p className="text-sm text-muted-foreground">
            Iterar sobre uma lista de IDs e fazer um <code>fetch</code> para
            cada item.
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono text-muted-foreground uppercase">
            Latência Total
          </div>
          <div
            className={cn(
              "text-xl font-mono font-bold",
              totalTime > 0 ? "text-foreground" : "text-muted-foreground/50",
            )}
          >
            {totalTime > 0 ? `${(totalTime / 1000).toFixed(2)}s` : "--"}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="flex justify-between text-xs text-muted-foreground border-b border-border pb-2">
            <span>Connection Pool (Browser Limit: ~6)</span>
            <span>Status</span>
          </div>
          <div className="space-y-2">
            {reqStatus.map((req) => (
              <div key={req.id} className="relative">
                <div className="flex items-center gap-3 z-10 relative">
                  <span className="w-8 text-xs font-mono text-muted-foreground">
                    ID:{req.id + 100}
                  </span>
                  <div className="flex-1 h-6 bg-secondary/50 rounded overflow-hidden relative border border-border/50">
                    {req.state !== "waiting" && (
                      <div
                        className={cn(
                          "absolute inset-y-0 left-0 transition-all duration-300 ease-out",
                          req.state === "done"
                            ? "w-full bg-accent"
                            : "w-[60%] bg-accent/60 animate-pulse",
                        )}
                      />
                    )}
                  </div>
                </div>
                {req.id > 0 && req.state === "waiting" && (
                  <div className="absolute -top-3 left-[2.5rem] w-0.5 h-5 bg-border -z-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-4">
          <button
            onClick={runNPlusOne}
            disabled={isRunning}
            className="group w-full flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:bg-muted/50 transition-all disabled:opacity-50 text-left"
          >
            <div>
              <div className="flex items-center gap-2 font-bold text-foreground">
                <ArrowRight className="h-4 w-4 rotate-90 text-muted-foreground" />
                Loop de Requests (N+1)
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                <code>for (id of ids) await fetch(id)</code>
              </div>
            </div>
            <div className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
              Lento
            </div>
          </button>

          <button
            onClick={runBatch}
            disabled={isRunning}
            className="group w-full flex items-center justify-between rounded-lg border border-accent/30 bg-accent/10 p-4 hover:bg-accent/20 transition-all disabled:opacity-50 text-left"
          >
            <div>
              <div className="flex items-center gap-2 font-bold text-accent">
                <Layers className="h-4 w-4" />
                Batch / Promise.all
              </div>
              <div className="text-xs text-accent/80 mt-1">
                Dispara concorrentemente ou usa endpoint de lote.
              </div>
            </div>
            <div className="text-xs font-mono bg-accent/20 text-accent px-2 py-1 rounded">
              Rápido
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// DEMO 3: RACE CONDITIONS (FORMS)
// ==========================================
function RaceConditionDemo() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<
    "idle" | "checking" | "valid" | "invalid"
  >("idle");
  const [lastSaved, setLastSaved] = useState<string>("");
  const [logs, setLogs] = useState<string[]>([]);

  const checkUsername = async (value: string) => {
    const id = Math.random().toString(36).substring(7);
    const latency = Math.random() * 2000 + 500; // 500ms a 2500ms
    addLog(
      `REQ[${id}]: Checking "${value}" (${latency.toFixed(0)}ms latency)...`,
    );

    await new Promise((r) => setTimeout(r, latency));

    // AQUI É O ERRO: Sobrescreve cegamente
    setLastSaved(value);
    addLog(`RES[${id}]: Done for "${value}". UI Updated.`);
  };

  const addLog = (msg: string) => {
    setLogs((prev) => [msg, ...prev].slice(0, 5));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    setStatus("checking");
    checkUsername(val);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm mt-8">
      <div className="mb-6 border-b border-border pb-4">
        <h4 className="flex items-center gap-2 text-lg font-bold text-foreground">
          <RefreshCw className="h-5 w-5 text-orange-500" />
          Cenário 3: Race Conditions (Forms)
        </h4>
        <p className="text-sm text-muted-foreground mt-1">
          Digite rápido. O backend vai responder fora de ordem e corromper o
          estado.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-muted-foreground">
              Username (Async Check)
            </label>
            <div className="relative">
              <input
                value={input}
                onChange={handleChange}
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                placeholder="Digite 'admin'..."
              />
              {status === "checking" && (
                <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>

          <div
            className={cn(
              "p-4 rounded-lg border text-center transition-all",
              input === lastSaved
                ? "bg-green-500/10 border-green-500/30 text-green-600"
                : "bg-destructive/10 border-destructive/30 text-destructive",
            )}
          >
            <div className="text-xs uppercase font-bold mb-1">
              Estado Final na UI
            </div>
            <div className="text-xl font-mono font-bold">"{lastSaved}"</div>
            {input !== lastSaved && (
              <div className="text-xs mt-2 font-bold animate-pulse">
                ⚠️ INCONSISTENTE (Input diz "{input}")
              </div>
            )}
          </div>
        </div>

        <div className="bg-black/90 rounded-lg p-4 font-mono text-xs text-green-400 overflow-hidden flex flex-col">
          <div className="text-muted-foreground border-b border-white/10 pb-2 mb-2">
            Network Logs
          </div>
          <div className="space-y-1">
            {logs.map((log, i) => (
              <div key={i} className="truncate opacity-80">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// DEMO 4: VALIDATION (CLIENT VS SERVER)
// ==========================================
function ValidationDemo() {
  const [formData, setFormData] = useState({ email: "", age: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<"backend" | "client">("backend");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});
    await new Promise((r) => setTimeout(r, 600)); // Latency

    const newErrors: Record<string, string> = {};
    if (!formData.email.includes("@"))
      newErrors.email = "Email inválido (Server)";
    if (Number(formData.age) < 18) newErrors.age = "Menor de idade (Server)";

    setErrors(newErrors);
    setIsSubmitting(false);
  };

  const handleChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    if (mode === "client") {
      const newErrors = { ...errors };
      if (field === "email") {
        newErrors.email = value.includes("@") ? "" : "Email deve ter @";
      }
      if (field === "age") {
        newErrors.age = Number(value) >= 18 ? "" : "Deve ser 18+";
      }
      setErrors(newErrors);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm mt-8">
      <div className="mb-6 border-b border-border pb-4 flex justify-between items-center">
        <div>
          <h4 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <ShieldAlert className="h-5 w-5 text-blue-500" />
            Cenário 4: Onde Validar?
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            Validação Server-Side (padrão) vs Validação Client-Side (UX).
          </p>
        </div>

        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => {
              setMode("backend");
              setErrors({});
            }}
            className={cn(
              "px-3 py-1 text-xs font-bold rounded-md transition-all",
              mode === "backend"
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground",
            )}
          >
            Submit-Only
          </button>
          <button
            onClick={() => {
              setMode("client");
              setErrors({});
            }}
            className={cn(
              "px-3 py-1 text-xs font-bold rounded-md transition-all",
              mode === "client"
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground",
            )}
          >
            Real-time
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground">
              Email
            </label>
            <div className="relative">
              <input
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={cn(
                  "w-full bg-background border rounded-md px-3 py-2 text-sm outline-none transition-all",
                  errors.email
                    ? "border-destructive ring-1 ring-destructive"
                    : "border-input focus:ring-2 focus:ring-primary",
                )}
              />
              {errors.email && (
                <div className="absolute right-3 top-2.5 text-destructive">
                  <XCircle className="h-4 w-4" />
                </div>
              )}
            </div>
            {errors.email && (
              <p className="text-xs text-destructive font-bold">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground">
              Idade
            </label>
            <div className="relative">
              <input
                value={formData.age}
                type="number"
                onChange={(e) => handleChange("age", e.target.value)}
                className={cn(
                  "w-full bg-background border rounded-md px-3 py-2 text-sm outline-none transition-all",
                  errors.age
                    ? "border-destructive ring-1 ring-destructive"
                    : "border-input focus:ring-2 focus:ring-primary",
                )}
              />
            </div>
            {errors.age && (
              <p className="text-xs text-destructive font-bold">{errors.age}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground font-bold py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Enviar Dados
          </button>
        </div>

        <div className="flex items-center justify-center bg-muted/20 rounded-xl border border-border border-dashed p-6">
          {mode === "backend" ? (
            <div className="text-center space-y-2">
              <FormInput className="h-10 w-10 text-muted-foreground mx-auto" />
              <h5 className="font-bold text-sm">Experiência "Old School"</h5>
              <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
                O usuário preenche tudo às cegas. Só descobre o erro após o
                loading do servidor.
              </p>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <Activity className="h-10 w-10 text-accent mx-auto" />
              <h5 className="font-bold text-sm">Experiência Moderna</h5>
              <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
                Feedback instantâneo (Optimistic UI). O servidor serve apenas
                como "double check" de segurança.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export function ChallengeOneSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <span className="font-mono text-xs text-yellow-500">
            CHECKPOINT PRÁTICO
          </span>
        </div>

        <h2 className="mb-4 text-3xl font-bold text-foreground">
          Laboratório de Performance & Estado
        </h2>
        
        {/* === MENSAGEM CHAVE ADICIONADA AQUI === */}
        <div className="bg-muted/30 border border-border rounded-lg p-6 mb-6">
          <p className="text-lg text-foreground font-medium mb-2">
            Desafios Isolados vs. Realidade
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Nesta seção, vamos dissecar cada problema (CPU, Rede, Estado) separadamente para fins didáticos. 
            <br/><br/>
            <strong>Porém, cuidado:</strong> No mundo real, uma única tela (como um Dashboard de Vendas ou um Formulário de Checkout) 
            frequentemente enfrenta <strong>todos esses problemas simultaneamente</strong>. 
            O engenheiro Frontend precisa malabarizar renderização de listas, requests em paralelo e validação de input tudo ao mesmo tempo.
          </p>
        </div>
      </div>

      <div className="space-y-16">
        {/* === PARTE 1: CPU / DOM === */}
        <div>
          <ListRenderingDemo />
          
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <h5 className="font-bold flex items-center gap-2 mb-2 text-sm text-foreground">
                <Database className="h-4 w-4 text-muted-foreground" />A Analogia
                Backend
              </h5>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Renderizar 5.000 itens no DOM de uma vez é o equivalente a fazer
                um <code>SELECT * FROM users</code> sem <code>LIMIT</code>. O
                banco (browser) vai travar.
              </p>
            </div>
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
              <h5 className="font-bold flex items-center gap-2 mb-2 text-sm text-primary">
                <CheckCircle2 className="h-4 w-4" />A Solução
              </h5>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Paginação:</strong> Traga dados sob demanda.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Virtualização:</strong> Renderize apenas o que o
                    usuário vê.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-dashed border-border"></div>

        {/* === PARTE 2: N+1 / NETWORK === */}
        <div>
          <NPlusOneDemo />
          
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <h5 className="font-bold flex items-center gap-2 mb-2 text-sm text-foreground">
                <Database className="h-4 w-4 text-muted-foreground" />A Analogia
                Backend
              </h5>
              <p className="text-sm text-muted-foreground leading-relaxed">
                É o clássico <strong>Problema N+1</strong>. O browser limita
                conexões paralelas. Fazer 1 fetch por item enfileira requisições
                e aumenta latência.
              </p>
            </div>
            <div className="rounded-lg border border-accent/20 bg-accent/5 p-5">
              <h5 className="font-bold flex items-center gap-2 mb-2 text-sm text-accent">
                <CheckCircle2 className="h-4 w-4" />A Solução
              </h5>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Use <strong>Batch APIs</strong> (<code>/users?ids=1,2,3</code>)
                ou BFFs para agregar chamadas.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-dashed border-border"></div>

        {/* === PARTE 3: RACE CONDITIONS === */}
        <div>
          <RaceConditionDemo />
          
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <h5 className="font-bold flex items-center gap-2 mb-2 text-sm text-foreground">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />O
                Problema
              </h5>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Requests não garantem ordem. O request "A" pode chegar depois do
                request "B", sobrescrevendo o estado mais recente com dados
                velhos.
              </p>
            </div>
            <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-5">
              <h5 className="font-bold flex items-center gap-2 mb-2 text-sm text-orange-600">
                <CheckCircle2 className="h-4 w-4" />A Solução (AbortController)
              </h5>
              <div className="space-y-2 mt-2">
                <CodeBlock language="typescript" filename="cleanup.ts">
                  {`useEffect(() => {
  const ctrl = new AbortController();
  fetch('/api', { signal: ctrl.signal })
  return () => ctrl.abort(); // Cancela anterior
}, [input]);`}
                </CodeBlock>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-dashed border-border"></div>

        {/* === PARTE 4: VALIDATION === */}
        <div>
          <ValidationDemo />

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <h5 className="font-bold flex items-center gap-2 mb-2 text-sm text-foreground">
                <Database className="h-4 w-4 text-muted-foreground" />
                Mentalidade Backend
              </h5>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "Nunca confie no cliente". Verdade para segurança, mas ruim para
                UX. Validar só no submit cria frustração.
              </p>
            </div>
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-5">
              <h5 className="font-bold flex items-center gap-2 mb-2 text-sm text-blue-600">
                <CheckCircle2 className="h-4 w-4" />
                Validação no Cliente (UX)
              </h5>
              <p className="text-sm text-foreground/80 leading-relaxed mb-2">
                Antecipe o feedback:
              </p>
              <ul className="space-y-1 text-sm text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>
                    <strong>UX:</strong> Avise o erro enquanto o usuário digita.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>
                    <strong>Security:</strong> Valide novamente ao receber
                    (server).
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}