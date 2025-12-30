import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
} from "recharts";

interface EloHistoryGraphProps {
  eloHistory: { date: string; elo: number }[];
}

export const EloHistoryGraph: React.FC<EloHistoryGraphProps> = ({ eloHistory }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={eloHistory}>
        <defs>
          <linearGradient id="colorElo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="elo"
          stroke="#8884d8"
          fill="url(#colorElo)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
