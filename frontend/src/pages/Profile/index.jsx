import React from 'react';
import { Card, Badge } from '../../components/common';

const Profile = () => (
  <div>
    <h1>Profile</h1>
    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage your personal information</p>
    <Card>
      <Badge variant="purple">Coming Soon</Badge>
    </Card>
  </div>
);

export default Profile;
