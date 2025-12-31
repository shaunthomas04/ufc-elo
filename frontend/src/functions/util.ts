import type { Fighter } from "../types";

export type RawRankings = Record<string, any[]>; 
export type NormalizedRankings = Record<string, Fighter[]>;

export function mapRankingsToFighterType(raw: RawRankings): NormalizedRankings {
  const normalized: NormalizedRankings = {};

  for (const [division, fighters] of Object.entries(raw)) {
    normalized[division] = fighters.map((f, index) => ({
      rank: index + 1,
      firstname: f.first_name,
      lastname: f.last_name,
      nickname: f.nickname ?? "",
      image: f.image ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvBa8LtMxlhvgG86KBCX0SEpHfYhmlt0gsVw&s",
      elo: f.elo_score
    }));
  }

  return normalized;
}


export async function apiGet<T = unknown>(endpoint: string): Promise<T> {
  const res = await fetch(endpoint);

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}
