export type CountryLite = {
  name: string;
  cca3: string;
  flag: string;
  region: string;
};

type Country = {
  name: { common: string };
  cca3: string;
  flags: { png: string; svg: string };
  region: string;
};

export async function searchCountries(q: string): Promise<CountryLite[]> {
  if (!q || q.trim().length < 1) return [];

  const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(q)}?fields=name,cca3,flags,region`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) return [];

  const raw = await res.json();

  return raw.map((r: Country) => ({
    name: r.name.common,
    cca3: r.cca3,
    flag: r.flags?.png || r.flags?.svg,
    region: r.region,
  }));
}
