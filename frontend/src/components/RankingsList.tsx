import React from 'react';
import type { Fighter } from '../types/Fighter';
import { FighterCard } from './FighterCard';

interface RankingsListProps {
  fighters: Fighter[];
  selectedWeightClass: string;
  searchQuery: string;
  onClearSearch: () => void;
}

export const RankingsList: React.FC<RankingsListProps> = ({
  fighters,
  selectedWeightClass,
  searchQuery,
  onClearSearch
}) => {
  const isPoundForPound = selectedWeightClass === 'Pound-for-Pound';

  return (
    <div className="rankings-container">
      <div className="rankings-header">
        <h2 className="rankings-title">{selectedWeightClass}</h2>
        {!isPoundForPound && <div className="rankings-subtitle">Division Rankings</div>}
      </div>

      <div className="rankings-table">
        {fighters.length === 0 ? (
          <div className="empty-state">
            <p>No fighters found matching "{searchQuery}"</p>
            <button onClick={onClearSearch} className="clear-button">
              Clear Search
            </button>
          </div>
        ) : (
          <div className="fighters-list">
            {fighters.map((fighter) => (
              <FighterCard
                key={fighter.fighter_id}
                fighter={fighter}
                showWeightClass={isPoundForPound}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
