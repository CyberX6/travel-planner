'use client';
import { useRef } from 'react';
import {
  FileDown,
  FileUp,
  RefreshCcw,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

import { useStore } from '@/lib/store';
import { downloadJson } from '@/lib/utils';

export default function Topbar() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { graph, resetGraph, setGraph, countryShapeView, setCountryShapeView } =
    useStore();

  const toggle = () => {
    setCountryShapeView();
  };

  return (
    <div className='card flex items-center justify-between'>
      <div className='text-sm opacity-80'>Travel Route Builder</div>
      <div className='flex items-center gap-2'>
        <button
          className='btn flex flex-col items-center'
          onClick={() => toggle()}
        >
          {countryShapeView ? (
            <ToggleRight size={16} />
          ) : (
            <ToggleLeft size={16} />
          )}
          Toggle View
        </button>
        <button
          className='btn flex flex-col items-center'
          onClick={() => resetGraph()}
        >
          <RefreshCcw size={16} />
          Reset
        </button>
        <button
          className='btn flex flex-col items-center'
          onClick={async () => {
            const { GraphSerializer } = await import('@/lib/graph/serializer');
            downloadJson(GraphSerializer.serialize(graph), 'route.json');
          }}
        >
          <FileDown size={16} />
          Export
        </button>
        <input
          ref={fileRef}
          type='file'
          accept='application/json'
          className='hidden'
          onChange={async e => {
            const f = e.target.files?.[0];
            if (!f) return;
            const text = await f.text();

            try {
              setGraph(
                (
                  await import('@/lib/graph/serializer')
                ).GraphSerializer.deserialize(JSON.parse(text))
              );
            } catch (_err) {
              alert(`Error: ${_err}`);
            }

            e.currentTarget.value = '';
          }}
        />
        <button
          className='btn flex flex-col items-center'
          onClick={() => fileRef.current?.click()}
        >
          <FileUp size={16} />
          Import
        </button>
      </div>
    </div>
  );
}
