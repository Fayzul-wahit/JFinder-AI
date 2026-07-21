import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DigitalTwin = ({ predictions = [] }) => {
  const defaultData = [
    { name: 'Current', score: 65 },
    { name: '3 Months', score: 72 },
    { name: '6 Months', score: 85 },
    { name: '12 Months', score: 95 }
  ];

  const chartData = predictions.length ? predictions : defaultData;

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis dataKey="name" stroke="var(--text-muted)" />
          <YAxis stroke="var(--text-muted)" />
          <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
          <Area type="monotone" dataKey="score" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorScore)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DigitalTwin;
