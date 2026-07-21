import React from 'react';
import { RadialBarChart, RadialBar, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const ReadinessChart = ({ score = 75, breakdown = {} }) => {
  const data = [
    { name: 'Score', uv: score, fill: 'var(--accent-primary)' }
  ];

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={20} data={data} startAngle={90} endAngle={-270}>
          <RadialBar minAngle={15} background clockWise dataKey="uv" cornerRadius={10} />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="2rem" fontWeight="bold">
            {score}%
          </text>
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReadinessChart;
