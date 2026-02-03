"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface MFE {
  id: string;
  name: string;
  team: string;
  dependencies: { name: string; version: string; size: number }[];
}

const availableDeps = [
  { name: "React", versions: ["17.0.2", "18.2.0", "18.3.1"], baseSize: 150 },
  { name: "Lodash", versions: ["4.17.15", "4.17.21"], baseSize: 75 },
  { name: "Moment.js", versions: ["2.29.1", "2.29.4"], baseSize: 300 },
  { name: "date-fns", versions: ["2.30.0"], baseSize: 30 },
  { name: "Axios", versions: ["0.21.1", "1.4.0", "1.6.0"], baseSize: 45 },
];

const defaultMFEs: MFE[] = [
  {
    id: "header",
    name: "Header",
    team: "Team A",
    dependencies: [
      { name: "React", version: "17.0.2", size: 150 },
      { name: "Lodash", version: "4.17.15", size: 75 },
    ],
  },
  {
    id: "cart",
    name: "Cart",
    team: "Team B",
    dependencies: [
      { name: "React", version: "18.2.0", size: 180 },
      { name: "Lodash", version: "4.17.21", size: 75 },
      { name: "Axios", version: "1.4.0", size: 45 },
    ],
  },
  {
    id: "catalog",
    name: "Catalog",
    team: "Team C",
    dependencies: [
      { name: "React", version: "18.3.1", size: 175 },
      { name: "Moment.js", version: "2.29.4", size: 300 },
    ],
  },
];

