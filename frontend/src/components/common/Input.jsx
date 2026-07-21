import React, { useState } from 'react';

const Input = ({ label, type = 'text', placeholder, value, onChange, error, icon, className = '' }) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem'
  };

  const inputWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    background: 'var(--bg-card)',
    border: `1px solid ${error ? 'var(--danger)' : isFocused ? 'var(--accent-primary)' : 'var(--border-color)'}`,
    borderRadius: '8px',
    padding: '0.75rem',
    boxShadow: isFocused ? '0 0 10px rgba(124,58,237,0.2)' : 'none',
    transition: 'all 0.3s ease'
  };

  const inputStyle = {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-primary)',
    outline: 'none',
    width: '100%',
    marginLeft: icon ? '0.5rem' : '0'
  };

  return (
    <div className={className} style={containerStyle}>
      {label && <label style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>{label}</label>}
      <div style={inputWrapperStyle}>
        {icon && <span style={{ color: 'var(--text-muted)' }}>{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={inputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      {error && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{error}</span>}
    </div>
  );
};

export default Input;
