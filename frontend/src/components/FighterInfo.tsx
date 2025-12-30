import React from "react";
import { EloHistoryGraph } from "./EloHistoryGraph";
import { FightCard } from "./FightCard";

interface FighterInfoProps {
  image: string;
  firstname: string;
  lastname: string;
  nickname?: string;
  birthday: string;
  weightClass: string;
  height: string;
  reach: string;
  record: string;

  koWins: number;
  subWins: number;
  decisionWins: number;
}

export const FighterInfo: React.FC<FighterInfoProps> = ({
  image,
  firstname,
  lastname,
  nickname,
  birthday,
  weightClass,
  height,
  reach,
  record,
  koWins,
  subWins,
  decisionWins,
}) => {
  const finishWins = koWins + subWins;
  const isDecisionMerchant = decisionWins >= 10 && finishWins <= 3;

  // Dummy ELO history data
  const eloHistory = [
    { fight: 1, elo: 1500 },
    { fight: 2, elo: 1520 },
    { fight: 3, elo: 1540 },
    { fight: 4, elo: 1560 },
    { fight: 5, elo: 1580 },
    { fight: 6, elo: 1570 },
    { fight: 7, elo: 1600 },
  ];

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full p-4">

      {/* Top Left — Fighter Profile */}
      <div className="bg-white rounded-lg shadow p-4 flex gap-4">
        <img
          src={image}
          alt={`${firstname} ${lastname}`}
          className="w-40 h-40 object-cover rounded-lg"
        />
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h1 className="text-2xl font-bold">{firstname} {lastname}</h1>
            {nickname && <p className="text-gray-500 italic">“{nickname}”</p>}
          </div>
          <div className="text-sm text-gray-700 space-y-1 mt-2">
            <p><span className="font-semibold">Birthday:</span> {birthday}</p>
            <p><span className="font-semibold">Weight Class:</span> {weightClass}</p>
            <p><span className="font-semibold">Height:</span> {height}</p>
            <p><span className="font-semibold">Reach:</span> {reach}</p>
            <p><span className="font-semibold">Record:</span> {record}</p>
          </div>
          <div className="mt-3 border-t pt-2 text-sm">
            <div className="flex gap-4">
              <span><strong>KO:</strong> {koWins}</span>
              <span><strong>SUB:</strong> {subWins}</span>
              <span><strong>DEC:</strong> {decisionWins}</span>
            </div>
            {isDecisionMerchant && (
              <p className="mt-1 text-gray-400 italic text-xs">decision merchant</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Right — Recent Fights (Placeholder) */}
      <div className="bg-white rounded-lg shadow flex items-center justify-center text-gray-400">
        <FightCard
  fight_id="F123"
  event={{
    event_name: "UFC 300",
    event_date: "2025-07-12",
    venue: "T-Mobile Arena",
    city: "Las Vegas",
    country: "USA",
  }}
  weight_class="Light Heavyweight"
  finish_method="KO"
  round={2}
  time_in_round="01:45"
  odds={{ fighter: -150, opponent: 130 }}
  fighter={{
    fighter_id: "F001",
    first_name: "Jon",
    last_name: "Jones",
    nickname: "Bones",
    stats: {
      strikes_landed: 200,
      strikes_attempted: 350,
      takedowns_landed: 5,
      takedowns_attempted: 10,
      submissions_attempted: 2,
      knockdowns: 3,
    },
    image_url: "https://randomuser.me/api/portraits/men/1.jpg",
  }}
  opponent={{
    fighter_id: "F002",
    first_name: "Stipe",
    last_name: "Miocic",
    nickname: "",
    stats: {
      strikes_landed: 180,
      strikes_attempted: 300,
      takedowns_landed: 2,
      takedowns_attempted: 6,
      submissions_attempted: 1,
      knockdowns: 2,
    },
    image_url: "https://randomuser.me/api/portraits/men/2.jpg",
  }}
/>

      </div>

      {/* Bottom Left — ELO History Graph */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-sm font-semibold mb-2 text-gray-700">ELO History</h2>
        <EloHistoryGraph />
      </div>

      {/* Bottom Right — Additional Fight Data (Placeholder) */}
      <div className="bg-white rounded-lg shadow flex items-center justify-center text-gray-400">
        Fights / Stats (Bottom)
      </div>

    </div>
  );
};
