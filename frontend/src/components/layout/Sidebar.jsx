import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Target, TrendingUp, Building2, Briefcase, FolderGit2, Award, Newspaper, Bot, User, Settings } from 'lucide-react';

const Sidebar = () => {
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
    { name: 'AI Mentor', path: '/ai-mentor', icon: <Bot size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside style={sidebarStyle}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'var(--accent-primary)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white', fontSize: '0.875rem' }}>
          JF
        </div>
        <span style={{ fontWeight: 'bold', fontSize: '1.125rem', color: 'white' }}>JFinder <span style={{ color: 'var(--accent-primary)' }}>AI</span></span>
      </div>

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

      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={20} />
        </div>
        <div>
          <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: 500 }}>User Name</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>user@example.com</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
