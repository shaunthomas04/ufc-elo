import type { MonthOption } from '../types/Fighter';

export const generateMonthOptions = (): MonthOption[] => {
  const months: MonthOption[] = [];
  const today = new Date();
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({
      value: date.toISOString().slice(0, 7),
      label: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    });
  }
  
  return months;
};