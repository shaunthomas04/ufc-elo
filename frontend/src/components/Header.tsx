import React from 'react';
import { Search, Trophy } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange }) => {
  const headerStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px'
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '80px'
  };

  const logoSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const logoContainerStyle: React.CSSProperties = {
    position: 'relative'
  };

  const logoBlurStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
    borderRadius: '16px',
    filter: 'blur(8px)',
    opacity: 0.5
  };

  const logoStyle: React.CSSProperties = {
    position: 'relative',
    width: '56px',
    height: '56px',
    background: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)'
  };

  const titleContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column' as const
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: '-0.025em'
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500'
  };

  const searchContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '320px'
  };

  const searchIconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    transition: 'color 0.3s ease'
  };

  const searchInputStyle: React.CSSProperties = {
    width: '100%',
    paddingLeft: '48px',
    paddingRight: '16px',
    paddingTop: '12px',
    paddingBottom: '12px',
    background: '#f1f5f9',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontSize: '14px'
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <div style={contentStyle}>
          <div style={logoSectionStyle}>
            <div style={logoContainerStyle}>
              <div style={logoBlurStyle} />
              <div style={logoStyle}>
                <Trophy size={32} color="#fff" />
              </div>
            </div>
            <div style={titleContainerStyle}>
              <h1 style={titleStyle}>UFC ELO Rankings</h1>
              <p style={subtitleStyle}>Statistical Fighter Analysis</p>
            </div>
          </div>

          <div style={searchContainerStyle}>
            <div style={searchIconStyle}>
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search fighters..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={searchInputStyle}
              onFocus={(e) => {
                e.target.style.background = '#fff';
                e.target.style.borderColor = '#ef4444';
              }}
              onBlur={(e) => {
                e.target.style.background = '#f1f5f9';
                e.target.style.borderColor = '#e2e8f0';
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};