import React from 'react';

const Badge = ({ children, variant = 'purple', size = 'md' }) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '999px',
    fontWeight: 500,
  };

  const sizes = {
    sm: { padding: '0.25rem 0.75rem', fontSize: '0.75rem' },
    md: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
  };

  const variants = {
    purple: { background: 'rgba(124,58,237,0.2)', color: 'var(--accent-highlight)', border: '1px solid rgba(124,58,237,0.4)' },
    green: { background: 'rgba(16,185,129,0.15)', color: 'var(--success)' },
    orange: { background: 'rgba(245,158,11,0.15)', color: 'var(--warning)' },
    red: { background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' },
    blue: { background: 'rgba(59,130,246,0.15)', color: '#3B82F6' },
    muted: { background: 'rgba(100,116,139,0.15)', color: 'var(--text-muted)' },
  };

  return (
    <span style={{ ...baseStyle, ...sizes[size], ...variants[variant] }}>
      {children}
    </span>
  );
};

export default Badge;
