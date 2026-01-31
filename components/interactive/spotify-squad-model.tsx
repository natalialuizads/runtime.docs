"use client"

import React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Music,
  Search,
  Library,
  Home,
  Play,
  Heart,
  Radio,
  Users,
  Settings,
  Mic2,
  ListMusic,
} from "lucide-react"

interface Squad {
  id: string
  name: string
  icon: React.ElementType
  color: string
  mfes: string[]
  apis: string[]
  database: string
  deployFreq: string
}

const squads: Squad[] = [
  {
    id: "home",
    name: "Squad Home",
    icon: Home,
    color: "primary",
    mfes: ["Home Feed", "Recently Played", "Made For You"],
    apis: ["recommendation-api", "listening-history-api"],
    database: "PostgreSQL (playlists)",
    deployFreq: "5x/dia",
  },
  {
    id: "search",
    name: "Squad Discovery",
    icon: Search,
    color: "accent",
    mfes: ["Search Bar", "Search Results", "Browse Categories"],
    apis: ["search-api", "catalog-api"],
    database: "Elasticsearch",
    deployFreq: "3x/dia",
  },
  {
    id: "library",
    name: "Squad Library",
    icon: Library,
    color: "chart-3",
    mfes: ["Your Library", "Liked Songs", "Your Playlists"],
    apis: ["library-api", "playlist-api"],
    database: "Cassandra",
    deployFreq: "2x/dia",
  },
  {
    id: "player",
    name: "Squad Player",
    icon: Play,
    color: "chart-4",
    mfes: ["Now Playing Bar", "Full Screen Player", "Queue"],
    apis: ["playback-api", "audio-api"],
    database: "Redis (state)",
    deployFreq: "1x/dia",
  },
  {
    id: "social",
    name: "Squad Social",
    icon: Users,
    color: "chart-5",
    mfes: ["Friend Activity", "Collaborative Playlists", "Share"],
    apis: ["social-api", "activity-api"],
    database: "Neo4j (graph)",
    deployFreq: "2x/dia",
  },
]

