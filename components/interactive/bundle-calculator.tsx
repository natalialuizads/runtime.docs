"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"

const devices = [
  { name: "MacBook Pro M3", cpuMultiplier: 1, networkMultiplier: 1, icon: "laptop" },
  { name: "iPhone 15 Pro", cpuMultiplier: 1.5, networkMultiplier: 1.2, icon: "phone" },
  { name: "Pixel 7", cpuMultiplier: 2, networkMultiplier: 1.5, icon: "phone" },
  { name: "Android Mid-range", cpuMultiplier: 5, networkMultiplier: 2, icon: "phone" },
  { name: "Android Low-end", cpuMultiplier: 10, networkMultiplier: 3, icon: "phone" },
]

const connections = [
  { name: "5G / Fiber", speed: 100, latency: 10 },
  { name: "4G LTE", speed: 25, latency: 50 },
  { name: "3G", speed: 2, latency: 200 },
  { name: "2G / Edge", speed: 0.3, latency: 500 },
]

export function BundleCalculator() {
  const [bundleSize, setBundleSize] = useState(500)
  const [selectedDevice, setSelectedDevice] = useState(0)
  const [selectedConnection, setSelectedConnection] = useState(0)

  const device = devices[selectedDevice]
  const connection = connections[selectedConnection]

  // Calculos baseados em metricas reais do V8
  const baseParseCost = 0.1 // ms por KB
  const baseCompileCost = 0.15 // ms por KB
  const baseExecuteCost = 0.05 // ms por KB

  const downloadTime = (bundleSize / connection.speed) * 1000 * device.networkMultiplier + connection.latency
  const parseTime = bundleSize * baseParseCost * device.cpuMultiplier
  const compileTime = bundleSize * baseCompileCost * device.cpuMultiplier
  const executeTime = bundleSize * baseExecuteCost * device.cpuMultiplier
  
  const totalCPU = parseTime + compileTime + executeTime
  const totalTime = downloadTime + totalCPU

  const getHealthColor = (time: number) => {
    if (time < 1000) return "text-accent"
    if (time < 3000) return "text-chart-4"
    return "text-destructive"
  }

  const getHealthLabel = (time: number) => {
    if (time < 1000) return "Excelente"
    if (time < 2000) return "Bom"
    if (time < 3000) return "Aceitavel"
    if (time < 5000) return "Ruim"
    return "Critico"
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-mono text-sm font-semibold text-primary">Bundle Cost Calculator</h3>
        <div className={`rounded-full px-3 py-1 font-mono text-xs ${getHealthColor(totalTime)} bg-current/10`}>
          {getHealthLabel(totalTime)}
        </div>
      </div>

      {/* Bundle Size Slider */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">Bundle Size (gzipped)</span>
          <span className="font-mono text-sm font-semibold text-foreground">{bundleSize} KB</span>
        </div>
        <Slider
          value={[bundleSize]}
          onValueChange={([value]) => setBundleSize(value)}
          min={50}
          max={2000}
          step={50}
          className="w-full"
        />
        <div className="mt-1 flex justify-between font-mono text-xs text-muted-foreground">
          <span>50KB (ideal)</span>
          <span>500KB (medio)</span>
          <span>2MB (pesado)</span>
        </div>
      </div>

      {/* Device Selection */}
      <div className="mb-6">
        <div className="mb-2 font-mono text-xs text-muted-foreground">Dispositivo do Usuario</div>
        <div className="grid grid-cols-5 gap-1">
          {devices.map((d, i) => (
            <button
              key={d.name}
              onClick={() => setSelectedDevice(i)}
              className={`rounded border p-2 text-center transition-all ${
                selectedDevice === i 
                  ? "border-primary bg-primary/10" 
                  : "border-border bg-background hover:border-muted-foreground"
              }`}
            >
              <div className="font-mono text-xs text-foreground">{d.name.split(" ")[0]}</div>
              <div className="font-mono text-xs text-muted-foreground">{d.cpuMultiplier}x CPU</div>
            </button>
          ))}
        </div>
      </div>

      {/* Connection Selection */}
      <div className="mb-6">
        <div className="mb-2 font-mono text-xs text-muted-foreground">Conexao</div>
        <div className="grid grid-cols-4 gap-1">
          {connections.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setSelectedConnection(i)}
              className={`rounded border p-2 text-center transition-all ${
                selectedConnection === i 
                  ? "border-primary bg-primary/10" 
                  : "border-border bg-background hover:border-muted-foreground"
              }`}
            >
              <div className="font-mono text-xs text-foreground">{c.name}</div>
              <div className="font-mono text-xs text-muted-foreground">{c.speed} Mbps</div>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="rounded border border-border bg-background p-4">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <div className="font-mono text-xs text-muted-foreground">Network I/O</div>
            <div className="font-mono text-lg text-chart-1">{Math.round(downloadTime)}ms</div>
          </div>
          <div>
            <div className="font-mono text-xs text-muted-foreground">CPU (Parse+Compile+Exec)</div>
            <div className="font-mono text-lg text-chart-3">{Math.round(totalCPU)}ms</div>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-20 font-mono text-xs text-muted-foreground">Download</span>
            <div className="flex-1 rounded bg-muted">
              <div 
                className="h-4 rounded bg-chart-1 transition-all"
                style={{ width: `${Math.min((downloadTime / totalTime) * 100, 100)}%` }}
              />
            </div>
            <span className="w-16 text-right font-mono text-xs text-foreground">{Math.round(downloadTime)}ms</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-20 font-mono text-xs text-muted-foreground">Parse</span>
            <div className="flex-1 rounded bg-muted">
              <div 
                className="h-4 rounded bg-chart-4 transition-all"
                style={{ width: `${Math.min((parseTime / totalTime) * 100, 100)}%` }}
              />
            </div>
            <span className="w-16 text-right font-mono text-xs text-foreground">{Math.round(parseTime)}ms</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-20 font-mono text-xs text-muted-foreground">Compile</span>
            <div className="flex-1 rounded bg-muted">
              <div 
                className="h-4 rounded bg-chart-3 transition-all"
                style={{ width: `${Math.min((compileTime / totalTime) * 100, 100)}%` }}
              />
            </div>
            <span className="w-16 text-right font-mono text-xs text-foreground">{Math.round(compileTime)}ms</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-20 font-mono text-xs text-muted-foreground">Execute</span>
            <div className="flex-1 rounded bg-muted">
              <div 
                className="h-4 rounded bg-primary transition-all"
                style={{ width: `${Math.min((executeTime / totalTime) * 100, 100)}%` }}
              />
            </div>
            <span className="w-16 text-right font-mono text-xs text-foreground">{Math.round(executeTime)}ms</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="font-mono text-sm text-muted-foreground">Tempo Total ate Interativo:</span>
          <span className={`font-mono text-2xl font-bold ${getHealthColor(totalTime)}`}>
            {(totalTime / 1000).toFixed(2)}s
          </span>
        </div>
      </div>

      <div className="mt-4 rounded bg-muted/50 p-3">
        <p className="font-mono text-xs text-muted-foreground">
          <strong className="text-foreground">Insight:</strong> Mesmo com 5G rapido, 
          um Android mid-range gasta <strong className="text-destructive">{device.cpuMultiplier}x mais tempo</strong> em CPU 
          do que seu MacBook de desenvolvimento. Network e apenas parte do problema.
        </p>
      </div>
    </div>
  )
}
