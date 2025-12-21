import React from 'react';

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
  return (
    <div className="weight-class-tabs">
      {weightClasses.map(wc => (
        <button
          key={wc}
          onClick={() => onWeightClassChange(wc)}
          className={`tab-button ${selectedWeightClass === wc ? 'active' : ''}`}
        >
          {wc}
        </button>
      ))}
    </div>
  );
};