export function SpotifySquadModel() {
  const [selectedSquad, setSelectedSquad] = useState<string | null>(null)
  const [hoveredMfe, setHoveredMfe] = useState<string | null>(null)

  const selected = squads.find((s) => s.id === selectedSquad)

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="font-mono text-lg font-semibold text-foreground">
          Modelo Spotify: Squads Verticais
        </h3>
        <p className="text-sm text-muted-foreground">
          Cada squad e dona de um pedaco vertical da UI + API + Database.
          E como ter microservicos com ownership claro.
        </p>
      </div>

      {/* Spotify-like UI Mockup */}
      <div className="mb-6 overflow-hidden rounded-lg border border-border bg-background">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-2">
          <div className="flex items-center gap-4">
            <Music className="h-6 w-6 text-accent" />
            <div
              className={cn(
                "flex items-center gap-2 rounded-full bg-background px-4 py-1.5 transition-all",
                selectedSquad === "search" && "ring-2 ring-accent"
              )}
              onMouseEnter={() => setSelectedSquad("search")}
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Search</span>
            </div>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 rounded-full bg-secondary px-3 py-1",
              selectedSquad === "social" && "ring-2 ring-chart-5"
            )}
            onMouseEnter={() => setSelectedSquad("social")}
          >
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-48 border-r border-border bg-secondary/30 p-4">
            <nav className="space-y-2">
              {[
                { id: "home", icon: Home, label: "Home" },
                { id: "search", icon: Search, label: "Search" },
                { id: "library", icon: Library, label: "Your Library" },
              ].map((item) => {
                const Icon = item.icon
                const squad = squads.find((s) => s.id === item.id)
                return (
                  <button
                    key={item.id}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
                      selectedSquad === item.id
                        ? `bg-${squad?.color}/20 text-${squad?.color}`
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onMouseEnter={() => setSelectedSquad(item.id)}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                )
              })}
            </nav>

            <div className="mt-6 border-t border-border pt-4">
              <div
                className={cn(
                  "rounded-md p-2 transition-all",
                  selectedSquad === "library" && "bg-chart-3/10"
                )}
                onMouseEnter={() => setSelectedSquad("library")}
              >
                <p className="mb-2 text-xs font-semibold text-muted-foreground">Playlists</p>
                <div className="space-y-1">
                  {["Liked Songs", "Discover Weekly", "My Playlist #1"].map((pl) => (
                    <div
                      key={pl}
                      className="flex items-center gap-2 rounded px-2 py-1 text-xs text-foreground/70 hover:bg-secondary"
                    >
                      <ListMusic className="h-3 w-3" />
                      {pl}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4">
            <div
              className={cn(
                "rounded-lg p-4 transition-all",
                selectedSquad === "home" && "bg-primary/5 ring-1 ring-primary/30"
              )}
              onMouseEnter={() => setSelectedSquad("home")}
            >
              <h2 className="mb-4 text-lg font-bold text-foreground">Good evening</h2>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {["Daily Mix 1", "Release Radar", "Liked Songs", "Discover Weekly", "Rock Classics", "Chill Hits"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-md bg-secondary/50 p-2 hover:bg-secondary"
                    >
                      <div className="h-10 w-10 rounded bg-gradient-to-br from-primary/50 to-accent/50" />
                      <span className="text-xs font-medium text-foreground">{item}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Player Bar */}
        <div
          className={cn(
            "flex items-center justify-between border-t border-border bg-secondary/50 px-4 py-3 transition-all",
            selectedSquad === "player" && "bg-chart-4/10 ring-1 ring-chart-4/30"
          )}
          onMouseEnter={() => setSelectedSquad("player")}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded bg-gradient-to-br from-accent to-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Song Title</p>
              <p className="text-xs text-muted-foreground">Artist Name</p>
            </div>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-4">
            <Play className="h-8 w-8 rounded-full bg-foreground p-2 text-background" />
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Mic2 className="h-4 w-4" />
            <ListMusic className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Squad Details */}
      {selected && (
        <div className={`rounded-lg border border-${selected.color}/30 bg-${selected.color}/5 p-4`}>
          <div className="mb-4 flex items-center gap-3">
            <selected.icon className={`h-6 w-6 text-${selected.color}`} />
            <div>
              <h4 className="font-mono text-sm font-semibold text-foreground">{selected.name}</h4>
              <p className="text-xs text-muted-foreground">
                Deploy frequency: {selected.deployFreq}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="mb-2 font-mono text-xs text-muted-foreground">MICROFRONTENDS</p>
              <ul className="space-y-1">
                {selected.mfes.map((mfe) => (
                  <li key={mfe} className="text-sm text-foreground">
                    {mfe}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 font-mono text-xs text-muted-foreground">APIS (Backend)</p>
              <ul className="space-y-1">
                {selected.apis.map((api) => (
                  <li key={api} className="font-mono text-sm text-foreground">
                    {api}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 font-mono text-xs text-muted-foreground">DATABASE</p>
              <p className="font-mono text-sm text-foreground">{selected.database}</p>
            </div>
          </div>
        </div>
      )}

      {!selected && (
        <p className="text-center text-sm text-muted-foreground">
          Passe o mouse sobre as areas da UI para ver qual Squad e responsavel
        </p>
      )}

      {/* Backend Analogy */}
      <div className="mt-6 rounded-lg bg-secondary/30 p-4">
        <h4 className="mb-3 font-mono text-sm font-semibold text-foreground">
          Analogia Backend: Domain-Driven Design
        </h4>
        <p className="text-sm text-muted-foreground">
          Cada Squad e um <strong>Bounded Context</strong>. Eles tem ownership completo:
          UI + API + Database + Deploy Pipeline. Comunicacao entre Squads acontece via
          contratos (APIs) e eventos, nunca acesso direto ao banco do outro.
        </p>
        <div className="mt-4 grid grid-cols-5 gap-2 text-center">
          {squads.map((squad) => (
            <div key={squad.id} className="rounded bg-background p-2">
              <squad.icon className={`mx-auto h-4 w-4 text-${squad.color}`} />
              <p className="mt-1 text-xs text-muted-foreground">{squad.deployFreq}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Total: ~13 deploys/dia independentes
        </p>
      </div>
    </div>
  )
}
