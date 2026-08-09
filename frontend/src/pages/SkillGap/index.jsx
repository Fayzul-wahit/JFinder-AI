import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import {
  CheckCircle2, XCircle, AlertCircle, TrendingUp,
  Sparkles, BookOpen, Plus, Check
} from 'lucide-react';
import './SkillGap.css';

const CATEGORY_COLORS = {
  Programming: '#A855F7',
  Database:    '#60A5FA',
  Analytics:   '#F59E0B',
  AI:          '#10B981',
  Cloud:       '#38BDF8',
  'Soft Skills': '#FB7185',
};

const SkillGap = () => {
  const { user } = useAuth();

  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('auth'))?.user; } catch { return null; }
  })();
  const currentUser = user || storedUser || {};

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState({});

  useEffect(() => {
    fetchSkillGap();
  }, []);

  const fetchSkillGap = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/skill-gap');
      if (res.data && res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Skill gap fetch error:', err);
      setError('Using demo data — profile may need updating.');
      // Fallback demo data
      setData({
        dreamJob: currentUser.dreamJob || 'Software Engineer',
        dreamCompany: currentUser.dreamCompany || '',
        userSkills: currentUser.skills || [],
        matchedSkills: ['Python', 'SQL'],
        missingSkills: [
          { name: 'System Design', category: 'Programming', importance: 'High', level: 'Advanced' },
          { name: 'REST APIs', category: 'Programming', importance: 'High', level: 'Intermediate' },
          { name: 'Cloud Basics', category: 'Cloud', importance: 'Medium', level: 'Beginner' },
          { name: 'Git & Version Control', category: 'Programming', importance: 'High', level: 'Beginner' },
          { name: 'Communication', category: 'Soft Skills', importance: 'Medium', level: 'Intermediate' },
        ],
        matchPercentage: 28,
        totalRequired: 10,
        totalMatched: 2,
        totalMissing: 8,
      });
    } finally {
      setLoading(false);
    }
  };

  // Sort missing skills: High → Medium → Low
  const importanceOrder = { High: 0, Medium: 1, Low: 2 };
  const sortedMissing = data?.missingSkills
    ? [...data.missingSkills].sort((a, b) =>
        (importanceOrder[a.importance] ?? 2) - (importanceOrder[b.importance] ?? 2)
      )
    : [];

  if (loading) {
    return (
      <div className="sg-loading">
        <Sparkles size={24} style={{ color: '#A855F7' }} />
        Analyzing your skill profile...
      </div>
    );
  }

  return (
    <div className="skillgap-page">
      {/* ── Header ── */}
      <h1 className="skillgap-title">Skill Gap Analysis</h1>
      <p className="skillgap-subtitle">
        Skills required for{' '}
        <span style={{ color: '#A855F7', fontWeight: 700 }}>{data?.dreamJob}</span>
        {data?.dreamCompany ? (
          <> at <span style={{ color: '#A855F7', fontWeight: 700 }}>{data.dreamCompany}</span></>
        ) : ''}{' '}
        vs your current skills
      </p>

      {error && (
        <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '10px 16px', color: '#F59E0B', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* ── Summary Cards ── */}
      <div className="skillgap-summary-row">
        <div className="summary-card">
          <span className="summary-card-label">Total Required</span>
          <span className="summary-card-value total">{data?.totalRequired || 0}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>skills needed</span>
        </div>
        <div className="summary-card">
          <span className="summary-card-label">You Have</span>
          <span className="summary-card-value have">{data?.totalMatched || 0}</span>
          <span style={{ fontSize: '0.75rem', color: '#10B981' }}>skills matched</span>
        </div>
        <div className="summary-card">
          <span className="summary-card-label">Missing</span>
          <span className="summary-card-value missing">{data?.totalMissing || 0}</span>
          <span style={{ fontSize: '0.75rem', color: '#EF4444' }}>to learn</span>
        </div>
        <div className="summary-card">
          <span className="summary-card-label">Match Rate</span>
          <span className="summary-card-value percent">{data?.matchPercentage || 0}%</span>
          <span style={{ fontSize: '0.75rem', color: '#A855F7' }}>alignment</span>
        </div>
      </div>

      {/* ── Two Column Skills View ── */}
      <div className="skillgap-columns">

        {/* LEFT — Skills You Have */}
        <div className="sg-column-card green">
          <div className="sg-column-header">
            <div className="sg-column-icon green">
              <CheckCircle2 size={18} />
            </div>
            <h3 className="sg-column-title">Skills You Have</h3>
            <span className="sg-column-count green">{data?.matchedSkills?.length || 0}</span>
          </div>

          {data?.userSkills && data.userSkills.length > 0 ? (
            <div className="skills-pill-grid">
              {data.userSkills.map((skill, i) => (
                <span key={i} className="skill-pill have">
                  <CheckCircle2 size={12} />
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="sg-empty">Add skills in your profile to see matches</p>
          )}
        </div>

        {/* RIGHT — Missing Skills */}
        <div className="sg-column-card red">
          <div className="sg-column-header">
            <div className="sg-column-icon red">
              <XCircle size={18} />
            </div>
            <h3 className="sg-column-title">Missing Skills</h3>
            <span className="sg-column-count red">{data?.totalMissing || 0}</span>
          </div>

          {data?.missingSkills && data.missingSkills.length > 0 ? (
            <div className="skills-pill-grid">
              {data.missingSkills.map((skill, i) => (
                <span key={i} className="skill-pill missing" title={`${skill.importance} priority · ${skill.level}`}>
                  <XCircle size={12} />
                  {skill.name}
                  <span className="skill-pill-category">· {skill.category}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="sg-empty" style={{ color: '#10B981' }}>🎉 No skill gaps! You match all requirements.</p>
          )}
        </div>
      </div>

      {/* ── Priority Learning List ── */}
      {sortedMissing.length > 0 && (
        <div className="priority-section">
          <div className="priority-section-title">
            <TrendingUp size={20} style={{ color: '#A855F7' }} />
            What to Learn Next (Priority Order)
          </div>

          <div className="priority-list">
            {sortedMissing.map((skill, i) => (
              <div key={i} className="priority-item">
                {/* Priority number */}
                <div className="priority-number">{i + 1}</div>

                {/* Info */}
                <div className="priority-item-info">
                  <div className="priority-item-name">{skill.name}</div>
                  <div className="priority-item-badges">
                    <span
                      className="priority-badge category"
                      style={{ color: CATEGORY_COLORS[skill.category] || '#A855F7' }}
                    >
                      {skill.category}
                    </span>
                    <span className={`priority-badge ${skill.importance.toLowerCase()}`}>
                      {skill.importance} Priority
                    </span>
                    <span className="priority-badge level">{skill.level}</span>
                  </div>
                </div>

                {/* Add to Roadmap button */}
                <button
                  className={`add-roadmap-btn ${added[skill.name] ? 'added' : ''}`}
                  onClick={() => {
                    if (!added[skill.name]) setAdded(prev => ({ ...prev, [skill.name]: true }));
                  }}
                  disabled={added[skill.name]}
                >
                  {added[skill.name] ? (
                    <><Check size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Added</>
                  ) : (
                    <><Plus size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Add to Roadmap</>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state when no missing skills */}
      {sortedMissing.length === 0 && data && (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '16px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h3 style={{ color: '#10B981', marginBottom: '0.5rem' }}>Perfect Match!</h3>
          <p style={{ color: 'var(--text-muted)' }}>You have all the skills required for {data.dreamJob}. You're placement ready!</p>
        </div>
      )}
    </div>
  );
};

export default SkillGap;
