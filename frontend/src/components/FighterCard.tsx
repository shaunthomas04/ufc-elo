import React from 'react';
import type { Fighter } from '../types';

interface FighterCardProps {
  fighter: Fighter;
}

export const FighterCard: React.FC<FighterCardProps> = ({ fighter }) => {
  return (
    <div className="group relative w-80 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl">
      
      {/* Top section: Image + overlays */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={fighter.image}
          alt={fighter.firstname}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Rank (top-left) */}
        <div className="absolute top-3 left-3 w-10 h-10 bg-black/75 text-white text-lg font-bold rounded-full flex items-center justify-center backdrop-blur-sm transition-transform duration-200 group-hover:scale-105">
          {fighter.rank}
        </div>

        {/* ELO (bottom-right) */}
        <div className="absolute bottom-3 right-3 bg-green-600 text-white text-sm font-bold px-6 py-6  shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-green-500 hover:scale-105 hover:shadow-lg hover:shadow-green-500/40">
          ELO {fighter.elo}
        </div>
      </div>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-200 text-center">
        <div className="font-bold text-lg text-gray-900">
          {fighter.firstname}{' '}
          {fighter.nickname && (
            <span className="text-gray-500 font-normal italic text-base">
              "{fighter.nickname}"{' '}
            </span>
          )}
          {fighter.lastname}
        </div>
      </div>
    </div>
  );
};
