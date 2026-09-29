"use client";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const data = [
  { name: '2020-Q1', tco2e: 120000 },
  { name: '2021-Q1', tco2e: 125000 },
  { name: '2022-Q1', tco2e: 132000 },
  { name: '2023-Q1', tco2e: 145000 },
  { name: '2024-Q1', tco2e: 165000 },
];

export default function CarbonTrendChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTco2e" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Tooltip 
            formatter={(value: number) => [value.toLocaleString() + ' tCO2e', 'Carbon Stock']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Area type="monotone" dataKey="tco2e" stroke="#16a34a" fillOpacity={1} fill="url(#colorTco2e)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
