import React, { useState } from 'react';
import type { WeightClass, RankingsData} from './types';
import { Navbar } from './components/Navbar';
import { RankingsList } from './components/RankingsList';

export const rankingsData: RankingsData = {
  'Heavyweight': [
    { rank: 1, name: 'Jon Jones', nickname: 'Bones', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1850 },
    { rank: 2, name: 'Stipe Miocic', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1780 },
    { rank: 3, name: 'Tom Aspinall', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1750 },
    { rank: 4, name: 'Sergei Pavlovich', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1720 },
    { rank: 5, name: 'Curtis Blaydes', nickname: 'Razor', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1690 },
    { rank: 6, name: 'Ciryl Gane', nickname: 'Bon Gamin', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1670 },
    { rank: 7, name: 'Alexander Volkov', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1650 },
    { rank: 8, name: 'Jailton Almeida', nickname: 'Malhadinho', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1630 },
    { rank: 9, name: 'Marcin Tybura', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1610 },
    { rank: 10, name: 'Derrick Lewis', nickname: 'The Black Beast', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1590 },
    { rank: 11, name: 'Tai Tuivasa', nickname: 'Bam Bam', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1570 },
    { rank: 12, name: 'Marcos Rogerio de Lima', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1550 },
    { rank: 13, name: 'Alexandr Romanov', nickname: 'King Kong', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1530 },
    { rank: 14, name: 'Serghei Spivac', nickname: 'Polar Bear', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1510 },
    { rank: 15, name: 'Chris Daukaus', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1490 },
  ],
  'Light Heavyweight': [
    { rank: 1, name: 'Alex Pereira', nickname: 'Poatan', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1820 },
    { rank: 2, name: 'Jamahal Hill', nickname: 'Sweet Dreams', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1760 },
    { rank: 3, name: 'Jiri Prochazka', nickname: 'Denisa', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1740 },
    { rank: 4, name: 'Magomed Ankalaev', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1710 },
    { rank: 5, name: 'Jan Blachowicz', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1680 },
    { rank: 6, name: 'Aleksandar Rakic', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1660 },
    { rank: 7, name: 'Anthony Smith', nickname: 'Lionheart', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1640 },
    { rank: 8, name: 'Johnny Walker', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1620 },
    { rank: 9, name: 'Nikita Krylov', nickname: 'The Miner', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1600 },
    { rank: 10, name: 'Volkan Oezdemir', nickname: 'No Time', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1580 },
    { rank: 11, name: 'Ryan Spann', nickname: 'Superman', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1560 },
    { rank: 12, name: 'Azamat Murzakanov', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1540 },
    { rank: 13, name: 'Dominick Reyes', nickname: 'The Devastator', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1520 },
    { rank: 14, name: 'Alonzo Menifield', nickname: 'Atomic', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1500 },
    { rank: 15, name: 'Paul Craig', nickname: 'Bearjew', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1480 },
  ],
  'Middleweight': [
    { rank: 1, name: 'Dricus Du Plessis', nickname: 'Stillknocks', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1810 },
    { rank: 2, name: 'Sean Strickland', nickname: 'Tarzan', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1750 },
    { rank: 3, name: 'Israel Adesanya', nickname: 'The Last Stylebender', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1730 },
    { rank: 4, name: 'Robert Whittaker', nickname: 'The Reaper', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1700 },
    { rank: 5, name: 'Jared Cannonier', nickname: 'Tha Killa Gorilla', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1670 },
    { rank: 6, name: 'Marvin Vettori', nickname: 'The Italian Dream', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1650 },
    { rank: 7, name: 'Paulo Costa', nickname: 'The Eraser', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1630 },
    { rank: 8, name: 'Roman Dolidze', nickname: 'The Caucasian', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1610 },
    { rank: 9, name: 'Jack Hermansson', nickname: 'The Joker', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1590 },
    { rank: 10, name: 'Brendan Allen', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1570 },
    { rank: 11, name: 'Nassourdine Imavov', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1550 },
    { rank: 12, name: 'Derek Brunson', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1530 },
    { rank: 13, name: 'Caio Borralho', nickname: 'The Natural', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1510 },
    { rank: 14, name: 'Andre Muniz', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1490 },
    { rank: 15, name: 'Chris Curtis', nickname: 'The Action Man', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1470 },
  ],
};


const App: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<WeightClass>('Heavyweight');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const weightClasses = Object.keys(rankingsData) as WeightClass[];
  const fighters = rankingsData[selectedClass] || [];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        weightClasses={weightClasses}
      />
      <RankingsList weightClass={selectedClass} fighters={fighters} />
    </div>
  );
};

export default App;