export function MFEMemorySimulator() {
  const [mfes, setMfes] = useState<MFE[]>(defaultMFEs);
  const [sharedDeps, setSharedDeps] = useState(false);

  const calculateMemory = () => {
    if (sharedDeps) {
      // Com Module Federation: cada dependência carrega apenas 1x (versão mais recente)
      const uniqueDeps = new Map<string, number>();
      mfes.forEach((mfe) => {
        mfe.dependencies.forEach((dep) => {
          const current = uniqueDeps.get(dep.name) || 0;
          uniqueDeps.set(dep.name, Math.max(current, dep.size));
        });
      });
      return Array.from(uniqueDeps.values()).reduce((a, b) => a + b, 0);
    } else {
      // Sem compartilhamento: cada MFE carrega suas proprias dependencias
      return mfes.reduce(
        (total, mfe) =>
          total + mfe.dependencies.reduce((sum, dep) => sum + dep.size, 0),
        0,
      );
    }
  };

  const calculateDuplicates = () => {
    const depCounts = new Map<string, number>();
    mfes.forEach((mfe) => {
      mfe.dependencies.forEach((dep) => {
        depCounts.set(dep.name, (depCounts.get(dep.name) || 0) + 1);
      });
    });
    return Array.from(depCounts.entries())
      .filter(([_, count]) => count > 1)
      .map(([name, count]) => ({ name, count }));
  };

  const totalMemory = calculateMemory();
  const duplicates = calculateDuplicates();
  const optimalMemory =
    mfes.length > 0
      ? [...new Set(mfes.flatMap((m) => m.dependencies.map((d) => d.name)))]
          .map((name) => {
            const dep = availableDeps.find((d) => d.name === name);
            return dep?.baseSize || 0;
          })
          .reduce((a, b) => a + b, 0)
      : 0;

  const wastedMemory = totalMemory - optimalMemory;

  const addMFE = () => {
    const newId = `mfe-${Date.now()}`;
    setMfes([
      ...mfes,
      {
        id: newId,
        name: `MFE ${mfes.length + 1}`,
        team: `Team ${String.fromCharCode(65 + mfes.length)}`,
        dependencies: [{ name: "React", version: "18.2.0", size: 180 }],
      },
    ]);
  };

  const removeMFE = (id: string) => {
    setMfes(mfes.filter((m) => m.id !== id));
  };

  const toggleDependency = (mfeId: string, depName: string) => {
    setMfes(
      mfes.map((mfe) => {
        if (mfe.id !== mfeId) return mfe;

        const hasDep = mfe.dependencies.some((d) => d.name === depName);
        if (hasDep) {
          return {
            ...mfe,
            dependencies: mfe.dependencies.filter((d) => d.name !== depName),
          };
        } else {
          const dep = availableDeps.find((d) => d.name === depName);
          if (!dep) return mfe;
          return {
            ...mfe,
            dependencies: [
              ...mfe.dependencies,
              {
                name: dep.name,
                version:
                  dep.versions[Math.floor(Math.random() * dep.versions.length)],
                size: dep.baseSize + Math.floor(Math.random() * 30),
              },
            ],
          };
        }
      }),
    );
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-mono text-sm font-semibold text-primary">
          MFE Memory Simulator
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            Module Federation
          </span>
          <Switch checked={sharedDeps} onCheckedChange={setSharedDeps} />
        </div>
      </div>

      {/* Memory Visualization */}
      <div className="mb-6 rounded border border-border bg-background p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">
            Heap Memory Usage
          </span>
          <span
            className={`font-mono text-lg font-bold ${sharedDeps ? "text-accent" : "text-destructive"}`}
          >
            {(totalMemory / 1024).toFixed(2)} MB
          </span>
        </div>

        <div className="mb-2 h-8 overflow-hidden rounded bg-muted">
          <div
            className={`h-full transition-all ${sharedDeps ? "bg-accent" : "bg-destructive"}`}
            style={{ width: `${Math.min((totalMemory / 2000) * 100, 100)}%` }}
          />
        </div>

        <div className="flex justify-between font-mono text-xs text-muted-foreground">
          <span>0 MB</span>
          <span
            className={
              wastedMemory > 200 && !sharedDeps ? "text-destructive" : ""
            }
          >
            {!sharedDeps && wastedMemory > 0
              ? `${wastedMemory}KB desperdicados em duplicatas`
              : "Otimizado"}
          </span>
          <span>2 MB</span>
        </div>
      </div>

      {/* MFEs Grid */}
      <div className="mb-4 grid gap-3 md:grid-cols-2">
        {mfes.map((mfe) => (
          <div
            key={mfe.id}
            className="rounded border border-border bg-background p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <div>
                <span className="font-mono text-sm font-semibold text-foreground">
                  {mfe.name}
                </span>
                <span className="ml-2 font-mono text-xs text-muted-foreground">
                  {mfe.team}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeMFE(mfe.id)}
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-1">
              {availableDeps.map((dep) => {
                const hasDep = mfe.dependencies.find(
                  (d) => d.name === dep.name,
                );
                return (
                  <button
                    key={dep.name}
                    onClick={() => toggleDependency(mfe.id, dep.name)}
                    className={`rounded px-2 py-1 font-mono text-xs transition-all ${
                      hasDep
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {dep.name}
                    {hasDep && (
                      <span className="ml-1 text-muted-foreground">
                        @{hasDep.version}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={addMFE}
        variant="outline"
        className="mb-4 w-full bg-transparent"
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar MFE
      </Button>

      {/* Duplicates Warning */}
      {!sharedDeps && duplicates.length > 0 && (
        <div className="rounded border border-destructive/30 bg-destructive/10 p-3">
          <div className="mb-2 font-mono text-xs font-semibold text-destructive">
            Duplicatas Detectadas
          </div>
          <div className="flex flex-wrap gap-2">
            {duplicates.map((dup) => (
              <span
                key={dup.name}
                className="rounded bg-destructive/20 px-2 py-1 font-mono text-xs text-destructive"
              >
                {dup.name} x{dup.count}
              </span>
            ))}
          </div>
        </div>
      )}

      {sharedDeps && (
        <div className="rounded border border-accent/30 bg-accent/10 p-3">
          <p className="font-mono text-xs text-accent">
            <strong>Module Federation ativo:</strong> Dependencias
            compartilhadas carregam apenas 1x. Economia de {wastedMemory}KB
            comparado ao modo isolado.
          </p>
        </div>
      )}
    </div>
  );
}
