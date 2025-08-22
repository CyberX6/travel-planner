import { DragEventHandler, useCallback, useEffect, useMemo } from 'react';
import {
  addEdge,
  Background,
  Connection,
  Controls,
  MiniMap,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow
} from '@xyflow/react';

import CountryShapeNode from '@/components/CountryShapeNode';
import { Edge } from '@/lib/graph/core';
import { toRF } from '@/lib/graph/utils';
import { useStore } from '@/lib/store';

import '@xyflow/react/dist/style.css';

export const FlowCanvas = () => {
  const { graph, upsertCountryFromDrag, connectNodes, countryShapeView } =
    useStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  const { screenToFlowPosition } = useReactFlow();
  const nodeTypes = useMemo(() => ({ country: CountryShapeNode }), []);

  const updateFlow = useCallback(() => {
    const { nodes, edges } = toRF(graph);
    setNodes(nodes);
    setEdges(edges);
  }, [graph, setEdges, setNodes]);

  useEffect(() => {
    updateFlow();
  }, [graph, setNodes, setEdges, updateFlow]);

  const onDrop: DragEventHandler<HTMLDivElement> = async e => {
    e.preventDefault();

    const payload = e?.dataTransfer?.getData('application/x-country');
    if (!payload) return;

    const position = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY
    });

    upsertCountryFromDrag(JSON.parse(payload), position);

    updateFlow();
  };

  const onDragOver: DragEventHandler<HTMLDivElement> = e => e.preventDefault();

  const onConnect = useCallback(
    (c: Connection) => {
      if (!c.source || !c.target) return;
      const result = connectNodes(c.source, c.target);

      if (result.ok) {
        setEdges(prev =>
          addEdge(
            { id: result.edgeId!, source: c.source!, target: c.target! },
            prev
          )
        );
      } else {
        alert(result.reason);
      }
    },
    [connectNodes, setEdges]
  );

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={countryShapeView ? (nodeTypes as never) : ([] as never)}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
      >
        <Controls />
        <Background />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
