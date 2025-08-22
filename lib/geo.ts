import type { Feature, FeatureCollection, Geometry } from 'geojson';
import iso from 'iso-3166-1';
import { feature as topojsonFeature } from 'topojson-client';
import type { Topology } from 'topojson-specification';
import world110m from 'world-atlas/countries-110m.json';

/**
 * Build a lookup from ISO-3166 alpha-3 (ISO3) country codes to GeoJSON Features.
 *
 * Data flow:
 * - world-atlas provides a TopoJSON of countries (countries-110m).
 * - topojson-client converts TopoJSON -> GeoJSON FeatureCollection.
 * - Each feature has a numeric id; we map that numeric code -> ISO3 via iso-3166-1.
 * - Store the result in a Map: ISO3 => GeoJSON Feature.
 *
 * Usage:
 *   const feature = getCountryFeatureByISO3('USA'); // Feature | null
 */

const topo = world110m as unknown as Topology;

// Convert TopoJSON "countries" object into a GeoJSON FeatureCollection.
const fc = topojsonFeature(
  topo,
  topo.objects.countries
) as unknown as FeatureCollection<Geometry, Record<string, never>>;

// ISO3 => GeoJSON Feature map.
const byISO3 = new Map<string, Feature<Geometry, never>>();

// Populate the map by translating numeric ids to ISO3.
for (const f of fc.features) {
  const id = String(f.id ?? '');
  const rec = iso.whereNumeric(id.padStart(3, '0'));
  if (rec?.alpha3) byISO3.set(rec.alpha3.toUpperCase(), f as never);
}

/**
 * Get the GeoJSON Feature for a country by ISO-3166 alpha-3 code.
 * Returns null if the code is not found.
 */
export function getCountryFeatureByISO3(iso3: string) {
  return byISO3.get(iso3.toUpperCase()) ?? null;
}
