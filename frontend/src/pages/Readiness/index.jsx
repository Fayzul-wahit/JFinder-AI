import React from 'react';
import { Card } from '../../components/common';
import { ReadinessChart } from '../../components/charts';
import { useAuth } from '../../hooks/useAuth';
import { calculateCRS } from '../../utils/crsCalculator';

const Readiness = () => {
  const { user } = useAuth();

  // Read profile from context or localStorage — same source as Dashboard
  const storedUser = (() => {
    try {
      const auth = localStorage.getItem('auth');
      return auth ? JSON.parse(auth).user : null;
    } catch { return null; }
  })();
  const profile = user || storedUser || {};
  const crsData = calculateCRS(profile);

  return (
    <div>
      <h1>Career Readiness</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Your current readiness score</p>
      <Card glow>
        <ReadinessChart score={crsData.overall} />
      </Card>
    </div>
  );
};

export default Readiness;
