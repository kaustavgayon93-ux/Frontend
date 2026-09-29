"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Dense Forest', agb: 145 },
  { name: 'Open Forest', agb: 85 },
  { name: 'Scrub', agb: 25 },
  { name: 'Grassland', agb: 10 },
];

export default function BiomassBarChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            formatter={(value: number) => [value + ' Mg/ha', 'AGBD']}
            cursor={{fill: '#f3f4f6'}}
          />
          <Bar dataKey="agb" fill="#166534" radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
