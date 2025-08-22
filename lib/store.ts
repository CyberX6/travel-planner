import { create } from 'zustand';

import rulesConfig from '../config/blocked-routes.json';

import { Edge, Graph } from './graph/core';
import { CountryNode } from './graph/nodes';
import { isBlocked, RouteRules } from './graph/rules';
import { GraphSerializer } from './graph/serializer';
import { hasCycle } from './graph/utils';

export type Store = {
  graph: Graph;
  rules: RouteRules | null;
  setGraph: (g: Graph) => void;
  upsertCountryFromDrag: (
    c: { cca3: string; name: string; flag: string; region?: string },
    position: { x: number; y: number }
  ) => void;
  connectNodes: (
    source: string,
    target: string
  ) => { ok: boolean; reason?: string; edgeId?: string };
  updateNodePosition: (id: string, pos: { x: number; y: number }) => void;
  resetGraph: () => void;
  countryShapeView: boolean;
  setCountryShapeView: () => void;
};

const STORAGE_KEY = 'travel-route-graph';

function loadInitial(): { graph: Graph; rules: RouteRules | null } {
  if (typeof window === 'undefined') return { graph: new Graph(), rules: null };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const g = raw ? GraphSerializer.deserialize(JSON.parse(raw)) : new Graph();
    const rules = null;

    return { graph: g, rules };
  } catch {
    return { graph: new Graph(), rules: null };
  }
}

export const useStore = create<Store>((set, get) => ({
  ...loadInitial(),
  setGraph: g => {
    set({ graph: g });
    if (typeof window !== 'undefined')
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(GraphSerializer.serialize(g))
      );
  },
  upsertCountryFromDrag: (c, position) => {
    const graph = get().graph;
    const id = c.cca3;

    if (!graph.nodes.has(id)) {
      graph.addNode(
        new CountryNode({
          id,
          position,
          data: { code: c.cca3, name: c.name, flag: c.flag, region: c.region }
        })
      );
    } else {
      graph.updateNodePosition(id, position);
    }

    set({ graph });
    if (typeof window !== 'undefined')
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(GraphSerializer.serialize(graph))
      );
  },
  connectNodes: (source, target) => {
    const g = get().graph;
    const rules = rulesConfig;

    if (source === target)
      return { ok: false, reason: 'Self-loop not allowed' };
    if (isBlocked(rules, source, target))
      return { ok: false, reason: 'Route blocked by rules' };
    if (g.hasEdge(source, target))
      return { ok: false, reason: 'Edge already exists' };
    const id = `${source}->${target}`;
    g.addEdge(new Edge(id, source, target));

    if (!rules?.allowLoops && hasCycle(g)) {
      g.edges.delete(id);
      return { ok: false, reason: 'Cycle prevention: would create a loop' };
    }

    set({ graph: g });
    if (typeof window !== 'undefined')
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(GraphSerializer.serialize(g))
      );
    return { ok: true, edgeId: id };
  },
  updateNodePosition: (id, pos) => {
    const g = get().graph;
    g.updateNodePosition(id, pos);
    set({ graph: g });
    if (typeof window !== 'undefined')
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(GraphSerializer.serialize(g))
      );
  },
  resetGraph: () => {
    const g = new Graph();
    set({ graph: g });
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
  },
  setCountryShapeView: () => {
    set({ countryShapeView: !get().countryShapeView });
  },
  countryShapeView: true
}));
