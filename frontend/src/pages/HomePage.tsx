import React, { useState, useMemo } from 'react';
import { Header } from '../components/Header';
import { MonthSelector } from '../components/MonthSelector';
import { WeightClassTabs } from '../components/WeightClassTabs';
import { RankingsList } from '../components/RankingsList';
import { generateMockData } from '../utils/mockData';
import { generateMonthOptions } from '../utils/dateUtils';

export const HomePage: React.FC = () => {
  const monthOptions = generateMonthOptions();
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0].value);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeightClass, setSelectedWeightClass] = useState<string>('Pound-for-Pound');

  const data = useMemo(() => generateMockData(selectedMonth + '-01'), [selectedMonth]);

  const weightClassOptions = ['Pound-for-Pound', ...Object.keys(data.weight_classes)];

  const currentFighters = useMemo(() => {
    if (selectedWeightClass === 'Pound-for-Pound') {
      return data.pound_for_pound;
    }
    return data.weight_classes[selectedWeightClass] || [];
  }, [selectedWeightClass, data]);

  const filteredFighters = useMemo(() => {
    if (!searchQuery) return currentFighters;
    return currentFighters.filter(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentFighters, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MonthSelector
          monthOptions={monthOptions}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          fighterCount={filteredFighters.length}
        />

        <WeightClassTabs
          weightClasses={weightClassOptions}
          selectedWeightClass={selectedWeightClass}
          onWeightClassChange={setSelectedWeightClass}
        />

        <RankingsList
          fighters={filteredFighters}
          selectedWeightClass={selectedWeightClass}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
        />
      </main>

    </div>
  );
};
