import React from 'react';
import { Search, Trophy } from 'lucide-react';
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

  const containerStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  };

  const headerStyle: React.CSSProperties = {
    padding: '32px',
    background: isPoundForPound
      ? 'linear-gradient(135deg, #fbbf24 0%, #dc2626 50%, #ea580c 100%)'
      : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
  };

  const headerContentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: '900',
    color: '#fff'
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    marginTop: '4px'
  };

  const contentStyle: React.CSSProperties = {
    padding: '24px',
    background: 'linear-gradient(180deg, #f8fafc 0%, #fff 100%)'
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '80px 20px'
  };

  const emptyIconContainerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    background: '#f1f5f9',
    borderRadius: '50%',
    marginBottom: '24px'
  };

  const emptyTitleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: '8px'
  };

  const emptyTextStyle: React.CSSProperties = {
    color: '#64748b',
    marginBottom: '24px'
  };

  const clearButtonStyle: React.CSSProperties = {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
    color: '#fff',
    fontWeight: 'bold',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const fightersListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={headerContentStyle}>
          <Trophy size={32} color="#fff" />
          <div>
            <h2 style={titleStyle}>{selectedWeightClass}</h2>
            <p style={subtitleStyle}>
              {isPoundForPound
                ? 'Elite fighters ranked across all weight divisions'
                : `Top 15 ranked fighters in ${selectedWeightClass}`}
            </p>
          </div>
        </div>
      </div>

      <div style={contentStyle}>
        {fighters.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={emptyIconContainerStyle}>
              <Search size={40} color="#94a3b8" />
            </div>
            <h3 style={emptyTitleStyle}>No fighters found</h3>
            <p style={emptyTextStyle}>
              No results matching "<strong>{searchQuery}</strong>"
            </p>
            <button
              onClick={onClearSearch}
              style={clearButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(239, 68, 68, 0.5)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div style={fightersListStyle}>
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