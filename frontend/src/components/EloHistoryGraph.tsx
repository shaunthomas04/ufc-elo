import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Dummy data for ELO history
const data = [
  { date: "2023-01-01", elo: 1400 },
  { date: "2023-03-01", elo: 1420 },
  { date: "2023-05-01", elo: 1450 },
  { date: "2023-07-01", elo: 1430 },
  { date: "2023-09-01", elo: 1470 },
  { date: "2023-11-01", elo: 1500 },
];

export const EloHistoryGraph: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">ELO History</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorElo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="elo"
            stroke="#4f46e5"
            fillOpacity={1}
            fill="url(#colorElo)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
