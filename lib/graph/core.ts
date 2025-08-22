import { CountryNode } from '@/lib/graph/nodes';

export type Position = { x: number; y: number };
export type NodeType = 'country' | 'place' | 'hotel' | 'airport';

export class BaseNode<T> {
  id: string;
  type: NodeType;
  position: Position;
  data: T;
  color?: string;
  notes?: string;
  constructor(args: {
    id: string;
    type: NodeType;
    position: Position;
    data: T;
    color?: string;
    notes?: string;
  }) {
    this.id = args.id;
    this.type = args.type;
    this.position = args.position;
    this.data = args.data;
    this.color = args.color;
    this.notes = args.notes;
  }
}

export class Edge {
  id: string;
  source: string;
  target: string;
  constructor(id: string, source: string, target: string) {
    this.id = id;
    this.source = source;
    this.target = target;
  }
}

export class Graph {
  nodes = new Map<string, CountryNode | BaseNode<never>>();
  edges = new Map<string, Edge>();

  addNode(node: CountryNode | BaseNode<never>) {
    this.nodes.set(node.id, node);
    return node;
  }

  updateNodePosition(id: string, pos: Position) {
    const n = this.nodes.get(id);

    if (n) {
      n.position = pos;
    }
  }

  removeNode(id: string) {
    this.nodes.delete(id);

    for (const [eid, e] of [...this.edges]) {
      if (e.source === id || e.target === id) this.edges.delete(eid);
    }
  }

  addEdge(edge: Edge) {
    this.edges.set(edge.id, edge);
    return edge;
  }

  hasEdge(src: string, dst: string) {
    for (const e of this.edges.values()) {
      if (e.source === src && e.target === dst) return true;
    }

    return false;
  }
}
