"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import ReactFlow, {
  Node as FlowNode,
  Edge as FlowEdge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

interface Node {
  id: string;
  label: string;
  icon?: LucideIcon;
  color?: string;
  x: number;
  y: number;
}

interface Edge {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
}

interface DynamicDiagramProps {
  nodes: Node[];
  edges: Edge[];
  title?: string;
  className?: string;
}

export function DynamicDiagram({
  nodes: inputNodes,
  edges: inputEdges,
  title,
  className,
}: DynamicDiagramProps) {
  // Convert input nodes to React Flow nodes
  const flowNodes: FlowNode[] = inputNodes.map((node) => ({
    id: node.id,
    data: {
      label: node.label,
    },
    position: {
      x: (node.x / 100) * 1000,
      y: (node.y / 100) * 500,
    },
    draggable: false,
  }));

  // Convert input edges to React Flow edges
  const flowEdges: FlowEdge[] = inputEdges.map((edge, i) => ({
    id: `${edge.from}-${edge.to}-${i}`,
    source: edge.from,
    target: edge.to,
    type: "straight",
    animated: edge.animated || false,
    label: edge.label || "",
    style: {
      strokeWidth: 2,
    },
  }));

  const [nodes] = useNodesState(flowNodes);
  const [edges] = useEdgesState(flowEdges);

  return (
    <div
      className={cn(
        "my-8 overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all dark:bg-secondary/10",
        className,
      )}
    >
      {title && (
        <div className="mb-4 px-6 pt-6 font-mono text-sm font-semibold text-primary/80 tracking-tight">
          {title}
        </div>
      )}

      <div className="relative h-[500px] w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          minZoom={0.5}
          maxZoom={2}
        >
          <Background gap={20} size={1} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
