import React from 'react';
import type { WeightClass, Fighter } from '../types';
import { FighterCard } from './FighterCard';

interface RankingsListProps {
  weightClass: WeightClass;
  fighters: Fighter[];
}

export const RankingsList: React.FC<RankingsListProps> = ({ weightClass, fighters }) => {
  return (
    <div className="flex-1 overflow-y-auto flex justify-center">
      <div className="w-full max-w-4xl px-6 py-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          {weightClass} Division
        </h2>
        <div className="space-y-3">
          {fighters.map((fighter) => (
            <FighterCard key={fighter.rank} fighter={fighter} />
          ))}
        </div>
      </div>
    </div>
  );
};
