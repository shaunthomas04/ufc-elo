export interface Fighter {
  rank: number;
  firstname: string;
  lastname: string;
  nickname: string;
  image: string;
  elo: number;
}

export type WeightClass =
  | 'Pound For Pound'
  | 'Men Heavyweight'
  | 'Men Light Heavyweight'
  | 'Men Middleweight'
  | 'Men Welterweight'
  | 'Men Lightweight'
  | 'Men Featherweight'
  | 'Men Bantamweight'
  | 'Men Flyweight'
  | 'Women Pound-for-Pound'
  | 'Women Bantamweight'
  | 'Women Flyweight'
  | 'Women Strawweight';

export interface RankingsData {
  [key: string]: Fighter[];
}
