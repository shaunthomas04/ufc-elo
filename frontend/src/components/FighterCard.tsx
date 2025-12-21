import React, { useState } from 'react';
import type { Fighter } from '../types/Fighter';
import { TrendingUp } from 'lucide-react';

interface FighterCardProps {
  fighter: Fighter;
  showWeightClass?: boolean;
}

export const FighterCard: React.FC<FighterCardProps> = ({ 
  fighter, 
  showWeightClass = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getRankBadgeStyle = (rank: number) => {
    if (rank === 1) return {
      background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
      color: '#fff',
      boxShadow: '0 4px 14px rgba(251, 191, 36, 0.5)'
    };
    if (rank === 2) return {
      background: 'linear-gradient(135deg, #d1d5db 0%, #6b7280 100%)',
      color: '#fff',
      boxShadow: '0 4px 14px rgba(209, 213, 219, 0.5)'
    };
    if (rank === 3) return {
      background: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)',
      color: '#fff',
      boxShadow: '0 4px 14px rgba(251, 146, 60, 0.5)'
    };
    return {
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
      color: '#64748b'
    };
  };

  const cardStyle: React.CSSProperties = {
    position: 'relative',
    background: '#fff',
    borderRadius: '16px',
    border: isHovered ? '1px solid #ef4444' : '1px solid #e2e8f0',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    boxShadow: isHovered ? '0 20px 25px -5px rgba(239, 68, 68, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer'
  };

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '20px',
    zIndex: 1
  };

  const rankBadgeContainerStyle: React.CSSProperties = {
    flexShrink: 0
  };

  const rankBadgeStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
    transition: 'transform 0.3s ease',
    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    ...getRankBadgeStyle(fighter.rank)
  };

  const imageContainerStyle: React.CSSProperties = {
    position: 'relative',
    flexShrink: 0
  };

  const imageWrapperStyle: React.CSSProperties = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const imageStyle: React.CSSProperties = {
    width: '76px',
    height: '76px',
    borderRadius: '50%',
    objectFit: 'cover',
    background: '#fff'
  };

  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    width: '24px',
    height: '24px',
    background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
  };

  const infoContainerStyle: React.CSSProperties = {
    flexGrow: 1,
    minWidth: 0
  };

  const nameStyle: React.CSSProperties = {
    fontWeight: 'bold',
    color: isHovered ? '#dc2626' : '#0f172a',
    fontSize: '18px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    transition: 'color 0.3s ease'
  };

  const weightClassBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 10px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '500',
    background: '#f1f5f9',
    color: '#475569',
    marginTop: '4px'
  };

  const eloContainerStyle: React.CSSProperties = {
    flexShrink: 0,
    textAlign: 'right'
  };

  const eloScoreStyle: React.CSSProperties = {
    fontSize: '30px',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const eloLabelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginTop: '2px'
  };

  return (
    <div 
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={contentStyle}>
        <div style={rankBadgeContainerStyle}>
          <div style={rankBadgeStyle}>
            {fighter.rank}
          </div>
        </div>

        <div style={imageContainerStyle}>
          <div style={imageWrapperStyle}>
            <img 
              src={fighter.profile_image} 
              alt={fighter.name}
              style={imageStyle}
            />
          </div>
          {fighter.rank <= 3 && (
            <div style={badgeStyle}>
              <TrendingUp size={12} color="#fff" />
            </div>
          )}
        </div>

        <div style={infoContainerStyle}>
          <h3 style={nameStyle}>{fighter.name}</h3>
          {showWeightClass && fighter.weight_class && (
            <div style={{ marginTop: '4px' }}>
              <span style={weightClassBadgeStyle}>
                {fighter.weight_class}
              </span>
            </div>
          )}
        </div>

        <div style={eloContainerStyle}>
          <div style={eloScoreStyle}>{fighter.elo.toFixed(0)}</div>
          <div style={eloLabelStyle}>ELO Rating</div>
        </div>
      </div>
    </div>
  );
};