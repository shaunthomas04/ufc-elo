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
  weightClasses,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(
    weightClasses.indexOf(selectedClass)
  );

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : weightClasses.length - 1;
    setCurrentIndex(newIndex);
    onClassChange(weightClasses[newIndex]);
  };

  const handleNext = () => {
    const newIndex = currentIndex < weightClasses.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    onClassChange(weightClasses[newIndex]);
  };

  React.useEffect(() => {
    setCurrentIndex(weightClasses.indexOf(selectedClass));
  }, [selectedClass, weightClasses]);

  return (
    <nav className="h-20 sticky top-0 z-50 bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Left: UFC Logo */}
          <div className="flex-shrink-0">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UFC_Logo.svg/2560px-UFC_Logo.svg.png"
              alt="UFC Logo"
              className="h-7 w-auto"
            />
          </div>

          {/* Middle: Weight Class Carousel */}
          <div className="flex-1 flex items-center justify-center gap-4">
            <button
              onClick={handlePrevious}
              className="text-white hover:text-red-600 transition-colors p-2"
              aria-label="Previous weight class"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex gap-3 overflow-hidden">
              {weightClasses.map((weightClass) => (
                <button
                  key={weightClass}
                  onClick={() => onClassChange(weightClass)}
                  className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-all border-b-2 ${
                    selectedClass === weightClass
                      ? 'text-white border-red-600'
                      : 'text-gray-400 border-transparent hover:border-red-600 hover:text-white'
                  }`}
                >
                  {weightClass}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="text-white hover:text-red-600 transition-colors p-2"
              aria-label="Next weight class"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Right: Date Picker */}
          <div className="flex-shrink-0">
            <input
              id="date-picker"
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};