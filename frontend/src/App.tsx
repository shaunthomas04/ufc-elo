import React, { useState } from 'react';
import type { WeightClass, RankingsData} from './types';
import { Navbar } from './components/Navbar';
import { RankingsList } from './components/RankingsList';

export const rankingsData: RankingsData = {
  "Men Pound-for-Pound": [
    { rank: 1, firstname: 'Jon', lastname: 'Jones', nickname: 'Bones', image: 'https://a.espncdn.com/i/headshots/mma/players/full/2335639.png', elo: 1850 },
    { rank: 2, firstname: 'Stipe', lastname: 'Miocic', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1780 },
    { rank: 3, firstname: 'Tom', lastname: 'Aspinall', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1750 },
    { rank: 4, firstname: 'Sergei', lastname: 'Pavlovich', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1720 },
    { rank: 5, firstname: 'Curtis', lastname: 'Blaydes', nickname: 'Razor', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1690 },
    { rank: 6, firstname: 'Ciryl', lastname: 'Gane', nickname: 'Bon Gamin', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1670 },
    { rank: 7, firstname: 'Alexander', lastname: 'Volkov', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1650 },
    { rank: 8, firstname: 'Jailton', lastname: 'Almeida', nickname: 'Malhadinho', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1630 },
    { rank: 9, firstname: 'Marcin', lastname: 'Tybura', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1610 },
    { rank: 10, firstname: 'Derrick', lastname: 'Lewis', nickname: 'The Black Beast', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1590 },
    { rank: 11, firstname: 'Tai', lastname: 'Tuivasa', nickname: 'Bam Bam', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1570 },
    { rank: 12, firstname: 'Marcos', lastname: 'Rogerio de Lima', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1550 },
    { rank: 13, firstname: 'Alexandr', lastname: 'Romanov', nickname: 'King Kong', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1530 },
    { rank: 14, firstname: 'Serghei', lastname: 'Spivac', nickname: 'Polar Bear', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1510 },
    { rank: 15, firstname: 'Chris', lastname: 'Daukaus', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1490 },
  ],
  "Men Heavyweight": [
    { rank: 1, firstname: 'Jon', lastname: 'Jones', nickname: 'Bones', image: 'https://a.espncdn.com/i/headshots/mma/players/full/2335639.png', elo: 1850 },
    { rank: 2, firstname: 'Stipe', lastname: 'Miocic', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1780 },
    { rank: 3, firstname: 'Tom', lastname: 'Aspinall', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1750 },
    { rank: 4, firstname: 'Sergei', lastname: 'Pavlovich', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1720 },
    { rank: 5, firstname: 'Curtis', lastname: 'Blaydes', nickname: 'Razor', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1690 },
    { rank: 6, firstname: 'Ciryl', lastname: 'Gane', nickname: 'Bon Gamin', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1670 },
    { rank: 7, firstname: 'Alexander', lastname: 'Volkov', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1650 },
    { rank: 8, firstname: 'Jailton', lastname: 'Almeida', nickname: 'Malhadinho', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1630 },
    { rank: 9, firstname: 'Marcin', lastname: 'Tybura', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1610 },
    { rank: 10, firstname: 'Derrick', lastname: 'Lewis', nickname: 'The Black Beast', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1590 },
    { rank: 11, firstname: 'Tai', lastname: 'Tuivasa', nickname: 'Bam Bam', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1570 },
    { rank: 12, firstname: 'Marcos', lastname: 'Rogerio de Lima', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1550 },
    { rank: 13, firstname: 'Alexandr', lastname: 'Romanov', nickname: 'King Kong', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1530 },
    { rank: 14, firstname: 'Serghei', lastname: 'Spivac', nickname: 'Polar Bear', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1510 },
    { rank: 15, firstname: 'Chris', lastname: 'Daukaus', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1490 },
  ],
  "Men Light Heavyweight": [
    { rank: 1, firstname: 'Alex', lastname: 'Pereira', nickname: 'Poatan', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1820 },
    { rank: 2, firstname: 'Jamahal', lastname: 'Hill', nickname: 'Sweet Dreams', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1760 },
    { rank: 3, firstname: 'Jiri', lastname: 'Prochazka', nickname: 'Denisa', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1740 },
    { rank: 4, firstname: 'Magomed', lastname: 'Ankalaev', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1710 },
    { rank: 5, firstname: 'Jan', lastname: 'Blachowicz', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1680 },
    { rank: 6, firstname: 'Aleksandar', lastname: 'Rakic', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1660 },
    { rank: 7, firstname: 'Anthony', lastname: 'Smith', nickname: 'Lionheart', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1640 },
    { rank: 8, firstname: 'Johnny', lastname: 'Walker', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1620 },
    { rank: 9, firstname: 'Nikita', lastname: 'Krylov', nickname: 'The Miner', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1600 },
    { rank: 10, firstname: 'Volkan', lastname: 'Oezdemir', nickname: 'No Time', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1580 },
    { rank: 11, firstname: 'Ryan', lastname: 'Spann', nickname: 'Superman', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1560 },
    { rank: 12, firstname: 'Azamat', lastname: 'Murzakanov', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1540 },
    { rank: 13, firstname: 'Dominick', lastname: 'Reyes', nickname: 'The Devastator', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1520 },
    { rank: 14, firstname: 'Alonzo', lastname: 'Menifield', nickname: 'Atomic', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1500 },
    { rank: 15, firstname: 'Paul', lastname: 'Craig', nickname: 'Bearjew', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1480 },
  ],

  "Men Middleweight": [
    { rank: 1, firstname: 'Dricus', lastname: 'Du Plessis', nickname: 'Stillknocks', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1810 },
    { rank: 2, firstname: 'Sean', lastname: 'Strickland', nickname: 'Tarzan', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1750 },
    { rank: 3, firstname: 'Israel', lastname: 'Adesanya', nickname: 'The Last Stylebender', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1730 },
    { rank: 4, firstname: 'Robert', lastname: 'Whittaker', nickname: 'The Reaper', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1700 },
    { rank: 5, firstname: 'Jared', lastname: 'Cannonier', nickname: 'Tha Killa Gorilla', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1670 },
    { rank: 6, firstname: 'Marvin', lastname: 'Vettori', nickname: 'The Italian Dream', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1650 },
    { rank: 7, firstname: 'Paulo', lastname: 'Costa', nickname: 'The Eraser', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1630 },
    { rank: 8, firstname: 'Roman', lastname: 'Dolidze', nickname: 'The Caucasian', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1610 },
    { rank: 9, firstname: 'Jack', lastname: 'Hermansson', nickname: 'The Joker', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1590 },
    { rank: 10, firstname: 'Brendan', lastname: 'Allen', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1570 },
    { rank: 11, firstname: 'Nassourdine', lastname: 'Imavov', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1550 },
    { rank: 12, firstname: 'Derek', lastname: 'Brunson', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1530 },
    { rank: 13, firstname: 'Caio', lastname: 'Borralho', nickname: 'The Natural', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1510 },
    { rank: 14, firstname: 'Andre', lastname: 'Muniz', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1490 },
    { rank: 15, firstname: 'Chris', lastname: 'Curtis', nickname: 'The Action Man', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1470 },
  ],
  "Men Welterweight": [
    { rank: 1, firstname: 'Dricus', lastname: 'Du Plessis', nickname: 'Stillknocks', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1810 },
    { rank: 2, firstname: 'Sean', lastname: 'Strickland', nickname: 'Tarzan', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1750 },
    { rank: 3, firstname: 'Israel', lastname: 'Adesanya', nickname: 'The Last Stylebender', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1730 },
    { rank: 4, firstname: 'Robert', lastname: 'Whittaker', nickname: 'The Reaper', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1700 },
    { rank: 5, firstname: 'Jared', lastname: 'Cannonier', nickname: 'Tha Killa Gorilla', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1670 },
    { rank: 6, firstname: 'Marvin', lastname: 'Vettori', nickname: 'The Italian Dream', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1650 },
    { rank: 7, firstname: 'Paulo', lastname: 'Costa', nickname: 'The Eraser', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1630 },
    { rank: 8, firstname: 'Roman', lastname: 'Dolidze', nickname: 'The Caucasian', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1610 },
    { rank: 9, firstname: 'Jack', lastname: 'Hermansson', nickname: 'The Joker', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1590 },
    { rank: 10, firstname: 'Brendan', lastname: 'Allen', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1570 },
    { rank: 11, firstname: 'Nassourdine', lastname: 'Imavov', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1550 },
    { rank: 12, firstname: 'Derek', lastname: 'Brunson', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1530 },
    { rank: 13, firstname: 'Caio', lastname: 'Borralho', nickname: 'The Natural', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1510 },
    { rank: 14, firstname: 'Andre', lastname: 'Muniz', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1490 },
    { rank: 15, firstname: 'Chris', lastname: 'Curtis', nickname: 'The Action Man', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1470 },
  ],
  "Men Lightweight": [
    { rank: 1, firstname: 'Dricus', lastname: 'Du Plessis', nickname: 'Stillknocks', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1810 },
    { rank: 2, firstname: 'Sean', lastname: 'Strickland', nickname: 'Tarzan', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1750 },
    { rank: 3, firstname: 'Israel', lastname: 'Adesanya', nickname: 'The Last Stylebender', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1730 },
    { rank: 4, firstname: 'Robert', lastname: 'Whittaker', nickname: 'The Reaper', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1700 },
    { rank: 5, firstname: 'Jared', lastname: 'Cannonier', nickname: 'Tha Killa Gorilla', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1670 },
    { rank: 6, firstname: 'Marvin', lastname: 'Vettori', nickname: 'The Italian Dream', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1650 },
    { rank: 7, firstname: 'Paulo', lastname: 'Costa', nickname: 'The Eraser', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1630 },
    { rank: 8, firstname: 'Roman', lastname: 'Dolidze', nickname: 'The Caucasian', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1610 },
    { rank: 9, firstname: 'Jack', lastname: 'Hermansson', nickname: 'The Joker', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1590 },
    { rank: 10, firstname: 'Brendan', lastname: 'Allen', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1570 },
    { rank: 11, firstname: 'Nassourdine', lastname: 'Imavov', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1550 },
    { rank: 12, firstname: 'Derek', lastname: 'Brunson', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1530 },
    { rank: 13, firstname: 'Caio', lastname: 'Borralho', nickname: 'The Natural', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1510 },
    { rank: 14, firstname: 'Andre', lastname: 'Muniz', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1490 },
    { rank: 15, firstname: 'Chris', lastname: 'Curtis', nickname: 'The Action Man', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1470 },
  ],
  "Men Featherweight": [
    { rank: 1, firstname: 'Dricus', lastname: 'Du Plessis', nickname: 'Stillknocks', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1810 },
    { rank: 2, firstname: 'Sean', lastname: 'Strickland', nickname: 'Tarzan', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1750 },
    { rank: 3, firstname: 'Israel', lastname: 'Adesanya', nickname: 'The Last Stylebender', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1730 },
    { rank: 4, firstname: 'Robert', lastname: 'Whittaker', nickname: 'The Reaper', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1700 },
    { rank: 5, firstname: 'Jared', lastname: 'Cannonier', nickname: 'Tha Killa Gorilla', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1670 },
    { rank: 6, firstname: 'Marvin', lastname: 'Vettori', nickname: 'The Italian Dream', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1650 },
    { rank: 7, firstname: 'Paulo', lastname: 'Costa', nickname: 'The Eraser', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1630 },
    { rank: 8, firstname: 'Roman', lastname: 'Dolidze', nickname: 'The Caucasian', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1610 },
    { rank: 9, firstname: 'Jack', lastname: 'Hermansson', nickname: 'The Joker', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1590 },
    { rank: 10, firstname: 'Brendan', lastname: 'Allen', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1570 },
    { rank: 11, firstname: 'Nassourdine', lastname: 'Imavov', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1550 },
    { rank: 12, firstname: 'Derek', lastname: 'Brunson', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1530 },
    { rank: 13, firstname: 'Caio', lastname: 'Borralho', nickname: 'The Natural', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1510 },
    { rank: 14, firstname: 'Andre', lastname: 'Muniz', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1490 },
    { rank: 15, firstname: 'Chris', lastname: 'Curtis', nickname: 'The Action Man', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1470 },
  ],
  "Men Bantamweight": [
    { rank: 1, firstname: 'Dricus', lastname: 'Du Plessis', nickname: 'Stillknocks', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1810 },
    { rank: 2, firstname: 'Sean', lastname: 'Strickland', nickname: 'Tarzan', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1750 },
    { rank: 3, firstname: 'Israel', lastname: 'Adesanya', nickname: 'The Last Stylebender', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1730 },
    { rank: 4, firstname: 'Robert', lastname: 'Whittaker', nickname: 'The Reaper', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1700 },
    { rank: 5, firstname: 'Jared', lastname: 'Cannonier', nickname: 'Tha Killa Gorilla', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1670 },
    { rank: 6, firstname: 'Marvin', lastname: 'Vettori', nickname: 'The Italian Dream', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1650 },
    { rank: 7, firstname: 'Paulo', lastname: 'Costa', nickname: 'The Eraser', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1630 },
    { rank: 8, firstname: 'Roman', lastname: 'Dolidze', nickname: 'The Caucasian', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1610 },
    { rank: 9, firstname: 'Jack', lastname: 'Hermansson', nickname: 'The Joker', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1590 },
    { rank: 10, firstname: 'Brendan', lastname: 'Allen', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1570 },
    { rank: 11, firstname: 'Nassourdine', lastname: 'Imavov', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1550 },
    { rank: 12, firstname: 'Derek', lastname: 'Brunson', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1530 },
    { rank: 13, firstname: 'Caio', lastname: 'Borralho', nickname: 'The Natural', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1510 },
    { rank: 14, firstname: 'Andre', lastname: 'Muniz', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1490 },
    { rank: 15, firstname: 'Chris', lastname: 'Curtis', nickname: 'The Action Man', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1470 },
  ],
  "Men Flyweight": [
    { rank: 1, firstname: 'Dricus', lastname: 'Du Plessis', nickname: 'Stillknocks', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1810 },
    { rank: 2, firstname: 'Sean', lastname: 'Strickland', nickname: 'Tarzan', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1750 },
    { rank: 3, firstname: 'Israel', lastname: 'Adesanya', nickname: 'The Last Stylebender', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1730 },
    { rank: 4, firstname: 'Robert', lastname: 'Whittaker', nickname: 'The Reaper', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1700 },
    { rank: 5, firstname: 'Jared', lastname: 'Cannonier', nickname: 'Tha Killa Gorilla', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1670 },
    { rank: 6, firstname: 'Marvin', lastname: 'Vettori', nickname: 'The Italian Dream', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1650 },
    { rank: 7, firstname: 'Paulo', lastname: 'Costa', nickname: 'The Eraser', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1630 },
    { rank: 8, firstname: 'Roman', lastname: 'Dolidze', nickname: 'The Caucasian', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1610 },
    { rank: 9, firstname: 'Jack', lastname: 'Hermansson', nickname: 'The Joker', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1590 },
    { rank: 10, firstname: 'Brendan', lastname: 'Allen', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1570 },
    { rank: 11, firstname: 'Nassourdine', lastname: 'Imavov', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1550 },
    { rank: 12, firstname: 'Derek', lastname: 'Brunson', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1530 },
    { rank: 13, firstname: 'Caio', lastname: 'Borralho', nickname: 'The Natural', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1510 },
    { rank: 14, firstname: 'Andre', lastname: 'Muniz', nickname: '', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1490 },
    { rank: 15, firstname: 'Chris', lastname: 'Curtis', nickname: 'The Action Man', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100&h=100&fit=crop', elo: 1470 },
  ],
};

const App: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<WeightClass>('Men Pound-for-Pound');
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