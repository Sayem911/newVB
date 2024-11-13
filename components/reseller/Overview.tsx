'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: 'Jan',
    revenue: 4000,
    profit: 2400,
  },
  {
    name: 'Feb',
    revenue: 3000,
    profit: 1398,
  },
  {
    name: 'Mar',
    revenue: 2000,
    profit: 9800,
  },
  {
    name: 'Apr',
    revenue: 2780,
    profit: 3908,
  },
  {
    name: 'May',
    revenue: 1890,
    profit: 4800,
  },
  {
    name: 'Jun',
    revenue: 2390,
    profit: 3800,
  },
  {
    name: 'Jul',
    revenue: 3490,
    profit: 4300,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="hsl(var(--primary))"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="profit"
          stroke="hsl(var(--destructive))"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}