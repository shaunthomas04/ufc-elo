import React from 'react';
import type { Fighter } from '../types/Fighter';

interface FighterCardProps {
  fighter: Fighter;
  showWeightClass?: boolean;
}

export const FighterCard: React.FC<FighterCardProps> = ({ 
  fighter, 
  showWeightClass = false 
}) => {
  return (
    <div className="fighter-row">
      <div className="fighter-rank">{fighter.rank}</div>
      <div className="fighter-info">
        <img 
          src={fighter.profile_image} 
          alt={fighter.name}
          className="fighter-avatar"
        />
        <div className="fighter-details">
          <div className="fighter-name">{fighter.name}</div>
          {showWeightClass && fighter.weight_class && (
            <div className="fighter-division">{fighter.weight_class}</div>
          )}
        </div>
      </div>
      <div className="fighter-elo">{fighter.elo.toFixed(0)}</div>
    </div>
  );
};
