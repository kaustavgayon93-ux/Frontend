"use client";
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Shorea robusta', value: 4500 },
  { name: 'Tectona grandis', value: 3200 },
  { name: 'Terminalia myriocarpa', value: 2100 },
  { name: 'Dipterocarpus retusus', value: 1500 },
  { name: 'Others', value: 1100 },
];

const COLORS = ['#166534', '#22c55e', '#86efac', '#d97706', '#9ca3af'];

export default function SpeciesDonut() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [value.toLocaleString(), 'Trees']}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
