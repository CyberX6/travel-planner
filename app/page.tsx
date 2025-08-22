'use client';
import React, { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactFlowProvider } from '@xyflow/react';

import { FlowCanvas } from '@/components/FlowCanvas';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export default function Page() {
  const qc = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={qc}>
      <div className='grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 p-4 min-h-screen'>
        <div className='lg:col-span-2'>
          <Topbar />
        </div>
        <Sidebar />
        <div className='space-y-4'>
          <ReactFlowProvider>
            <FlowCanvas />
          </ReactFlowProvider>
        </div>
      </div>
    </QueryClientProvider>
  );
}
