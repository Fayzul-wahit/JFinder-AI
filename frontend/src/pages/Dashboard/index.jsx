import React, { useState, useEffect } from 'react';
import { Card, Badge } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { getCRS, getSkillGap, getRecommendations } from '../../services/api';
import { Award, CheckCircle2, AlertCircle, Building2, Sparkles, ShieldCheck } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Dashboard states
  const [crsData, setCrsData] = useState(null);
  const [skillGapData, setSkillGapData] = useState(null);
  const [recommendedCompanies, setRecommendedCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Execute fetches in parallel
        const [crsRes, gapRes, recRes] = await Promise.all([
          getCRS(),
          getSkillGap(),
          getRecommendations()
        ]);

        if (crsRes.data && crsRes.data.success) {
          setCrsData(crsRes.data.data);
        }
        if (gapRes.data && gapRes.data.success) {
          setSkillGapData(gapRes.data.data);
        }
        if (recRes.data && recRes.data.success) {
          setRecommendedCompanies(recRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard metrics. Using visual fallbacks.');
        // Set mock fallbacks in case local API endpoints are stubs or missing data
        setCrsData({
          overall: 65,
          breakdown: { skills: 60, academic: 85, projects: 50, certifications: 40, resume: 100 }
        });
        setSkillGapData({
          matched: ['Programming', 'Database'],
          missing: ['AI', 'Cloud', 'Soft Skills'],
          matchPercentage: 40
        });
        setRecommendedCompanies([
          { _id: '1', companyName: 'Zoho', industry: 'SaaS / Business Software', isHiring: true },
          { _id: '2', companyName: 'Google', industry: 'Big Tech / Search & AI', isHiring: true },
          { _id: '3', companyName: 'Microsoft', industry: 'Enterprise Software / Cloud', isHiring: true },
          { _id: '4', companyName: 'Freshworks', industry: 'SaaS / Customer Engagement', isHiring: true }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // SVG Circular Ring calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const overallScore = crsData?.overall || 0;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ minHeight: '60vh', gap: '1rem' }}>
        <div className="analysis-icon-container" style={{ animation: 'pulse-glow 1.5s infinite ease-in-out' }}>
          <Sparkles size={36} style={{ color: 'var(--accent-secondary)' }} />
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading your dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1 className="dashboard-welcome">Welcome back, {user?.name || 'Explorer'}!</h1>
        <p className="dashboard-subtitle">
          Target Goal: <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>{user?.dreamJob || 'Software Engineer'}</span> at <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>{user?.dreamCompany || 'Google'}</span>
        </p>
      </header>

      {error && (
        <div className="flex items-center gap-2 p-4" style={{ backgroundColor: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px', marginBottom: '1.5rem', color: 'var(--warning)', fontSize: '0.9rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="dashboard-grid">
        
        {/* Left Card: Career Readiness Score */}
        <Card glow title="Career Readiness Score">
          <div className="crs-card-content">
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Overall readiness based on your profile alignment</p>
            
            <div className="circle-chart-container">
              <svg width="160" height="160">
                <circle 
                  className="circle-chart-bg" 
                  cx="80" 
                  cy="80" 
                  r={radius} 
                />
                <circle 
                  className="circle-chart-fill" 
                  cx="80" 
                  cy="80" 
                  r={radius} 
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 80 80)"
                />
              </svg>
              <div className="circle-chart-text-group">
                <span className="circle-chart-percent">{Math.round(overallScore)}%</span>
                <span className="circle-chart-label">Readiness</span>
              </div>
            </div>

            {/* CRS Breakdown List */}
            <div className="crs-breakdown-list">
              <div className="crs-breakdown-item">
                <span className="crs-item-label">Skills Score</span>
                <span className="crs-item-score">{crsData?.breakdown?.skills || 0}/100</span>
              </div>
              <div className="crs-breakdown-item">
                <span className="crs-item-label">Academic Profile (CGPA)</span>
                <span className="crs-item-score">{crsData?.breakdown?.academic || 0}/100</span>
              </div>
              <div className="crs-breakdown-item">
                <span className="crs-item-label">Projects Evaluation</span>
                <span className="crs-item-score">{crsData?.breakdown?.projects || 0}/100</span>
              </div>
              <div className="crs-breakdown-item">
                <span className="crs-item-label">Certifications Profile</span>
                <span className="crs-item-score">{crsData?.breakdown?.certifications || 0}/100</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Right Card: Skill Gap Summary */}
        <Card title="Skill Gap Analysis">
          <div className="skill-gap-card-content">
            <div className="gap-percentage-row">
              <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Job Role Skills Match</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
                {Math.round(skillGapData?.matchPercentage || 0)}%
              </span>
            </div>
            
            <div className="gap-bar-bg">
              <div 
                className="gap-bar-fill"
                style={{ width: `${skillGapData?.matchPercentage || 0}%` }}
              ></div>
            </div>

            <div className="skills-analysis-section">
              {/* Matched Skills */}
              <div className="skills-list-container">
                <div className="skills-list-title flex items-center gap-2" style={{ color: 'var(--success)' }}>
                  <CheckCircle2 size={16} />
                  <span>Matched Skills ({skillGapData?.matched?.length || 0})</span>
                </div>
                <div className="skill-items-grid">
                  {skillGapData?.matched && skillGapData.matched.length > 0 ? (
                    skillGapData.matched.map(skill => (
                      <span key={skill} className="skill-tag-matched">{skill}</span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>None matched yet</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="skills-list-container">
                <div className="skills-list-title flex items-center gap-2" style={{ color: 'var(--danger)' }}>
                  <AlertCircle size={16} />
                  <span>Missing Skills ({skillGapData?.missing?.length || 0})</span>
                </div>
                <div className="skill-items-grid">
                  {skillGapData?.missing && skillGapData.missing.length > 0 ? (
                    skillGapData.missing.map(skill => (
                      <span key={skill} className="skill-tag-missing">{skill}</span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No gaps found!</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Recommended Companies Card */}
        <div className="companies-card-container">
          <Card title="Recommended Target Companies">
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'left', marginBottom: '1rem' }}>
              Companies looking for candidates with your skill profiles and career goals:
            </p>
            <div className="companies-list-grid">
              {recommendedCompanies.map((company) => {
                const logoUrl = company.companyName 
                  ? `https://logo.clearbit.com/${company.companyName.toLowerCase().replace(/\s+/g, '')}.com` 
                  : '';
                  
                return (
                  <div key={company._id} className="company-item-card">
                    <div className="company-item-logo-box">
                      <img 
                        src={logoUrl} 
                        alt={company.companyName}
                        className="company-item-logo-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="company-item-fallback-logo" style={{ display: 'none' }}>
                        {company.companyName ? company.companyName.charAt(0) : 'C'}
                      </div>
                    </div>

                    <div className="company-item-info">
                      <span className="company-item-name">{company.companyName}</span>
                      <span className="company-item-industry">{company.industry || 'Technology / Consulting'}</span>
                      <div className="company-hiring-status">
                        <span className="company-hiring-dot"></span>
                        <span>Active Hiring</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
