'use client';

import { memo, useMemo } from 'react';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { geoMercator, geoPath } from 'd3-geo';

import { getCountryFeatureByISO3 } from '@/lib/geo';

const W = 100;
const H = 100;

function upgradeFlagURL(u?: string) {
  if (!u) return u;
  return u.includes('flagcdn.com') ? u.replace('/w40/', '/w320/') : u;
}

function CountryShapeNode(props: NodeProps) {
  const { id, data, selected } = props;
  const feature = useMemo(
    () => getCountryFeatureByISO3(data.code as string),
    [data.code]
  );

  const { dAttr } = useMemo(() => {
    if (!feature) return { dAttr: '' };
    const projection = geoMercator().fitSize([W, H], feature);
    const path = geoPath(projection);

    return { dAttr: path(feature) || '' };
  }, [feature]);

  const clipId = `clip-${id}`;
  const imgHref = upgradeFlagURL(data.flag as string);

  return (
    <div
      style={{
        width: W + 30,
        height: H + 28,
        borderRadius: 12,
        border: selected
          ? '1.5px solid rgba(94,234,212,0.9)'
          : '1px solid rgba(255,255,255,0.14)',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(4px)',
        display: 'grid',
        placeItems: 'center',
        padding: 8
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.95, marginTop: 4 }}>
        {data.name as string}
      </div>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <clipPath id={clipId}>
            <path d={dAttr} />
          </clipPath>
        </defs>

        {imgHref ? (
          <image
            href={imgHref}
            x={0}
            y={0}
            width={W}
            height={H}
            preserveAspectRatio='xMidYMid slice'
            clipPath={`url(#${clipId})`}
          />
        ) : (
          <path d={dAttr} fill='currentColor' opacity={0.6} />
        )}

        <path
          d={dAttr}
          fill='none'
          stroke='rgba(255,255,255,0.9)'
          strokeWidth={0.8}
        />
      </svg>

      <Handle type='target' position={Position.Right} />
      <Handle type='source' position={Position.Left} />
    </div>
  );
}

export default memo(CountryShapeNode);
