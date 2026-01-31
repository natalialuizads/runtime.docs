"use client"

import { useState, useRef, useEffect } from "react"
import { Navigation } from "@/components/sections/navigation"
import { HeroSection } from "@/components/sections/hero-section"
import { EventLoopSection } from "@/components/sections/event-loop-section"
import { CRPSection } from "@/components/sections/crp-section"
import { BundleSection } from "@/components/sections/bundle-section"
import { ChallengeOneSection } from "@/components/sections/challenge-one-section"
import { MFEIntroSection } from "@/components/sections/mfe-intro-section"
import { MFEProblemsSection } from "@/components/sections/mfe-problems-section"
import { ModuleFederationSection } from "@/components/sections/module-federation-section"
import { ChallengeTwoSection } from "@/components/sections/challenge-two-section"
import { ArchitectureSpectrumSection } from "@/components/sections/architecture-spectrum-section"
import { MFEDeepDiveSection } from "@/components/sections/mfe-deep-dive-section"

export default function BrowserRuntimeDocs() {
  const [activeSection, setActiveSection] = useState("intro")
  const [showNav, setShowNav] = useState(false)

  const sectionRefs = {
    intro: useRef<HTMLDivElement>(null),
    "event-loop": useRef<HTMLDivElement>(null),
    crp: useRef<HTMLDivElement>(null),
    bundle: useRef<HTMLDivElement>(null),
    "challenge-1": useRef<HTMLDivElement>(null),
    "arch-spectrum": useRef<HTMLDivElement>(null),
    "mfe-intro": useRef<HTMLDivElement>(null),
    "mfe-deep-dive": useRef<HTMLDivElement>(null),
    "mfe-problems": useRef<HTMLDivElement>(null),
    "module-federation": useRef<HTMLDivElement>(null),
    "challenge-2": useRef<HTMLDivElement>(null),
  }

  const handleSectionChange = (section: string) => {
    setActiveSection(section)
    const ref = sectionRefs[section as keyof typeof sectionRefs]
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleStart = () => {
    setShowNav(true)
    handleSectionChange("event-loop")
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            if (id) {
              setActiveSection(id)
              if (id !== "intro") {
                setShowNav(true)
              }
            }
          }
        })
      },
      { threshold: 0.3, rootMargin: "-80px 0px -50% 0px" }
    )

    Object.entries(sectionRefs).forEach(([id, ref]) => {
      if (ref.current) {
        ref.current.id = id
        observer.observe(ref.current)
      }
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showNav && (
        <Navigation
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
      )}

      <main>
        <div ref={sectionRefs.intro}>
          <HeroSection onStart={handleStart} />
        </div>

        <div className="border-t border-border bg-gradient-to-b from-secondary/30 to-transparent">
          <div ref={sectionRefs["event-loop"]}>
            <EventLoopSection />
          </div>

          <div className="border-t border-border/50" ref={sectionRefs.crp}>
            <CRPSection />
          </div>

          <div className="border-t border-border/50" ref={sectionRefs.bundle}>
            <BundleSection />
          </div>

          <div
            className="border-t-2 border-destructive/30 bg-destructive/5"
            ref={sectionRefs["challenge-1"]}
          >
            <ChallengeOneSection />
          </div>
        </div>

        {/* FASE 2: Arquiteturas de Frontend */}
        <div className="border-t-4 border-primary/30 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="mx-auto max-w-4xl px-4 py-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
              <span className="font-mono text-xs text-primary">FASE 2</span>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-foreground">
              Arquiteturas de Frontend
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              SPA, SSR, WebView, Edge... Cada arquitetura e um trade-off. Vamos traduzir para linguagem de infra.
            </p>
          </div>

          <div ref={sectionRefs["arch-spectrum"]}>
            <ArchitectureSpectrumSection />
          </div>
        </div>

        {/* FASE 3: Microfrontends Deep Dive */}
        <div className="border-t-4 border-accent/30 bg-gradient-to-b from-accent/5 to-transparent">
          <div className="mx-auto max-w-4xl px-4 py-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2">
              <span className="font-mono text-xs text-accent">FASE 3</span>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-foreground">
              Microfrontends: Sistemas Distribuidos no Client
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              O protagonista. Microservicos para o Frontend, com todas as dores e glorias.
            </p>
          </div>

          <div ref={sectionRefs["mfe-intro"]}>
            <MFEIntroSection />
          </div>

          <div className="border-t border-border/50" ref={sectionRefs["mfe-deep-dive"]}>
            <MFEDeepDiveSection />
          </div>

          <div className="border-t border-border/50" ref={sectionRefs["mfe-problems"]}>
            <MFEProblemsSection />
          </div>

          <div className="border-t border-border/50" ref={sectionRefs["module-federation"]}>
            <ModuleFederationSection />
          </div>

          <div
            className="border-t-2 border-destructive/30 bg-destructive/5"
            ref={sectionRefs["challenge-2"]}
          >
            <ChallengeTwoSection />
          </div>
        </div>

        <footer className="border-t border-border bg-card py-12">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <p className="font-mono text-sm text-muted-foreground">
              runtime.docs - Browser Infrastructure for Backend Engineers
            </p>
            <p className="mt-2 text-xs text-muted-foreground/60">
              Analogias de infraestrutura para desmistificar o frontend
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
