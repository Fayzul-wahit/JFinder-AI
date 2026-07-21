import React from 'react';
import { Globe, Link, ExternalLink } from 'lucide-react';

const Footer = () => {
  const linkStyle = {
    color: 'var(--text-muted)',
    transition: 'color 0.2s',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <footer style={{
      background: 'var(--bg-primary)',
      borderTop: '1px solid var(--border-color)',
      padding: '2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
    }}>
      {/* Brand */}
      <div>
        <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          JFinder <span style={{ color: 'var(--accent-primary)' }}>AI</span>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Your Personal AI Career Intelligence Platform
        </div>
      </div>

      {/* Social Links */}
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={linkStyle} title="Follow on X">
          <Globe size={20} />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={linkStyle} title="LinkedIn">
          <Link size={20} />
        </a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={linkStyle} title="GitHub">
          <ExternalLink size={20} />
        </a>
      </div>

      {/* Copyright */}
      <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        &copy; 2025 JFinder AI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
