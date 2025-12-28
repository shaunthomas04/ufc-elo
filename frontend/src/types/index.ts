export interface Fighter {
  rank: number;
  name: string;
  nickname: string;
  image: string;
  elo: number;
}

export type WeightClass = 'Heavyweight' | 'Light Heavyweight' | 'Middleweight';

export interface RankingsData {
  [key: string]: Fighter[];
}
