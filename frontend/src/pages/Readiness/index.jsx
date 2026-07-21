import React from 'react';
import { Card, Badge } from '../../components/common';
import { ReadinessChart } from '../../components/charts';

const Readiness = () => (
  <div>
    <h1>Career Readiness</h1>
    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Your current readiness score</p>
    <Card glow>
      <ReadinessChart score={78} />
    </Card>
  </div>
);

export default Readiness;
