import { Edge as RFEdge, Node as RFNode } from '@xyflow/react';
import Image from 'next/image';

import { Graph } from './core';

/**
 * Convert a domain Graph into React Flow data.
 * - Nodes: preserves id, position, type; spreads data and sets data.label
 *   to a small JSX label (optional flag image + name or id).
 * - Edges: copies id, source, target; sets animated=true and a thicker stroke.
 * Use the returned { nodes, edges } with <ReactFlow nodes={} edges={}/> to render.
 */
export function toRF(g: Graph) {
  const nodes: RFNode[] = [...g.nodes.values()].map(n => ({
    id: n.id,
    position: n.position,
    type: n.type,
    data: {
      ...n.data,
      label: (
        <div className='flex items-center gap-2'>
          {n.data?.flag ? (
            <Image
              src={n.data.flag}
              alt={n.data.name}
              width={24}
              height={16}
              style={{ borderRadius: 4 }}
            />
          ) : null}
          <span className='text-xs'>{n.data?.name ?? n.id}</span>
        </div>
      )
    }
  }));
  const edges: RFEdge[] = [...g.edges.values()].map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    animated: true,
    style: { strokeWidth: 2 }
  }));

  return { nodes, edges };
}

/**
 * Detects whether the directed graph contains at least one cycle.
 *
 * How it works:
 * - Builds an adjacency list from the graph's edges.
 * - Performs a depth-first search (DFS) with a three-color marking scheme:
 *   WHITE (unvisited), GRAY (in recursion stack), BLACK (fully explored).
 *   Encountering a GRAY neighbor indicates a back edge, which implies a cycle.
 *
 * @param g Graph instance whose nodes and edges are interpreted as a directed graph
 * @returns true if a cycle exists; otherwise false
 *
 * Complexity:
 * - Time: O(V + E), where V is the number of nodes and E is the number of edges
 * - Space: O(V + E), including recursion stack up to O(V)
 *
 * Notes:
 * - This checks for cycles in a directed graph.
 * - The adjacency list is rebuilt on each call, which is straightforward and suitable for
 *   validation during edge insertions.
 */

export function hasCycle(g: Graph) {
  const WHITE = 0;
  const GRAY = 1;
  const BLACK = 2;
  const color: Record<string, number> = {};
  for (const id of g.nodes.keys()) color[id] = WHITE;

  const adj: Record<string, string[]> = {};
  for (const id of g.nodes.keys()) adj[id] = [];
  for (const e of g.edges.values()) adj[e.source].push(e.target);

  const dfs = (u: string) => {
    color[u] = GRAY;

    for (const v of adj[u]) {
      if (color[v] === WHITE) {
        if (dfs(v)) return true;
      } else if (color[v] === GRAY) {
        return true;
      }
    }

    color[u] = BLACK;
    return false;
  };

  for (const id of g.nodes.keys()) {
    if (color[id] === WHITE && dfs(id)) return true;
  }

  return false;
}
