import React, { useState } from 'react';

interface WeightClassTabsProps {
  weightClasses: string[];
  selectedWeightClass: string;
  onWeightClassChange: (weightClass: string) => void;
}

export const WeightClassTabs: React.FC<WeightClassTabsProps> = ({
  weightClasses,
  selectedWeightClass,
  onWeightClassChange
}) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const containerStyle: React.CSSProperties = {
    marginBottom: '32px',
    overflowX: 'auto'
  };

  const tabsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    minWidth: 'max-content',
    paddingBottom: '8px'
  };

  const getTabStyle = (wc: string): React.CSSProperties => {
    const isSelected = selectedWeightClass === wc;
    const isPoundForPound = wc === 'Pound-for-Pound';
    const isHovered = hoveredTab === wc;

    let baseStyle: React.CSSProperties = {
      position: 'relative',
      padding: '12px 24px',
      borderRadius: '12px',
      fontWeight: 'bold',
      fontSize: '14px',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      whiteSpace: 'nowrap'
    };

    if (isSelected) {
      if (isPoundForPound) {
        baseStyle = {
          ...baseStyle,
          background: 'linear-gradient(135deg, #fbbf24 0%, #dc2626 20%, #ea580c 100%)',
          color: '#fff',
          boxShadow: '0 10px 25px rgba(239, 68, 68, 0.5)',
          transform: 'scale(1.05)'
        };
      } else {
        baseStyle = {
          ...baseStyle,
          background: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
          color: '#fff',
          boxShadow: '0 4px 14px rgba(239, 68, 68, 0.5)'
        };
      }
    } else {
      baseStyle = {
        ...baseStyle,
        background: '#fff',
        color: '#475569',
        border: '2px solid #e2e8f0',
        boxShadow: isHovered ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
      };

      if (isHovered) {
        baseStyle.borderColor = '#ef4444';
        baseStyle.color = '#dc2626';
      }
    }

    return baseStyle;
  };

  return (
    <div style={containerStyle}>
      <div style={tabsContainerStyle}>
        {weightClasses.map(wc => (
          <button
            key={wc}
            onClick={() => onWeightClassChange(wc)}
            onMouseEnter={() => setHoveredTab(wc)}
            onMouseLeave={() => setHoveredTab(null)}
            style={getTabStyle(wc)}
          >
            {wc}
          </button>
        ))}
      </div>
    </div>
  );
};

