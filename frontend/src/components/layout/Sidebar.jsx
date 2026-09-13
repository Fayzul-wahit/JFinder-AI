import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Target, TrendingUp, Building2, Briefcase, FolderGit2, Award, Newspaper, User, Settings, X, Brain } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ mobileOpen, onClose }) => {
  const { user } = useAuth();

  const storedUser = (() => {
    try {
      const auth = localStorage.getItem('auth');
      return auth ? JSON.parse(auth).user : null;
    } catch { return null; }
  })();
  const currentUser = user || storedUser;

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Career Roadmap', path: '/roadmap', icon: <Map size={20} /> },
    { name: 'Career Readiness', path: '/readiness', icon: <Target size={20} /> },
    { name: 'Skill Gap', path: '/skill-gap', icon: <TrendingUp size={20} /> },
    { name: 'Company Intelligence', path: '/company-intelligence', icon: <Building2 size={20} /> },
    { name: 'Job Trend Analysis', path: '/job-trends', icon: <Briefcase size={20} /> },
    { name: 'Projects', path: '/projects', icon: <FolderGit2 size={20} /> },
    { name: 'Certifications', path: '/certifications', icon: <Award size={20} /> },
    { name: 'Practice', path: '/practice', icon: <Brain size={20} /> },
    { name: 'Industry News', path: '/news', icon: <Newspaper size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Backdrop overlay for mobile screen */}
      {mobileOpen && (
        <div 
          className="sidebar-backdrop"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar-container ${mobileOpen ? 'open' : ''}`}>
        {/* Brand Logo & Mobile Close Button */}
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'var(--accent-primary)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white', fontSize: '0.875rem', flexShrink: 0 }}>
              JF
            </div>
            <span className="sidebar-brand-text">
              JFinder <span style={{ color: 'var(--accent-primary)' }}>AI</span>
            </span>
          </div>

          {/* Close button on mobile sidebar overlay */}
          <button className="sidebar-mobile-close" onClick={onClose} aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              title={item.name}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{item.icon}</span>
              <span className="sidebar-text">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info Footer */}
        <div className="sidebar-user-footer">
          <div className="sidebar-user-avatar">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <User size={18} />}
          </div>

          <div className="sidebar-user-info">
            <div className="sidebar-user-name">
              {currentUser?.name || 'User'}
            </div>
            <div className="sidebar-user-username">
              @{currentUser?.username || 'username'}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
