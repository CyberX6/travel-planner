import { BaseNode, Edge, Graph } from './core';
import { CountryNode } from './nodes';

export type GraphJSON = {
  nodes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    data: never;
    color?: string;
    notes?: string;
  }>;
  edges: Array<{ id: string; source: string; target: string }>;
};

export class GraphSerializer {
  static serialize(g: Graph): GraphJSON {
    return {
      nodes: [...g.nodes.values()].map(n => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: n.data as never,
        color: n.color,
        notes: n.notes
      })),
      edges: [...g.edges.values()].map(e => ({
        id: e.id,
        source: e.source,
        target: e.target
      }))
    };
  }

  static deserialize(j: GraphJSON): Graph {
    const g = new Graph();

    for (const n of j.nodes) {
      let node: CountryNode;
      if (n.type === 'country')
        node = new CountryNode({
          id: n.id,
          position: n.position,
          data: n.data,
          color: n.color,
          notes: n.notes
        });
      else
        node = new BaseNode({
          id: n.id,
          type: n.type as never,
          position: n.position,
          data: n.data,
          color: n.color,
          notes: n.notes
        });
      g.addNode(node);
    }

    for (const e of j.edges) {
      g.addEdge(new Edge(e.id, e.source, e.target));
    }

    return g;
  }
}
