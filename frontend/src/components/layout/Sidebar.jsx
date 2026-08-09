import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Target, TrendingUp, Building2, Briefcase, FolderGit2, Award, Newspaper, User, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();

  // Read user from context, fall back to localStorage
  const storedUser = (() => {
    try {
      const auth = localStorage.getItem('auth');
      return auth ? JSON.parse(auth).user : null;
    } catch { return null; }
  })();
  const currentUser = user || storedUser;

  const sidebarStyle = {
    width: '260px',
    height: '100vh',
    background: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0
  };

  // AI Mentor removed — it lives as a floating button on all pages
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Career Roadmap', path: '/roadmap', icon: <Map size={20} /> },
    { name: 'Career Readiness', path: '/readiness', icon: <Target size={20} /> },
    { name: 'Skill Gap', path: '/skill-gap', icon: <TrendingUp size={20} /> },
    { name: 'Company Intelligence', path: '/companies', icon: <Building2 size={20} /> },
    { name: 'Job Trend Analysis', path: '/job-trends', icon: <Briefcase size={20} /> },
    { name: 'Projects', path: '/projects', icon: <FolderGit2 size={20} /> },
    { name: 'Certifications', path: '/certifications', icon: <Award size={20} /> },
    { name: 'Industry News', path: '/news', icon: <Newspaper size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside style={sidebarStyle}>
      {/* Brand Logo */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'var(--accent-primary)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white', fontSize: '0.875rem' }}>
          JF
        </div>
        <span style={{ fontWeight: 'bold', fontSize: '1.125rem', color: 'white' }}>JFinder <span style={{ color: 'var(--accent-primary)' }}>AI</span></span>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
        {menuItems.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem 1.5rem',
              color: isActive ? 'white' : 'var(--text-secondary)',
              background: isActive ? 'var(--accent-primary)' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.2s'
            })}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Info — real data from auth context / localStorage */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Avatar initial */}
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: 'var(--accent-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, color: 'white', fontSize: '1rem', flexShrink: 0
        }}>
          {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <User size={20} />}
        </div>

        <div style={{ overflow: 'hidden' }}>
          {/* Display name */}
          <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentUser?.name || 'User'}
          </div>
          {/* @username — no email in this project */}
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            @{currentUser?.username || 'username'}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
