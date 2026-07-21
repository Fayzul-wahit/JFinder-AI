import React from 'react';

const Card = ({ children, className = '', glow, glass }) => {
  const baseStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: glow ? '0 0 20px rgba(124,58,237,0.3)' : '0 4px 24px rgba(124,58,237,0.12)',
    transition: 'transform 0.3s ease',
  };

  if (glass) {
    baseStyle.backdropFilter = 'blur(12px)';
    baseStyle.background = 'rgba(124,58,237,0.08)';
    baseStyle.border = '1px solid rgba(124,58,237,0.2)';
  }

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
  };

  return (
    <div 
      className={className} 
      style={baseStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default Card;
