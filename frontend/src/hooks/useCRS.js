import { useUser } from './useUser';
import { calculateCRS } from '../utils/crsCalculator';
import { useState, useEffect } from 'react';

export const useCRS = () => {
  const { userProfile } = useUser();
  const [crsData, setCrsData] = useState({ crs: 0, breakdown: {}, loading: true });

  useEffect(() => {
    if (userProfile) {
      const result = calculateCRS(userProfile);
      setCrsData({ crs: result.overall, breakdown: result.breakdown, loading: false });
    }
  }, [userProfile]);

  return crsData;
};
