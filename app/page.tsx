"use client";

import { SpotifySquadModel } from "@/components/interactive/spotify-squad-model";
import { PresentationMode } from "@/components/presentation-mode";
import { ArchitectureSpectrumSection } from "@/components/sections/architecture-spectrum-section";
import { BundleSection } from "@/components/sections/bundle-section";
import { ChallengeOneSection } from "@/components/sections/challenge-one-section";
import { ChallengeTwoSection } from "@/components/sections/challenge-two-section";
import { EventLoopSection } from "@/components/sections/event-loop-section";
import { HeroSection } from "@/components/sections/hero-section";
import { MFEDeepDiveSection } from "@/components/sections/mfe-deep-dive-section";
import { MFEIntegrationSection } from "@/components/sections/mfe-integration-section";
import { MFEIntroSection } from "@/components/sections/mfe-intro-section";
import { MFEPatternsSection } from "@/components/sections/mfe-patterns-section";
import { MFEProblemsSection } from "@/components/sections/mfe-problems-section";
import { ModuleFederationSection } from "@/components/sections/module-federation-section";
import { Navigation } from "@/components/sections/navigation";
import { useEffect, useRef, useState } from "react";

export default function BrowserRuntimeDocs() {
  const [activeSection, setActiveSection] = useState("intro");
  const [showNav, setShowNav] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  const sectionRefs = {
    intro: useRef<HTMLDivElement>(null),
    "event-loop": useRef<HTMLDivElement>(null),
    bundle: useRef<HTMLDivElement>(null),
    "challenge-1": useRef<HTMLDivElement>(null),
    "arch-spectrum": useRef<HTMLDivElement>(null),
    "mfe-deep-dive": useRef<HTMLDivElement>(null),
    "mfe-integration": useRef<HTMLDivElement>(null),
    "mfe-patterns": useRef<HTMLDivElement>(null),
    "spotify-model": useRef<HTMLDivElement>(null),
    "mfe-intro": useRef<HTMLDivElement>(null),
    "mfe-problems": useRef<HTMLDivElement>(null),
    "module-federation": useRef<HTMLDivElement>(null),
    "challenge-2": useRef<HTMLDivElement>(null),
  };

  const slides = [
    {
      id: "intro",
      title: "Introdução",
      content: (
        <HeroSection onStart={() => handleSectionChange("event-loop")} />
      ),
    },
    {
      id: "event-loop",
      title: "The Event Loop",
      content: <EventLoopSection />,
    },
    {
      id: "bundle",
      title: "The Cost of JavaScript",
      content: <BundleSection />,
    },
    {
      id: "challenge-1",
      title: "Debug Challenge #1",
      content: <ChallengeOneSection />,
    },
    {
      id: "arch-spectrum",
      title: "Architecture Spectrum",
      content: <ArchitectureSpectrumSection />,
    },
    {
      id: "mfe-deep-dive",
      title: "MFE Deep Dive",
      content: <MFEDeepDiveSection />,
    },
    {
      id: "mfe-integration",
      title: "Integration Runtime",
      content: <MFEIntegrationSection />,
    },
    {
      id: "mfe-patterns",
      title: "MFE Patterns",
      content: <MFEPatternsSection />,
    },
    {
      id: "spotify-model",
      title: "Spotify Squad Model",
      content: <SpotifySquadModel />,
    },
    {
      id: "mfe-intro",
      title: "Microfrontends Intro",
      content: <MFEIntroSection />,
    },
    {
      id: "mfe-problems",
      title: "The MFE Tax",
      content: <MFEProblemsSection />,
    },
    {
      id: "module-federation",
      title: "Module Federation",
      content: <ModuleFederationSection />,
    },
    {
      id: "challenge-2",
      title: "Debug Challenge #2",
      content: <ChallengeTwoSection />,
    },
  ];

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    const ref = sectionRefs[section as keyof typeof sectionRefs];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleStart = () => {
    setShowNav(true);
    handleSectionChange("event-loop");
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === "p" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        setIsPresentationMode((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id) {
              setActiveSection(id);
              if (id !== "intro") {
                setShowNav(true);
              }
            }
          }
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px -50% 0px" },
    );

    Object.entries(sectionRefs).forEach(([id, ref]) => {
      if (ref.current) {
        ref.current.id = id;
        observer.observe(ref.current);
      }
    });

    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
      observer.disconnect();
    };
  }, []);

  if (isPresentationMode) {
    return (
      <PresentationMode
        slides={slides}
        onClose={() => setIsPresentationMode(false)}
        initialSlideId={activeSection}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navigation
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <main>
        <div ref={sectionRefs.intro}>
          <HeroSection onStart={handleStart} />
        </div>

        <div className="border-t border-border bg-gradient-to-b from-secondary/30 to-transparent">
          <div ref={sectionRefs["event-loop"]}>
            <EventLoopSection />
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

        {/* Arquitetura de Frontend */}
        <div className="border-t-4 border-primary/30 bg-gradient-to-b from-primary/5 to-transparent">
          <div ref={sectionRefs["arch-spectrum"]}>
            <ArchitectureSpectrumSection />
          </div>
        </div>

        {/* FASE 1: Fundamentos - Backend vs Microfrontends */}
        <div className="border-t-4 border-primary/30 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="mx-auto max-w-4xl px-4 py-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
              <span className="font-mono text-xs text-primary">FASE 1</span>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-foreground">
              Fundamentos: Backend vs Microfrontends
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Entender microfrontends através de analogias com infraestrutura
              backend.
            </p>
          </div>

          <div ref={sectionRefs["mfe-deep-dive"]}>
            <MFEDeepDiveSection />
          </div>
        </div>

        {/* FASE 2: Padrões e Estratégias */}
        <div className="border-t-4 border-primary/30 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="mx-auto max-w-4xl px-4 py-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
              <span className="font-mono text-xs text-primary">FASE 2</span>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-foreground">
              Padrões e Estratégias
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Comunicação, autenticação e orquestração em arquiteturas
              distribuídas.
            </p>
          </div>

          <div ref={sectionRefs["mfe-integration"]}>
            <MFEIntegrationSection />
          </div>

          <div
            className="border-t border-border/50"
            ref={sectionRefs["mfe-patterns"]}
          >
            <MFEPatternsSection />
          </div>

          <div
            className="border-t border-border/50"
            ref={sectionRefs["spotify-model"]}
          >
            <SpotifySquadModel />
          </div>
        </div>

        {/* FASE 3: Implementação e Impactos */}
        <div className="border-t-4 border-accent/30 bg-gradient-to-b from-accent/5 to-transparent">
          <div className="mx-auto max-w-4xl px-4 py-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2">
              <span className="font-mono text-xs text-accent">FASE 3</span>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-foreground">
              Implementação e Impactos
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Casos de uso, Module Federation e arquitetura em produção.
            </p>
          </div>

          <div ref={sectionRefs["mfe-intro"]}>
            <MFEIntroSection />
          </div>

          <div
            className="border-t border-border/50"
            ref={sectionRefs["mfe-problems"]}
          >
            <MFEProblemsSection />
          </div>

          <div
            className="border-t border-border/50"
            ref={sectionRefs["module-federation"]}
          >
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
  );
}
