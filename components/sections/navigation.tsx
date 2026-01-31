"use client"

import { cn } from "@/lib/utils"
import { Terminal, Cpu, Boxes, Layers, Zap, AlertTriangle, Link2, GitBranch, Package } from "lucide-react"

interface NavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const sections = [
  { id: "intro", label: "Intro", icon: Terminal },
  { id: "event-loop", label: "Event Loop", icon: Cpu },
  { id: "crp", label: "Critical Path", icon: Layers },
  { id: "bundle", label: "Bundle Cost", icon: Zap },
  { id: "challenge-1", label: "Desafio #1", icon: AlertTriangle },
  { id: "arch-spectrum", label: "Arquiteturas", icon: GitBranch },
  { id: "mfe-intro", label: "MFE Intro", icon: Boxes },
  { id: "mfe-deep-dive", label: "MFE Deep Dive", icon: Package },
  { id: "mfe-problems", label: "MFE Problems", icon: AlertTriangle },
  { id: "module-federation", label: "Module Fed", icon: Link2 },
  { id: "challenge-2", label: "Desafio #2", icon: AlertTriangle },
]

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center gap-4 overflow-x-auto py-3 scrollbar-hide">
          <div className="flex shrink-0 items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            <span className="font-mono text-sm font-bold text-foreground">runtime.docs</span>
          </div>
          
          <div className="h-6 w-px bg-border" />
          
          <div className="flex gap-1">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => onSectionChange(section.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs transition-colors",
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{section.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
