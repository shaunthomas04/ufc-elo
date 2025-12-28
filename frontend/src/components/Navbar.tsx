import React from 'react';
import type { WeightClass } from '../types';

interface NavbarProps {
  selectedClass: WeightClass;
  onClassChange: (weightClass: WeightClass) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  weightClasses: WeightClass[];
}

export const Navbar: React.FC<NavbarProps> = ({ 
  selectedClass, 
  onClassChange, 
  selectedDate, 
  onDateChange,
  weightClasses 
}) => {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">UFC Rankings</h1>
          <div className="flex items-center gap-2">
            <label htmlFor="date-picker" className="text-sm text-gray-600">
              Date:
            </label>
            <input
              id="date-picker"
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {weightClasses.map((weightClass) => (
            <button
              key={weightClass}
              onClick={() => onClassChange(weightClass)}
              className={`px-4 py-2 rounded transition-colors ${
                selectedClass === weightClass
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {weightClass}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};