"use client";

import { CodeBlock } from "@/components/code-block";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowRight,
  Clock,
  Layers,
  Layout,
  Play,
  RotateCw,
  Server,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

// --- COMPONENTE: VISUALIZADOR DE EVENT LOOP ---
function EventLoopExplorer() {
  const [stack, setStack] = useState<string[]>([]);
  const [webApi, setWebApi] = useState<string[]>([]);
  const [queue, setQueue] = useState<string[]>([]);
  const [isLooping, setIsLooping] = useState(false);
  const [fps, setFps] = useState(60);
  const [isBlocked, setIsBlocked] = useState(false);

  // CONSTANTE DE VELOCIDADE (MS)
  // Aumentei para 1.5s para ficar mais fácil de acompanhar
  const TICK_RATE = 1500; 

  // Simula o Heartbeat (FPS Counter)
  useEffect(() => {
    let lastTime = performance.now();
    let frame = 0;
    
    const loop = (now: number) => {
      frame++;
      if (now - lastTime >= 1000) {
        setFps(frame);
        frame = 0;
        lastTime = now;
      }
      requestAnimationFrame(loop);
    };
    
    const frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // O "Motor" do Event Loop
  useEffect(() => {
    if (!isLooping) return;

    const interval = setInterval(() => {
      // Regra 1: Se a Stack tem algo, processa (remove)
      if (stack.length > 0) {
        setStack((prev) => {
          const newStack = [...prev];
          newStack.pop(); // Executa o último item
          return newStack;
        });
        // Se a stack esvaziar, desbloqueia a thread
        if (stack.length === 1) setIsBlocked(false);
      } 
      // Regra 2: Se Stack vazia E Queue tem algo, move Queue -> Stack
      else if (queue.length > 0) {
        setQueue((prev) => {
          const newQueue = [...prev];
          const item = newQueue.shift(); // Pega o primeiro da fila
          if (item) setStack([item]);
          return newQueue;
        });
      }
    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [isLooping, stack.length, queue.length]);

  const runSynchronous = () => {
    if (isBlocked) return;
    setIsLooping(true);
    setIsBlocked(true);
    // Simula bloqueio: Enche a stack
    setStack(["console.log('Fim')", "heavyCalculation()", "main()"]);
  };

  const runAsynchronous = () => {
    if (isBlocked) return;
    setIsLooping(true);
    
    // 1. Adiciona na Stack
    setStack(["setTimeout(cb, 0)", "main()"]);

    // 2. Simula o Browser (Web API) pegando o timer
    setTimeout(() => {
        // Remove da Stack (já executou a linha do setTimeout)
        setStack((prev) => prev.filter(i => i !== "setTimeout(cb, 0)"));
        setWebApi(["Timer (Running...)"]);

        // 3. Move da Web API para Queue
        setTimeout(() => {
            setWebApi([]);
            setQueue((prev) => [...prev, "callback()"]);
            
            // Remove o main() eventualmente para limpar a stack
             setTimeout(() => {
                setStack((prev) => prev.filter(i => i !== "main()"));
            }, TICK_RATE);
        }, TICK_RATE);
    }, TICK_RATE);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
        <div>
          <h4 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <RotateCw className="h-5 w-5 text-primary" />
            Visualizador do Runtime
          </h4>
          <p className="text-sm text-muted-foreground">
            Entenda para onde vai o código quando você executa.
          </p>
        </div>
        
        {/* Monitor de FPS Real */}
        <div className={cn(
            "flex flex-col items-end px-3 py-1 rounded border",
            isBlocked ? "bg-destructive/10 border-destructive text-destructive" : "bg-green-500/10 border-green-500 text-green-500"
        )}>
            <span className="text-xs font-bold uppercase">Main Thread Status</span>
            <span className="text-xl font-mono font-bold">
                {isBlocked ? "BLOCKED (0 FPS)" : "FLUID (60 FPS)"}
            </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* COLUNA 1: Call Stack */}
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h5 className="font-bold flex items-center gap-2 text-sm"><Layers className="h-4 w-4" /> Call Stack (Pilha)</h5>
                <span className="text-[10px] bg-secondary px-2 py-0.5 rounded text-muted-foreground">Executa Agora</span>
            </div>
            <div className="h-48 border-2 border-primary/20 bg-background/50 rounded-lg flex flex-col-reverse p-2 gap-2 relative overflow-hidden transition-all">
                {stack.map((item, i) => (
                    <div key={i} className="bg-primary/20 border border-primary text-primary px-3 py-2 rounded text-xs font-mono font-bold animate-in slide-in-from-top-2 duration-500">
                        {item}
                    </div>
                ))}
                {stack.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 text-xs uppercase font-bold">
                        Vazio
                    </div>
                )}
            </div>
            <div className="text-xs text-muted-foreground">
                <strong className="text-primary">Regra:</strong> JS é Single Thread. Se tem algo aqui, nada mais acontece.
            </div>
        </div>

        {/* COLUNA 2: Web APIs & Queue */}
        <div className="space-y-6">
            {/* Web APIs */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h5 className="font-bold flex items-center gap-2 text-sm"><Layout className="h-4 w-4" /> Web APIs</h5>
                    <span className="text-[10px] bg-secondary px-2 py-0.5 rounded text-muted-foreground">Browser/C++</span>
                </div>
                <div className="h-16 border-2 border-dashed border-accent/30 bg-accent/5 rounded-lg flex items-center justify-center gap-2 transition-all">
                     {webApi.map((item, i) => (
                        <div key={i} className="bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-mono animate-pulse">
                            {item}
                        </div>
                    ))}
                    {webApi.length === 0 && <span className="text-[10px] text-muted-foreground/40">Idle</span>}
                </div>
            </div>

            <div className="flex justify-center">
                <ArrowDown className="h-6 w-6 text-muted-foreground animate-bounce duration-1000" />
            </div>

            {/* Task Queue */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h5 className="font-bold flex items-center gap-2 text-sm"><Clock className="h-4 w-4" /> Task Queue (Fila)</h5>
                    <span className="text-[10px] bg-secondary px-2 py-0.5 rounded text-muted-foreground">Espera sua vez</span>
                </div>
                <div className="h-16 border-2 border-secondary bg-secondary/20 rounded-lg flex items-center px-2 gap-2 overflow-x-auto transition-all">
                    {queue.map((item, i) => (
                        <div key={i} className="bg-secondary-foreground text-secondary px-2 py-1 rounded text-xs font-mono whitespace-nowrap animate-in zoom-in duration-300">
                            {item}
                        </div>
                    ))}
                     {queue.length === 0 && <span className="text-[10px] text-muted-foreground/40 w-full text-center">Vazia</span>}
                </div>
            </div>
        </div>

        {/* COLUNA 3: Controles */}
        <div className="flex flex-col justify-center space-y-4 border-l border-border pl-8">
            <button
                onClick={runSynchronous}
                disabled={isBlocked || stack.length > 0}
                className="w-full flex flex-col gap-1 p-4 rounded-lg bg-destructive/10 border border-destructive/30 hover:bg-destructive/20 transition-all text-left disabled:opacity-50"
            >
                <div className="flex items-center gap-2 font-bold text-destructive text-sm">
                    <Zap className="h-4 w-4" /> Código Síncrono
                </div>
                <div className="text-[10px] text-muted-foreground">
                    Ex: <code>while(true)</code>, <code>JSON.parse(huge)</code>
                </div>
            </button>

            <button
                onClick={runAsynchronous}
                disabled={isBlocked || stack.length > 0}
                className="w-full flex flex-col gap-1 p-4 rounded-lg bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 transition-all text-left disabled:opacity-50"
            >
                <div className="flex items-center gap-2 font-bold text-green-600 text-sm">
                    <Clock className="h-4 w-4" /> Código Assíncrono
                </div>
                <div className="text-[10px] text-muted-foreground">
                    Ex: <code>setTimeout</code>, <code>fetch</code>
                </div>
            </button>

            <div className="mt-4 p-3 bg-muted rounded text-xs text-muted-foreground italic">
                "O Event Loop é o porteiro que só deixa alguém da <strong>Fila</strong> entrar na <strong>Pilha</strong> se a Pilha estiver vazia."
            </div>
        </div>

      </div>
    </div>
  );
}

export function EventLoopSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <div className="mb-2 font-mono text-sm text-primary">FASE 1.1</div>
        <h2 className="mb-4 text-3xl font-bold text-foreground">
          Single Thread & Event Loop
        </h2>
        <p className="text-lg text-muted-foreground">
          JavaScript tem apenas uma "mão" para trabalhar. Entender como ele malabariza tarefas é a chave para apps fluidos.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-muted/30 p-5 rounded-xl border border-border">
             <h3 className="font-bold flex items-center gap-2 mb-3 text-sm">
                <Server className="h-4 w-4 text-orange-500" />
                Modelo Tradicional (Java/C#)
             </h3>
             <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>Cada request cria uma nova <strong>Thread</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>Se uma thread trava (I/O), o sistema troca para outra.</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>Multitarefa <strong>Preemptiva</strong>.</span>
                </li>
             </ul>
        </div>

        <div className="bg-primary/5 p-5 rounded-xl border border-primary/20">
             <h3 className="font-bold flex items-center gap-2 mb-3 text-sm">
                <Layout className="h-4 w-4 text-primary" />
                Modelo JavaScript
             </h3>
             <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Apenas <strong>UMA Thread</strong> principal.</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Se ela trava, <strong>a página inteira congela</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Assincronismo é delegado (Web APIs).</span>
                </li>
             </ul>
        </div>
      </div>

      <EventLoopExplorer />

      {/* Explicação do Frame Budget */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-foreground mb-4">O Orçamento de 16ms</h3>
        <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 text-sm text-muted-foreground">
                <p className="mb-4">
                    Para uma animação parecer fluida (60 FPS), o browser precisa pintar a tela a cada <strong>16.6ms</strong>.
                </p>
                <p>
                    Se o seu código JavaScript na <strong>Call Stack</strong> demorar mais que isso, o browser perde a chance de pintar o frame (Frame Drop). O usuário sente o "lag".
                </p>
            </div>
            
            <div className="flex-1 w-full bg-card border border-border rounded-lg p-4">
                <div className="flex justify-between text-xs mb-2 font-mono">
                    <span>1 Frame (16ms)</span>
                    <span className="text-destructive">Frame Drop</span>
                </div>
                <div className="flex h-8 w-full rounded overflow-hidden">
                    <div className="w-[40%] bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold" title="JS Execution">JS</div>
                    <div className="w-[20%] bg-purple-500 flex items-center justify-center text-[10px] text-white font-bold" title="Style Calc">Style</div>
                    <div className="w-[20%] bg-green-500 flex items-center justify-center text-[10px] text-white font-bold" title="Layout">Layout</div>
                    <div className="w-[10%] bg-yellow-500 flex items-center justify-center text-[10px] text-white font-bold" title="Paint">Paint</div>
                    {/* Espaço livre */}
                    <div className="w-[10%] bg-transparent border-l border-dashed border-foreground/20"></div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 text-center">
                    Seu código JS deve rodar idealmente em &lt; 10ms para deixar tempo para Style, Layout e Paint.
                </p>
            </div>
        </div>
      </div>

      <div className="my-8 rounded-lg border border-primary/30 bg-primary/10 p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold text-primary">
          Regra de Ouro
        </h3>
        <p className="mb-4 text-sm text-foreground font-medium">
          "Don't block the Event Loop."
        </p>
        <p className="text-sm text-primary/80">
          Sempre que tiver um processamento pesado (loop gigante, criptografia, processamento de imagem), 
          tire-o da Main Thread. Use Web Workers ou quebre em tarefas menores (como visto no desafio anterior).
        </p>
      </div>
    </section>
  );
}