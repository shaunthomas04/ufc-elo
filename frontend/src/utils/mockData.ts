import type { RankingData, Fighter } from '../types/Fighter';

export const generateMockData = (date: string): RankingData => {
  const weightClasses = [
    'Flyweight',
    'Bantamweight',
    'Featherweight',
    'Lightweight',
    'Welterweight',
    'Middleweight',
    'Light Heavyweight',
    'Heavyweight'
  ];

  const fighters = [
    'Islam Makhachev', 'Charles Oliveira', 'Dustin Poirier', 'Justin Gaethje',
    'Leon Edwards', 'Kamaru Usman', 'Colby Covington', 'Belal Muhammad',
    'Alex Pereira', 'Jan Blachowicz', 'Magomed Ankalaev', 'Jamahal Hill',
    'Jon Jones', 'Ciryl Gane', 'Tom Aspinall', 'Sergei Pavlovich',
    'Alexander Volkanovski', 'Max Holloway', 'Yair Rodriguez', 'Brian Ortega',
    'Sean O\'Malley', 'Aljamain Sterling', 'Merab Dvalishvili', 'Cory Sandhagen',
    'Alexandre Pantoja', 'Brandon Moreno', 'Deiveson Figueiredo', 'Brandon Royval',
    'Dricus Du Plessis', 'Sean Strickland', 'Israel Adesanya', 'Robert Whittaker'
  ];

  const data: RankingData = {
    rating_date: date,
    weight_classes: {},
    pound_for_pound: []
  };

  let allFighters: Fighter[] = [];
  let fighterId = 1;

  weightClasses.forEach((weightClass, wcIndex) => {
    const classFighters: Fighter[] = [];
    for (let i = 0; i < 15; i++) {
      const fighter: Fighter = {
        rank: i + 1,
        fighter_id: fighterId++,
        name: fighters[(wcIndex * 15 + i) % fighters.length],
        profile_image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fighterId}`,
        elo: 1900 - (wcIndex * 50) - (i * 5) + Math.random() * 10
      };
      classFighters.push(fighter);
      allFighters.push({ ...fighter, weight_class: weightClass });
    }
    data.weight_classes[weightClass] = classFighters;
  });

  allFighters.sort((a, b) => b.elo - a.elo);
  data.pound_for_pound = allFighters.slice(0, 15).map((f, i) => ({ ...f, rank: i + 1 }));

  return data;
};
