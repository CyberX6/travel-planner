'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

import { searchCountries } from '@/lib/countries';

export default function Sidebar() {
  const [q, setQ] = useState('');
  const { data } = useQuery({
    queryKey: ['countries', q],
    queryFn: () => searchCountries(q),
    staleTime: 60_000
  });

  return (
    <aside className='card space-y-3' onDragOver={e => e.preventDefault()}>
      <div className='text-sm font-medium'>Search & Drag</div>
      <input className='input' placeholder='Search country' value={q} onChange={e => setQ(e.target.value)} />
      <div className='grid gap-2 max-h-[60vh] overflow-auto pr-1'>
        {data?.map(c => (
          <button
            key={c.cca3}
            className='flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 text-left'
            draggable
            onDragStart={e => {
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('application/x-country', JSON.stringify(c));
            }}
          >
            <Image src={c.flag} width={28} height={20} alt={c.name} className='rounded' />
            <div className='text-sm'>
              <div className='font-medium'>{c.name}</div>
              <div className='opacity-70 text-xs'>{c.region}</div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
