import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../common';
import { Menu, X } from 'lucide-react';

const Navbar = ({ isAuthenticated, user, onLogout }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'News', path: '/news' },
    { name: 'Companies', path: '/company-intelligence' },
    { name: 'Career Insights', path: '/readiness' },
    { name: 'Resources', path: '/roadmap' },
    { name: 'About', path: '/about' }
  ];

  return (
    <nav className="navbar-container">
      {/* Brand Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ background: 'var(--accent-primary)', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>
          JF
        </div>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: '1.15rem', color: 'white' }}>
            JFinder <span style={{ color: 'var(--accent-primary)' }}>AI</span>
          </span>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>AI Career Compass</div>
        </div>
      </Link>

      {/* Desktop Navigation Links */}
      <div className="navbar-desktop-links">
        {links.map(link => (
          <Link 
            key={link.name} 
            to={link.path}
            style={{
              color: location.pathname === link.path ? 'white' : 'var(--text-secondary)',
              borderBottom: location.pathname === link.path ? '2px solid var(--accent-primary)' : '2px solid transparent',
              paddingBottom: '4px',
              fontSize: '0.9rem',
              fontWeight: location.pathname === link.path ? '600' : '400',
              transition: 'all 0.2s'
            }}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Auth Action Buttons & Mobile Hamburger Icon */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        {isAuthenticated ? (
          <Button variant="ghost" size="sm" onClick={onLogout}>Logout</Button>
        ) : (
          <Link to="/login"><Button variant="pill" size="sm">Login</Button></Link>
        )}

        {/* Hamburger Menu Toggle Icon */}
        <button 
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} color="#fff" /> : <Menu size={24} color="#fff" />}
        </button>
      </div>

      {/* Full Screen Dropdown Menu on Mobile */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-dropdown">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'var(--accent-primary)', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                JF
              </div>
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>
                JFinder <span style={{ color: 'var(--accent-primary)' }}>AI</span>
              </span>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '8px', minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={28} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
            {links.map(link => (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: location.pathname === link.path ? '#A855F7' : 'white',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)'
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
            {isAuthenticated ? (
              <Button variant="danger" style={{ width: '100%', minHeight: '44px' }} onClick={() => { setMobileMenuOpen(false); onLogout(); }}>
                Logout
              </Button>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" style={{ width: '100%', minHeight: '44px' }}>
                  Login / Sign Up
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
