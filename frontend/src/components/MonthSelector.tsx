import React from 'react';
import { Calendar, TrendingUp } from 'lucide-react';
import type { MonthOption } from '../types/Fighter';

interface MonthSelectorProps {
  monthOptions: MonthOption[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  fighterCount: number;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  monthOptions,
  selectedMonth,
  onMonthChange,
  fighterCount
}) => {
  const containerStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    marginBottom: '32px'
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px'
  };

  const leftSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const iconContainerStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const selectGroupStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569'
  };

  const selectStyle: React.CSSProperties = {
    padding: '10px 16px',
    background: '#f1f5f9',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0f172a',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const statsContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    borderRadius: '8px'
  };

  const statsTextStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#0f172a'
  };

  const statsLabelStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#64748b'
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={leftSectionStyle}>
          <div style={iconContainerStyle}>
            <Calendar size={24} color="#fff" />
          </div>
          <div style={selectGroupStyle}>
            <label htmlFor="month-select" style={labelStyle}>
              Rankings Period:
            </label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              style={selectStyle}
            >
              {monthOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={statsContainerStyle}>
          <TrendingUp size={20} color="#dc2626" />
          <span style={statsTextStyle}>{fighterCount}</span>
          <span style={statsLabelStyle}>Active Fighters</span>
        </div>
      </div>
    </div>
  );
};