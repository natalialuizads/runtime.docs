"use client";

import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Boxes,
  Cpu,
  GitBranch,
  Layout,
  Link2,
  Moon,
  Package,
  Sun,
  Terminal,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  { id: "intro", label: "Intro", icon: Terminal },
  { id: "event-loop", label: "Event Loop", icon: Cpu },
  { id: "bundle", label: "Bundle Cost", icon: Zap },
  { id: "challenge-1", label: "Desafio #1", icon: AlertTriangle },
  { id: "arch-spectrum", label: "Arquiteturas", icon: GitBranch },
  { id: "mfe-deep-dive", label: "MFE Deep Dive", icon: Package },
  { id: "mfe-communication", label: "Comunicacao", icon: Link2 },
  { id: "mfe-integration", label: "Integracao", icon: Boxes },
  { id: "composition-strategies", label: "Composicao", icon: Layout },
  { id: "server-driven-ui", label: "SDUI", icon: Zap },
  { id: "auth", label: "Auth", icon: Layout },
  { id: "mfe-patterns", label: "Padroes", icon: Layout },
  { id: "spotify-model", label: "Spotify", icon: Boxes },
  { id: "vertical-examples", label: "Exemplos", icon: Boxes },
  { id: "mfe-intro", label: "MFE != MS", icon: Cpu },
  { id: "module-federation", label: "Module Fed", icon: Link2 },
  { id: "challenge-2", label: "Challenge", icon: AlertTriangle },
];

export function Navigation({
  activeSection,
  onSectionChange,
}: NavigationProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            <div className="flex shrink-0 items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              <span className="font-mono text-sm font-bold text-foreground">
                runtime.docs
              </span>
            </div>

            <div className="h-6 w-px bg-border shrink-0" />

            <div className="flex gap-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => onSectionChange(section.id)}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs transition-colors",
                      activeSection === section.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background/50 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
