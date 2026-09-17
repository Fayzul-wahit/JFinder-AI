const fs = require('fs');
const path = require('path');

const files = {
  "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <title>JFinder AI — Your Personal AI Career Intelligence Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,

  "src/styles/theme.css": `:root {
  --bg-primary: #0A0A1A;
  --bg-secondary: #0F0F2E;
  --bg-card: #13132A;
  --accent-primary: #7C3AED;
  --accent-secondary: #9F67F7;
  --accent-highlight: #A855F7;
  --text-primary: #FFFFFF;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;
  --border-color: #1E1B4B;
  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
  --live: #22C55E;
}

.glassmorphism {
  backdrop-filter: blur(12px);
  background: rgba(124,58,237,0.08);
  border: 1px solid rgba(124,58,237,0.2);
}

.card-shadow {
  box-shadow: 0 4px 24px rgba(124,58,237,0.12);
}

.glow {
  box-shadow: 0 0 20px rgba(124,58,237,0.3);
}

.gradient-hero {
  background: linear-gradient(135deg, #0A0A1A 0%, #1E1B4B 50%, #0A0A1A 100%);
}

.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: 0.5rem; }
.gap-4 { gap: 1rem; }
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
`,

  "src/styles/global.css": `@import './theme.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-secondary);
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-primary); 
}

::-webkit-scrollbar-thumb {
  background: var(--accent-primary); 
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--accent-secondary); 
}

h1, h2, h3, h4, h5, h6 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

h1 { font-size: 2.5rem; font-weight: 700; }
h2 { font-size: 2rem; font-weight: 600; }
h3 { font-size: 1.75rem; font-weight: 600; }
h4 { font-size: 1.5rem; font-weight: 500; }
h5 { font-size: 1.25rem; font-weight: 500; }
h6 { font-size: 1rem; font-weight: 500; }

a {
  text-decoration: none;
  color: inherit;
}
`,

  "src/components/common/Button.jsx": `import React from 'react';
import './Button.css'; // Optional: add extra css if needed, but we can use inline styles or classes

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
`,

  "src/components/common/Card.jsx": `import React from 'react';

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
`,

  "src/components/common/Badge.jsx": `import React from 'react';

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
`,

  "src/components/common/Input.jsx": `import React, { useState } from 'react';

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
    border: \`1px solid \${error ? 'var(--danger)' : isFocused ? 'var(--accent-primary)' : 'var(--border-color)'}\`,
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
`,

  "src/components/common/Modal.jsx": `import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => document.body.style.overflow = 'unset';
  }, [isOpen]);

  if (!isOpen) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease-out'
  };

  const sizes = { sm: '400px', md: '600px', lg: '800px' };

  const modalStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--accent-primary)',
    borderRadius: '12px',
    width: '100%',
    maxWidth: sizes[size],
    padding: '24px',
    position: 'relative',
    animation: 'slideUp 0.3s ease-out'
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem' }}
          >
            &times;
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
`,

  "src/components/common/index.js": `export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Badge } from './Badge';
export { default as Input } from './Input';
export { default as Modal } from './Modal';
`,

  "src/components/layout/Navbar.jsx": `import React, { useState } from 'react';
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
          <Link to="/auth"><Button variant="pill">Login</Button></Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
`,

  "src/components/layout/Sidebar.jsx": `import React from 'react';
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
`,

  "src/components/layout/Footer.jsx": `import React from 'react';
import { Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>JFinder <span style={{ color: 'var(--accent-primary)' }}>AI</span></div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Your Personal AI Career Intelligence Platform</div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)' }}>
        <Twitter size={20} style={{ cursor: 'pointer' }} />
        <Linkedin size={20} style={{ cursor: 'pointer' }} />
        <Github size={20} style={{ cursor: 'pointer' }} />
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        &copy; 2025 JFinder AI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
`,

  "src/components/layout/index.js": `export { default as Navbar } from './Navbar';
export { default as Sidebar } from './Sidebar';
export { default as Footer } from './Footer';
`,

  "src/components/charts/ReadinessChart.jsx": `import React from 'react';
import { RadialBarChart, RadialBar, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const ReadinessChart = ({ score = 75, breakdown = {} }) => {
  const data = [
    { name: 'Score', uv: score, fill: 'var(--accent-primary)' }
  ];

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={20} data={data} startAngle={90} endAngle={-270}>
          <RadialBar minAngle={15} background clockWise dataKey="uv" cornerRadius={10} />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="2rem" fontWeight="bold">
            {score}%
          </text>
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReadinessChart;
`,

  "src/components/charts/TrendGraph.jsx": `import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TrendGraph = ({ data = [] }) => {
  const defaultData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 550 },
    { name: 'Apr', value: 450 },
    { name: 'May', value: 700 }
  ];

  const chartData = data.length ? data : defaultData;

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis dataKey="name" stroke="var(--text-muted)" />
          <YAxis stroke="var(--text-muted)" />
          <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
          <Line type="monotone" dataKey="value" stroke="var(--accent-primary)" strokeWidth={3} dot={{ fill: 'var(--accent-primary)', r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendGraph;
`,

  "src/components/charts/DigitalTwin.jsx": `import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DigitalTwin = ({ predictions = [] }) => {
  const defaultData = [
    { name: 'Current', score: 65 },
    { name: '3 Months', score: 72 },
    { name: '6 Months', score: 85 },
    { name: '12 Months', score: 95 }
  ];

  const chartData = predictions.length ? predictions : defaultData;

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis dataKey="name" stroke="var(--text-muted)" />
          <YAxis stroke="var(--text-muted)" />
          <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
          <Area type="monotone" dataKey="score" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorScore)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DigitalTwin;
`,

  "src/components/charts/index.js": `export { default as ReadinessChart } from './ReadinessChart';
export { default as TrendGraph } from './TrendGraph';
export { default as DigitalTwin } from './DigitalTwin';
`,

  "src/context/AuthContext.jsx": `import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      setUser(parsed.user);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('auth', JSON.stringify({ user: userData }));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
`,

  "src/context/UserContext.jsx": `import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({});
  const [crs, setCrs] = useState(null);
  const [roadmap, setRoadmap] = useState([]);
  const [skillGap, setSkillGap] = useState([]);

  const updateProfile = (data) => {
    setUserProfile(prev => ({ ...prev, ...data }));
  };

  const refreshData = async () => {
    // API calls to refresh context state would go here
    console.log('Refreshing user data');
  };

  return (
    <UserContext.Provider value={{ userProfile, crs, roadmap, skillGap, updateProfile, refreshData }}>
      {children}
    </UserContext.Provider>
  );
};
`,

  "src/hooks/useAuth.js": `import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => useContext(AuthContext);
`,

  "src/hooks/useUser.js": `import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export const useUser = () => useContext(UserContext);
`,

  "src/hooks/useCRS.js": `import { useUser } from './useUser';
import { calculateCRS } from '../utils/crsCalculator';
import { useState, useEffect } from 'react';

export const useCRS = () => {
  const { userProfile } = useUser();
  const [crsData, setCrsData] = useState({ crs: 0, breakdown: {}, loading: true });

  useEffect(() => {
    if (userProfile) {
      const result = calculateCRS(userProfile);
      setCrsData({ crs: result.overall, breakdown: result.breakdown, loading: false });
    }
  }, [userProfile]);

  return crsData;
};
`,

  "src/services/api.js": `import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://jfinder-backend.onrender.com',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('auth');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export const getCompanies = () => api.get('/api/companies');
export const getCompanyById = (id) => api.get(\`/api/companies/\${id}\`);
export const getJobs = () => api.get('/api/jobs');
export const getNews = (params) => api.get('/api/news', { params });
export const getTrends = () => api.get('/api/trends');
export const getUserProfile = () => api.get('/api/users/profile');
export const updateUserProfile = (data) => api.put('/api/users/profile', data);
export const getCRS = () => api.get('/api/crs');
export const getSkillGap = () => api.get('/api/skill-gap');
export const getRoadmap = (jobRole) => api.get(\`/api/roadmap/\${jobRole}\`);
export const getRecommendations = () => api.get('/api/companies/recommendations');
export const sendMentorMessage = (message) => api.post('/api/ai-mentor/chat', { message });
`,

  "src/services/auth.js": `import { api } from './api';

export const initiateGoogleLogin = () => {
  window.location.href = \`\${import.meta.env.VITE_API_URL || 'https://jfinder-backend.onrender.com'}/api/auth/google\`;
};

export const logout = () => api.post('/api/auth/logout');
export const getCurrentUser = () => api.get('/api/auth/me');
`,

  "src/utils/crsCalculator.js": `/**
 * Calculates Career Readiness Score
 * W1 (0.40): Skills (S)
 * W2 (0.10): Academic/CGPA (A)
 * W3 (0.25): Projects (P)
 * W4 (0.15): Certifications (C)
 * W5 (0.10): Resume Score (R)
 */
export const calculateCRS = (profile = {}) => {
  const { skills = [], cgpa = 0, projects = [], certifications = [], resumeUrl = '' } = profile;
  
  // Mock calculations
  const S = Math.min(skills.length * 10, 100);
  const A = (cgpa / 10) * 100;
  const P = Math.min(projects.length * 20, 100);
  const C = Math.min(certifications.length * 25, 100);
  const R = resumeUrl ? 80 : 0;

  const W1 = 0.40, W2 = 0.10, W3 = 0.25, W4 = 0.15, W5 = 0.10;

  const overall = (W1 * S) + (W2 * A) + (W3 * P) + (W4 * C) + (W5 * R);

  return {
    overall: Math.round(overall),
    breakdown: {
      skills: S,
      academic: A,
      projects: P,
      certifications: C,
      resume: R
    }
  };
};
`,

  "src/utils/helpers.js": `export const formatDate = (date) => new Date(date).toLocaleDateString();

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

export const formatSalary = (salary) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(salary);
};

export const getScoreColor = (score) => {
  if (score >= 70) return '#10B981'; // success
  if (score >= 40) return '#F59E0B'; // warning
  return '#EF4444'; // danger
};
`,

  "src/pages/Landing/index.jsx": `import React from 'react';
import { Button } from '../../components/common';

const Landing = () => (
  <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
    <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>Welcome to JFinder <span style={{ color: 'var(--accent-primary)' }}>AI</span></h1>
    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '600px' }}>
      Your Personal AI Career Intelligence Platform. Discover opportunities, analyze skills, and get personalized roadmap for your dream career.
    </p>
    <Button size="lg" variant="primary">Explore</Button>
  </div>
);

export default Landing;
`,

  "src/pages/Auth/index.jsx": `import React from 'react';
import { Card, Button } from '../../components/common';
import { initiateGoogleLogin } from '../../services/auth';

const Auth = () => (
  <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Card glow style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
      <h2>Login to JFinder AI</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Start your AI-powered career journey</p>
      <Button variant="primary" size="lg" style={{ width: '100%' }} onClick={initiateGoogleLogin}>
        Continue with Google
      </Button>
    </Card>
  </div>
);

export default Auth;
`,

  "src/pages/Onboarding/index.jsx": `import React from 'react';
import { Card } from '../../components/common';

const Onboarding = () => (
  <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
    <h1>Setup Your Profile</h1>
    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Tell us about yourself to personalize your experience.</p>
    <Card>
      <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Profile Setup Form Placeholder
      </div>
    </Card>
  </div>
);

export default Onboarding;
`,

  "src/pages/Dashboard/index.jsx": `import React from 'react';
import { Card, Badge } from '../../components/common';

const Dashboard = () => (
  <div>
    <h1>Dashboard</h1>
    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Overview of your career progress</p>
    <Card glow>
      <Badge variant="purple">Coming Soon</Badge>
    </Card>
  </div>
);

export default Dashboard;
`,

  "src/pages/Roadmap/index.jsx": `import React from 'react';
import { Card, Badge } from '../../components/common';

const Roadmap = () => (
  <div>
    <h1>Career Roadmap</h1>
    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Your personalized path to success</p>
    <Card>
      <Badge variant="purple">Coming Soon</Badge>
    </Card>
  </div>
);

export default Roadmap;
`,

  "src/pages/Readiness/index.jsx": `import React from 'react';
import { Card, Badge } from '../../components/common';
import { ReadinessChart } from '../../components/charts';

const Readiness = () => (
  <div>
    <h1>Career Readiness</h1>
    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Your current readiness score</p>
    <Card glow>
      <ReadinessChart score={78} />
    </Card>
  </div>
);

export default Readiness;
`,

  "src/pages/SkillGap/index.jsx": `import React from 'react';
import { Card, Badge } from '../../components/common';

const SkillGap = () => (
  <div>
    <h1>Skill Gap Analysis</h1>
    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Identify and bridge your skill gaps</p>
    <Card>
      <Badge variant="purple">Coming Soon</Badge>
    </Card>
  </div>
);

export default SkillGap;
`,

  "src/pages/CompanyIntel/index.jsx": `import React from 'react';
import { Card, Badge } from '../../components/common';

const CompanyIntel = () => (
  <div>
    <h1>Company Intelligence</h1>
    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Deep dive into potential employers</p>
    <Card>
      <Badge variant="purple">Coming Soon</Badge>
    </Card>
  </div>
);

export default CompanyIntel;
`,

  "src/pages/JobTrends/index.jsx": `import React from 'react';
import { Card } from '../../components/common';
import { TrendGraph } from '../../components/charts';

const JobTrends = () => (
  <div>
    <h1>Job Trend Analysis</h1>
    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Market trends and demand</p>
    <Card>
      <TrendGraph />
    </Card>
  </div>
);

export default JobTrends;
`,

  "src/pages/News/index.jsx": `import React from 'react';
import { Card, Badge } from '../../components/common';

const News = () => (
  <div>
    <h1>Industry News</h1>
    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Latest updates from the tech world</p>
    <Card>
      <Badge variant="purple">Coming Soon</Badge>
    </Card>
  </div>
);

export default News;
`,

  "src/pages/AIMentor/index.jsx": `import React from 'react';
import { Card, Badge } from '../../components/common';

const AIMentor = () => (
  <div>
    <h1>AI Mentor</h1>
    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Chat with your personalized career guide</p>
    <Card glow>
      <Badge variant="purple">Coming Soon</Badge>
    </Card>
  </div>
);

export default AIMentor;
`,

  "src/pages/Profile/index.jsx": `import React from 'react';
import { Card, Badge } from '../../components/common';

const Profile = () => (
  <div>
    <h1>Profile</h1>
    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage your personal information</p>
    <Card>
      <Badge variant="purple">Coming Soon</Badge>
    </Card>
  </div>
);

export default Profile;
`,

  "src/pages/Settings/index.jsx": `import React from 'react';
import { Card, Badge } from '../../components/common';

const Settings = () => (
  <div>
    <h1>Settings</h1>
    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Configure your application preferences</p>
    <Card>
      <Badge variant="purple">Coming Soon</Badge>
    </Card>
  </div>
);

export default Settings;
`,

  "src/App.jsx": `import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { Navbar, Sidebar, Footer } from './components/layout';
import { useAuth } from './hooks/useAuth';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Readiness from './pages/Readiness';
import SkillGap from './pages/SkillGap';
import CompanyIntel from './pages/CompanyIntel';
import JobTrends from './pages/JobTrends';
import News from './pages/News';
import AIMentor from './pages/AIMentor';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const PublicLayout = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <main style={{ flex: 1 }}>{children}</main>
    <Footer />
  </div>
);

const DashboardLayout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    <Sidebar />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Navbar isAuthenticated={true} />
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>{children}</main>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/auth" />;
  return <DashboardLayout>{children}</DashboardLayout>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Landing /></PublicLayout>} />
      <Route path="/auth" element={<PublicLayout><Auth /></PublicLayout>} />
      
      {/* Protected Routes */}
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
      <Route path="/readiness" element={<ProtectedRoute><Readiness /></ProtectedRoute>} />
      <Route path="/skill-gap" element={<ProtectedRoute><SkillGap /></ProtectedRoute>} />
      <Route path="/companies" element={<ProtectedRoute><CompanyIntel /></ProtectedRoute>} />
      <Route path="/job-trends" element={<ProtectedRoute><JobTrends /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><div><h1>Projects</h1><p>Coming Soon</p></div></ProtectedRoute>} />
      <Route path="/certifications" element={<ProtectedRoute><div><h1>Certifications</h1><p>Coming Soon</p></div></ProtectedRoute>} />
      <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
      <Route path="/ai-mentor" element={<ProtectedRoute><AIMentor /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      
      <Route path="*" element={<PublicLayout><div style={{ textAlign: 'center', padding: '4rem' }}><h2>404 - Not Found</h2></div></PublicLayout>} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
`,

  "src/main.jsx": `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`,

  ".env": `VITE_API_URL=https://jfinder-backend.onrender.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
`
};

for (const [relPath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created:', relPath);
}
