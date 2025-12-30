import React from "react";

interface FighterStats {
  strikes_landed: number;
  strikes_attempted: number;
  takedowns_landed: number;
  takedowns_attempted: number;
  submissions_attempted: number;
  knockdowns: number;
}

interface Fighter {
  fighter_id: string;
  first_name: string;
  last_name: string;
  nickname?: string;
  stats: FighterStats;
  image_url?: string; // placeholder for now
}

interface Odds {
  fighter: number;
  opponent: number;
}

interface Event {
  event_name: string;
  event_date: string;
  venue: string;
  city: string;
  country: string;
}

interface FightCardProps {
  fight_id: string;
  event: Event;
  weight_class: string;
  finish_method: string;
  round: number;
  time_in_round: string;
  odds: Odds;
  fighter: Fighter;
  opponent: Fighter;
}

export const FightCard: React.FC<FightCardProps> = ({
  event,
  weight_class,
  finish_method,
  round,
  time_in_round,
  odds,
  fighter,
  opponent,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4 w-full max-w-2xl">
      {/* Event Info */}
      <div className="text-center mb-3">
        <h2 className="text-lg font-bold">{event.event_name}</h2>
        <p className="text-gray-500 text-sm">
          {event.event_date} • {event.venue}, {event.city}, {event.country}
        </p>
      </div>

      {/* Fighter Info */}
      <div className="flex gap-4 items-center">
        {/* Fighter */}
        <div className="flex-1 text-center">
          <img
            src={fighter.image_url || "https://via.placeholder.com/100"}
            alt={`${fighter.first_name} ${fighter.last_name}`}
            className="mx-auto w-24 h-24 rounded-full object-cover mb-2"
          />
          <h3 className="font-bold text-lg">
            {fighter.first_name} {fighter.last_name}
          </h3>
          {fighter.nickname && (
            <p className="italic text-gray-500">"{fighter.nickname}"</p>
          )}
          <div className="text-sm mt-2">
            <p>
              <strong>Strikes:</strong> {fighter.stats.strikes_landed}/
              {fighter.stats.strikes_attempted}
            </p>
            <p>
              <strong>Takedowns:</strong> {fighter.stats.takedowns_landed}/
              {fighter.stats.takedowns_attempted}
            </p>
            <p>
              <strong>Subs:</strong> {fighter.stats.submissions_attempted} |{" "}
              <strong>KDs:</strong> {fighter.stats.knockdowns}
            </p>
            <p>
              <strong>Odds:</strong> {odds.fighter > 0 ? `+${odds.fighter}` : odds.fighter}
            </p>
          </div>
        </div>

        {/* VS */}
        <div className="flex flex-col justify-center items-center text-xl font-bold text-red-600">
          VS
        </div>

        {/* Opponent */}
        <div className="flex-1 text-center">
          <img
            src={opponent.image_url || "https://via.placeholder.com/100"}
            alt={`${opponent.first_name} ${opponent.last_name}`}
            className="mx-auto w-24 h-24 rounded-full object-cover mb-2"
          />
          <h3 className="font-bold text-lg">
            {opponent.first_name} {opponent.last_name}
          </h3>
          {opponent.nickname && (
            <p className="italic text-gray-500">"{opponent.nickname}"</p>
          )}
          <div className="text-sm mt-2">
            <p>
              <strong>Strikes:</strong> {opponent.stats.strikes_landed}/
              {opponent.stats.strikes_attempted}
            </p>
            <p>
              <strong>Takedowns:</strong> {opponent.stats.takedowns_landed}/
              {opponent.stats.takedowns_attempted}
            </p>
            <p>
              <strong>Subs:</strong> {opponent.stats.submissions_attempted} |{" "}
              <strong>KDs:</strong> {opponent.stats.knockdowns}
            </p>
            <p>
              <strong>Odds:</strong> {odds.opponent > 0 ? `+${odds.opponent}` : odds.opponent}
            </p>
          </div>
        </div>
      </div>

      {/* Fight Info */}
      <div className="mt-3 text-center text-sm text-gray-600">
        <p>
          <strong>Weight Class:</strong> {weight_class} |{" "}
          <strong>Finish:</strong> {finish_method} | <strong>Round:</strong> {round} |{" "}
          <strong>Time:</strong> {time_in_round}
        </p>
      </div>
    </div>
  );
};
