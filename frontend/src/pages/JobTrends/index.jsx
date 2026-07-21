import React from 'react';
import { Card } from '../../components/common';
import { TrendGraph } from '../../components/charts';

const JobTrends = () => (
  <div>
    <h1>Job Trend Analysis</h1>
    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Market trends and demand</p>
    <Card>
      <TrendGraph />
    </Card>
  </div>
);

export default JobTrends;
