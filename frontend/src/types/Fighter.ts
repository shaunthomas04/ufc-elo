export interface Fighter {
  rank: number;
  fighter_id: number;
  name: string;
  profile_image: string;
  elo: number;
  weight_class?: string;
}

export interface RankingData {
  rating_date: string;
  weight_classes: Record<string, Fighter[]>;
  pound_for_pound: Fighter[];
}

export interface MonthOption {
  value: string;
  label: string;
}