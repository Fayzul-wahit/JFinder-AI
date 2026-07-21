import React from 'react';
import { Card, Badge } from '../../components/common';

const News = () => (
  <div>
    <h1>Industry News</h1>
    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Latest updates from the tech world</p>
    <Card>
      <Badge variant="purple">Coming Soon</Badge>
    </Card>
  </div>
);

export default News;
