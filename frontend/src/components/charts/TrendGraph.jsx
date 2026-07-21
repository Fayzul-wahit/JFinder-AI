import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TrendGraph = ({ data = [] }) => {
  const defaultData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 550 },
    { name: 'Apr', value: 450 },
    { name: 'May', value: 700 }
  ];

  const chartData = data.length ? data : defaultData;

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis dataKey="name" stroke="var(--text-muted)" />
          <YAxis stroke="var(--text-muted)" />
          <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
          <Line type="monotone" dataKey="value" stroke="var(--accent-primary)" strokeWidth={3} dot={{ fill: 'var(--accent-primary)', r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendGraph;
