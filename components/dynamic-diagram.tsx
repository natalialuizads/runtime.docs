"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface Node {
  id: string
  label: string
  icon?: LucideIcon
  color?: string
  x: number
  y: number
}

interface Edge {
  from: string
  to: string
  label?: string
  animated?: boolean
}

interface DynamicDiagramProps {
  nodes: Node[]
  edges: Edge[]
  title?: string
  className?: string
}

export function DynamicDiagram({ nodes, edges, title, className }: DynamicDiagramProps) {
  return (
    <div className={cn(
      "my-8 overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all dark:bg-secondary/10", 
      className
    )}>
      {title && (
        <div className="mb-6 px-6 pt-6 font-mono text-sm font-semibold text-primary/80 tracking-tight">
          {title}
        </div>
      )}
      
      <div className="relative h-[300px] w-full p-6">
        <svg className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="8"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="currentColor" className="text-muted-foreground/60" />
            </marker>
          </defs>
          
          {edges.map((edge, i) => {
            const fromNode = nodes.find(n => n.id === edge.from)
            const toNode = nodes.find(n => n.id === edge.to)
            
            if (!fromNode || !toNode) return null
            
            return (
              <g key={`edge-${i}`} className="group">
                <motion.line
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                  className="stroke-muted-foreground/40 transition-all group-hover:stroke-primary/50"
                  strokeWidth="2.5"
                  markerEnd="url(#arrowhead)"
                  strokeDasharray={edge.animated ? "6 6" : "0"}
                >
                  {edge.animated && (
                    <animate
                      attributeName="stroke-dashoffset"
                      from="12"
                      to="0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  )}
                </motion.line>
                {edge.label && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  >
                    <rect
                      x={`${(fromNode.x + toNode.x) / 2 - 4}%`}
                      y={`${(fromNode.y + toNode.y) / 2 - 3}%`}
                      width="8%"
                      height="16"
                      rx="4"
                      className="fill-background/80 blur-sm"
                    />
                    <text
                      x={`${(fromNode.x + toNode.x) / 2}%`}
                      y={`${(fromNode.y + toNode.y) / 2 - 1}%`}
                      className="fill-muted-foreground font-mono text-[10px] font-medium"
                      textAnchor="middle"
                    >
                      {edge.label}
                    </text>
                  </motion.g>
                )}
              </g>
            )
          })}
        </svg>

        {nodes.map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 150, delay: i * 0.05 }}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            className="absolute flex flex-col items-center gap-2"
          >
            <div 
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-2xl border bg-card p-3 shadow-md transition-all hover:scale-110 hover:shadow-lg hover:border-primary/50",
                node.color || "border-border"
              )}
            >
              {node.icon && <node.icon className="h-7 w-7 text-foreground/80" />}
            </div>
            <span className="whitespace-nowrap px-2 py-0.5 rounded-md bg-background/50 backdrop-blur-sm font-mono text-xs font-bold text-foreground/90">
              {node.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
