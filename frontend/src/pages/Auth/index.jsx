import React from 'react';
import { Card, Button } from '../../components/common';
import { initiateGoogleLogin } from '../../services/auth';

const Auth = () => (
  <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Card glow style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
      <h2>Login to JFinder AI</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Start your AI-powered career journey</p>
      <Button variant="primary" size="lg" style={{ width: '100%' }} onClick={initiateGoogleLogin}>
        Continue with Google
      </Button>
    </Card>
  </div>
);

export default Auth;
