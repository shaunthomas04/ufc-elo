import React from 'react';
import type { Fighter } from '../types';

interface FighterCardProps {
  fighter: Fighter;
}

export const FighterCard: React.FC<FighterCardProps> = ({ fighter }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded">
      <div className="text-lg font-semibold text-gray-500 w-8">
        #{fighter.rank}
      </div>
      <img
        src={fighter.image}
        alt={fighter.name}
        className="w-16 h-16 rounded-full object-cover bg-gray-200"
      />
      <div className="flex-1">
        <div className="font-semibold text-gray-900">{fighter.name}</div>
        {fighter.nickname && (
          <div className="text-sm text-gray-500">"{fighter.nickname}"</div>
        )}
      </div>
      <div className="text-right">
        <div className="text-xs text-gray-500 uppercase">ELO</div>
        <div className="text-lg font-semibold text-gray-900">{fighter.elo}</div>
      </div>
    </div>
  );
};