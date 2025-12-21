import React from 'react';
import { Search } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-logo">
          <div className="logo-text">UFC</div>
          <div className="header-title">ELO Rankings</div>
        </div>
        
        <div className="header-search">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search fighters..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
    </header>
  );
};