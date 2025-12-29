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
      <div className="w-[80%] max-w-[1400px] px-6 py-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-8 text-center">
          {weightClass} Division
        </h2>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-8 justify-items-center">
          {fighters.map((fighter) => (
            <FighterCard key={fighter.rank} fighter={fighter} />
          ))}
        </div>
      </div>
    </div>
  );
};
