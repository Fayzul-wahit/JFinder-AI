import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../common';
import { Menu, X } from 'lucide-react';

const Navbar = ({ isAuthenticated, user, onLogout }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navStyle = {
    background: 'rgba(10,10,26,0.95)',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    borderBottom: '1px solid var(--border-color)',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const links = [
    { name: 'Home', path: '/' },
    { name: 'News', path: '/news' },
    { name: 'Companies', path: '/companies' },
    { name: 'Career Insights', path: '/readiness' },
    { name: 'Resources', path: '/roadmap' },
    { name: 'About', path: '/about' }
  ];

  return (
    <nav style={navStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'var(--accent-primary)', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
          JF
        </div>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'white' }}>JFinder <span style={{ color: 'var(--accent-primary)' }}>AI</span></span>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Career Compass</div>
        </div>
      </div>

      <div className="desktop-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {links.map(link => (
          <Link 
            key={link.name} 
            to={link.path}
            style={{
              color: location.pathname === link.path ? 'white' : 'var(--text-secondary)',
              borderBottom: location.pathname === link.path ? '2px solid var(--accent-primary)' : 'none',
              paddingBottom: '4px',
              transition: 'color 0.2s'
            }}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {isAuthenticated ? (
          <Button variant="ghost" onClick={onLogout}>Logout</Button>
        ) : (
          <Link to="/login"><Button variant="pill">Login</Button></Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
