import React from 'react';
import type { MonthOption } from '../types/Fighter';

interface MonthSelectorProps {
  monthOptions: MonthOption[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  monthOptions,
  selectedMonth,
  onMonthChange
}) => {
  return (
    <div className="month-selector">
      <label htmlFor="month-select" className="month-label">
        Rankings as of:
      </label>
      <select
        id="month-select"
        value={selectedMonth}
        onChange={(e) => onMonthChange(e.target.value)}
        className="month-select"
      >
        {monthOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};