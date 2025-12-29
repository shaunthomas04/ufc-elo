import React, { useRef, useEffect } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const selectedIndex = weightClasses.indexOf(selectedClass);

  const handlePrevious = () => {
    const newIndex =
      selectedIndex > 0 ? selectedIndex - 1 : weightClasses.length - 1;
    onClassChange(weightClasses[newIndex]);
  };

  const handleNext = () => {
    const newIndex =
      selectedIndex < weightClasses.length - 1 ? selectedIndex + 1 : 0;
    onClassChange(weightClasses[newIndex]);
  };

  // Ensure selected item is always visible & centered
  useEffect(() => {
    const el = itemRefs.current[selectedClass];
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [selectedClass]);

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-gray-800 w-full">
      <div className="mx-auto px-6">
        <div className="h-20 flex items-center justify-between">
          
          {/* Left: Logo */}
          <div className="flex-shrink-0 ml-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UFC_Logo.svg/2560px-UFC_Logo.svg.png"
              alt="UFC Logo"
              className="h-8 ml-4"
            />
          </div>

          {/* Center: Weight Classes */}
          <div className="max-w-7xl flex-1 flex items-center justify-center gap-4 overflow-hidden">
            <button
              onClick={handlePrevious}
              aria-label="Previous weight class"
              className="text-gray-400 hover:text-red-600 transition-colors"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div
              ref={containerRef}
              className="flex items-center gap-10 overflow-x-hidden max-w-full overflow-y-hidden"
            >
              {weightClasses.map((weightClass) => (
                <button
                  key={weightClass}
                  ref={(el) => {
                    itemRefs.current[weightClass] = el;
                  }}
                  onClick={() => onClassChange(weightClass)}
                  className={`whitespace-nowrap text-lg font-semibold tracking-wide transition-all border-b-2 pb-1 ${
                    selectedClass === weightClass
                      ? 'text-white border-red-600 scale-110'
                      : 'text-gray-400 border-transparent hover:text-white'
                  }`}
                >
                  {weightClass}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="Next weight class"
              className="text-gray-400 hover:text-red-600 transition-colors"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        {/* Right: Date Picker */}
        <div className="flex-shrink-0 pr-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="
              bg-transparent
              text-sm
              text-white
              border-b
              border-red-700
              focus:border-red-600
              focus:outline-none
              px-2
              py-1
              [&::-webkit-calendar-picker-indicator]:invert
              [&::-webkit-calendar-picker-indicator]:brightness-0
              [&::-webkit-calendar-picker-indicator]:sepia
              [&::-webkit-calendar-picker-indicator]:saturate-[6]
              [&::-webkit-calendar-picker-indicator]:hue-rotate-[345deg]
              [&::-webkit-calendar-picker-indicator]:opacity-90
              hover:[&::-webkit-calendar-picker-indicator]:opacity-100
              cursor-pointer
            "
          />
        </div>
      </div>
    </div>
</nav>

  );
};