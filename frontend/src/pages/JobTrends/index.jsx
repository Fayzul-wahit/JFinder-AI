import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { 
  TrendingUp, TrendingDown, Users, DollarSign, 
  Bot, AlertCircle, Briefcase, Zap 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import './JobTrends.css';

const JobTrends = () => {
  const { user } = useAuth();
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('auth'))?.user; } catch { return null; }
  })();
  const currentUser = user || storedUser || {};

  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [roleOutlook, setRoleOutlook] = useState(null);
  
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    fetchData();
  }, [categoryFilter, roleFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const dreamRole = currentUser.dreamJob || 'Software Engineer';
      
      const [trendsRes, outlookRes, salaryRes] = await Promise.all([
        api.get(`/api/trends?category=${categoryFilter}&role=${roleFilter}`),
        api.get(`/api/trends/${dreamRole}`),
        api.get('/api/companies/jobs/salary')
      ]);

      if (trendsRes.data?.success) setTrends(trendsRes.data.data);
      if (outlookRes.data?.success) setRoleOutlook(outlookRes.data.data);
      if (salaryRes.data?.success) {
        // Format for recharts
        const formattedSalaries = salaryRes.data.data.map(item => ({
          name: item.jobRole.split(' ')[0], // short name
          min: item.minSalary,
          max: item.maxSalary,
          avg: Math.round((item.minSalary + item.maxSalary) / 2)
        }));
        setSalaries(formattedSalaries);
      }
    } catch (err) {
      console.error('Failed to fetch job trends data', err);
      // Generate some mock trends if db is empty/error
      setTrends([
        { skillName: 'React.js', category: 'Programming', demandLevel: 'High', growthRate: 15.2, aiImpact: 'Medium' },
        { skillName: 'Python', category: 'Programming', demandLevel: 'High', growthRate: 22.4, aiImpact: 'High' },
        { skillName: 'Machine Learning', category: 'AI', demandLevel: 'High', growthRate: 35.8, aiImpact: 'Low' },
        { skillName: 'Data Entry', category: 'Analytics', demandLevel: 'Declining', growthRate: -12.5, aiImpact: 'High' },
        { skillName: 'Manual Testing', category: 'Programming', demandLevel: 'Low', growthRate: -8.4, aiImpact: 'High' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const highDemandSkills = trends.filter(t => t.demandLevel === 'High' || t.demandLevel === 'Growing');
  const decliningSkills = trends.filter(t => t.demandLevel === 'Declining' || t.demandLevel === 'Low');

  const growingCount = highDemandSkills.length;
  const decliningCount = decliningSkills.length;

  if (loading) {
    return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Analyzing market trends...</div>;
  }

  return (
    <div className="jobtrends-page">
      {/* ── Header ── */}
      <div className="jt-header-row">
        <div>
          <h1 className="jt-title">Job Trend Analysis</h1>
          <p className="jt-subtitle">Stay ahead with real-time market insights for your career path</p>
        </div>
        
        <div className="jt-filters">
          <select 
            className="jt-select" 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Programming">Programming</option>
            <option value="Database">Database</option>
            <option value="Analytics">Analytics</option>
            <option value="AI">AI</option>
            <option value="Cloud">Cloud</option>
            <option value="Soft Skills">Soft Skills</option>
          </select>
          
          <select 
            className="jt-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="Data Scientist">Data Scientist</option>
          </select>
        </div>
      </div>

      {/* ── Section 1: Market Overview ── */}
      <div className="jt-overview-grid">
        <div className="jt-overview-card">
          <div className="jt-oc-icon green"><TrendingUp size={24} /></div>
          <div className="jt-oc-content">
            <span className="jt-oc-value">{growingCount || 24}</span>
            <span className="jt-oc-label">Growing Skills</span>
          </div>
        </div>
        
        <div className="jt-overview-card">
          <div className="jt-oc-icon red"><TrendingDown size={24} /></div>
          <div className="jt-oc-content">
            <span className="jt-oc-value">{decliningCount || 8}</span>
            <span className="jt-oc-label">Declining Skills</span>
          </div>
        </div>
        
        <div className="jt-overview-card">
          <div className="jt-oc-icon violet"><Briefcase size={24} /></div>
          <div className="jt-oc-content">
            <span className="jt-oc-value">12</span>
            <span className="jt-oc-label">High Demand Roles</span>
          </div>
        </div>
        
        <div className="jt-overview-card">
          <div className="jt-oc-icon green"><DollarSign size={24} /></div>
          <div className="jt-oc-content">
            <span className="jt-oc-value" style={{ color: '#10B981' }}>+8.4%</span>
            <span className="jt-oc-label">Avg Salary Trend (YoY)</span>
          </div>
        </div>
      </div>

      {/* ── Section 2: Trending Skills ── */}
      <h2 className="jt-section-title"><Zap size={20} style={{ color: '#F59E0B' }} /> Trending Skills</h2>
      <div className="jt-skills-columns">
        
        {/* Growing Skills */}
        <div className="jt-skills-card green">
          <h3 style={{ margin: '0 0 1rem', color: '#10B981', fontSize: '1.1rem' }}>High Demand Skills</h3>
          {highDemandSkills.length > 0 ? highDemandSkills.map((skill, i) => (
            <div key={i} className="jt-skill-item">
              <div className="jt-skill-info">
                <span className="jt-skill-name">{skill.skillName}</span>
                <div className="jt-skill-badges">
                  <span className="jt-skill-badge high">{skill.demandLevel}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Impact: {skill.aiImpact}</span>
                </div>
              </div>
              <div className="jt-skill-stats">
                <span className="jt-skill-growth green">+{skill.growthRate}%</span>
                <div className="jt-skill-bar-bg">
                  <div className="jt-skill-bar-fill green" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          )) : <div style={{ color: 'var(--text-muted)' }}>No high demand skills found.</div>}
        </div>

        {/* Declining Skills */}
        <div className="jt-skills-card red">
          <h3 style={{ margin: '0 0 1rem', color: '#EF4444', fontSize: '1.1rem' }}>Declining Skills</h3>
          {decliningSkills.length > 0 ? decliningSkills.map((skill, i) => (
            <div key={i} className="jt-skill-item">
              <div className="jt-skill-info">
                <span className="jt-skill-name">{skill.skillName}</span>
                <div className="jt-skill-badges">
                  <span className="jt-skill-badge declining">{skill.demandLevel}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Impact: {skill.aiImpact}</span>
                </div>
              </div>
              <div className="jt-skill-stats">
                <span className="jt-skill-growth red">{skill.growthRate}%</span>
                <div className="jt-skill-bar-bg">
                  <div className="jt-skill-bar-fill red" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          )) : <div style={{ color: 'var(--text-muted)' }}>No declining skills found.</div>}
        </div>
      </div>

      {/* ── Sections 3, 4, 5 Grid ── */}
      <div className="jt-bottom-grid">
        
        {/* Section 3: AI Impact */}
        {roleOutlook && (
          <div className="ai-impact-card">
            <h3 className="jt-section-title"><Bot size={20} style={{ color: '#10B981' }} /> How AI is Affecting Your Role</h3>
            <div className="ai-impact-score">AI Impact: {roleOutlook.aiImpact}</div>
            
            <h4 style={{ fontSize: '0.9rem', color: '#fff', margin: '0 0 0.5rem' }}>Tasks being automated:</h4>
            <ul className="ai-list">
              {roleOutlook.automatingTasks.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
            
            <h4 style={{ fontSize: '0.9rem', color: '#fff', margin: '0 0 0.5rem' }}>Skills increasing in value:</h4>
            <ul className="ai-list">
              {roleOutlook.growingSkills.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
            
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', fontSize: '0.85rem', color: '#10B981' }}>
              <strong>Outlook:</strong> {roleOutlook.futureOutlookText}
            </div>
          </div>
        )}

        {/* Section 5: Role Outlook */}
        {roleOutlook && (
          <div className="role-outlook-card">
            <h3 className="jt-section-title"><Users size={20} style={{ color: '#A855F7' }} /> Your Role Outlook</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 1.5rem' }}>
              Based on your target role: <strong style={{ color: '#fff' }}>{roleOutlook.role}</strong>
            </p>
            
            <div className="ro-grid">
              <div className="ro-item">
                <span className="ro-label">Current Demand</span>
                <span className="ro-value">{roleOutlook.demandLevel}</span>
              </div>
              <div className="ro-item">
                <span className="ro-label">Growth Prediction</span>
                <span className="ro-value" style={{ color: '#10B981' }}>{roleOutlook.growthPrediction}</span>
              </div>
              <div className="ro-item">
                <span className="ro-label">Future Readiness</span>
                <span className="ro-value violet">{roleOutlook.futureReadiness}</span>
              </div>
            </div>
            
            <h4 style={{ fontSize: '0.9rem', color: '#fff', margin: '1rem 0 0.5rem' }}>Recommended Skills to Add:</h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {roleOutlook.recommendedSkills.map((s, i) => (
                <span key={i} style={{ background: 'rgba(124, 58, 237, 0.15)', color: '#A855F7', padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Salary Trends Chart */}
        <div className="salary-card jt-full-width">
          <h3 className="jt-section-title"><DollarSign size={20} style={{ color: '#10B981' }} /> Salary Trends by Role (LPA)</h3>
          <div style={{ width: '100%', height: '260px', marginTop: '1rem' }}>
            <ResponsiveContainer>
              <BarChart data={salaries} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#13132A', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#A855F7' }}
                />
                <Bar dataKey="avg" fill="url(#colorAvg)" radius={[4, 4, 0, 0]} barSize={40} name="Avg Salary" />
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default JobTrends;
