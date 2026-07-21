import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', onClick, disabled, type = 'button', className = '' }) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: 500,
    borderRadius: variant === 'pill' ? '9999px' : '8px',
    opacity: disabled ? 0.6 : 1,
  };

  const variants = {
    primary: { background: 'var(--accent-primary)', color: 'white' },
    pill: { background: 'var(--accent-primary)', color: 'white', borderRadius: '9999px' },
    ghost: { background: 'transparent', border: '1px solid var(--accent-primary)', color: 'white' },
    danger: { background: 'var(--danger)', color: 'white' },
    success: { background: 'var(--success)', color: 'white' },
  };

  const sizes = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
  };

  const style = { ...baseStyle, ...variants[variant === 'pill' ? 'pill' : variant], ...sizes[size] };

  const handleMouseEnter = (e) => {
    if (disabled) return;
    if (variant === 'primary' || variant === 'pill') e.currentTarget.style.background = 'var(--accent-secondary)';
    if (variant === 'ghost') e.currentTarget.style.background = 'var(--accent-primary)';
  };

  const handleMouseLeave = (e) => {
    if (disabled) return;
    if (variant === 'primary' || variant === 'pill') e.currentTarget.style.background = 'var(--accent-primary)';
    if (variant === 'ghost') e.currentTarget.style.background = 'transparent';
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled} 
      className={className} 
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
};

export default Button;
