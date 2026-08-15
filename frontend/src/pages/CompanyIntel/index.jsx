import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { 
  Building2, MapPin, Users, Calendar, Briefcase, 
  Info, X, ChevronRight, Search 
} from 'lucide-react';
import './CompanyIntel.css';

const CompanyIntel = () => {
  const { user } = useAuth();
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('auth'))?.user; } catch { return null; }
  })();
  const currentUser = user || storedUser || {};

  const [companies, setCompanies] = useState([]);
  const [targetCompany, setTargetCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Detail panel state
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/companies');
      if (res.data && res.data.success) {
        setCompanies(res.data.data);
        
        // Find target company
        const dreamCo = currentUser.dreamCompany;
        if (dreamCo) {
          const target = res.data.data.find(c => 
            c.companyName.toLowerCase() === dreamCo.toLowerCase() || 
            c.companyName.toLowerCase().includes(dreamCo.toLowerCase())
          );
          if (target) setTargetCompany(target);
        }
      }
    } catch (err) {
      console.error('Failed to fetch companies', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    try {
      const res = await api.get(`/api/companies/search?q=${query}`);
      if (res.data && res.data.success) {
        setCompanies(res.data.data);
      }
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  const openDetails = async (companyId) => {
    setSelectedCompanyId(companyId);
    try {
      setDetailLoading(true);
      const res = await api.get(`/api/companies/${companyId}`);
      if (res.data && res.data.success) {
        setDetailData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch company details', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedCompanyId(null);
    setDetailData(null);
  };

  const getStatusClass = (status) => {
    if (!status) return 'active';
    const s = status.toLowerCase();
    if (s.includes('active')) return 'active';
    if (s.includes('moderate')) return 'moderate';
    return 'selective';
  };

  if (loading) {
    return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading companies...</div>;
  }

  return (
    <div className="company-intel-page">
      {/* ── Header ── */}
      <div className="ci-header">
        <h1 className="ci-title">Company Intelligence</h1>
        <p className="ci-subtitle">Real-time insights into company hiring trends and requirements</p>
        
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="ci-search" 
            placeholder="Search companies by name, industry..." 
            value={searchQuery}
            onChange={handleSearch}
            style={{ paddingLeft: '40px' }}
          />
        </div>
      </div>

      <div className="ci-info-banner">
        <Info size={16} />
        Data shown reflects publicly available market trends and general hiring patterns. JFinder AI does not claim knowledge of individual hiring decisions.
      </div>

      {/* ── Target Company Card ── */}
      {targetCompany && !searchQuery && (
        <div className="target-company-section">
          <h2 className="companies-grid-title" style={{ fontSize: '1.25rem' }}>Your Target Company</h2>
          <div className="target-company-card">
            <div className="tc-header">
              <div>
                <h3 className="tc-name">{targetCompany.companyName}</h3>
                <div className="tc-badges">
                  <span className="badge-industry">{targetCompany.industry}</span>
                  <span className={`badge-status ${getStatusClass(targetCompany.hiringStatus)}`}>
                    {targetCompany.hiringStatus} Hiring
                  </span>
                </div>
              </div>
              <button 
                className="lesson-btn start" 
                onClick={() => openDetails(targetCompany._id)}
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
              >
                View Full Details <ChevronRight size={16} style={{ verticalAlign: 'middle' }} />
              </button>
            </div>
            <p className="tc-desc">{targetCompany.companyDescription}</p>
            <div className="tc-meta">
              <div className="tc-meta-item"><MapPin size={16} /> {targetCompany.headquarters}</div>
              <div className="tc-meta-item"><Users size={16} /> {targetCompany.companySize} Employees</div>
              <div className="tc-meta-item"><Calendar size={16} /> Founded {targetCompany.foundedYear}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── All Companies Grid ── */}
      <h2 className="companies-grid-title">All Companies</h2>
      <div className="companies-grid">
        {companies.map(company => (
          <div key={company._id} className="company-card">
            <div>
              <h3 className="cc-name">{company.companyName}</h3>
              <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
                <span className={`badge-status ${getStatusClass(company.hiringStatus)}`}>
                  {company.hiringStatus}
                </span>
              </div>
            </div>
            
            <div className="cc-meta">
              <div className="cc-meta-row"><Building2 size={14} /> {company.industry}</div>
              <div className="cc-meta-row"><MapPin size={14} /> {company.headquarters}</div>
              <div className="cc-meta-row"><Users size={14} /> {company.companySize}</div>
            </div>
            
            <button 
              className="lesson-btn start" 
              onClick={() => openDetails(company._id)}
              style={{ marginTop: 'auto', textAlign: 'center', justifyContent: 'center' }}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* ── Detail Panel (Slide-in) ── */}
      {selectedCompanyId && (
        <div className="detail-overlay" onClick={closeDetails}>
          <div className="detail-panel" onClick={e => e.stopPropagation()}>
            {detailLoading || !detailData ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading details...</div>
            ) : (
              <>
                <div className="dp-header">
                  <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem' }}>
                      {detailData.company.companyName}
                    </h2>
                    <span className={`badge-status ${getStatusClass(detailData.company.hiringStatus)}`}>
                      {detailData.company.hiringStatus} Hiring
                    </span>
                  </div>
                  <button className="dp-close" onClick={closeDetails}><X size={24} /></button>
                </div>
                
                <div className="dp-content">
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {detailData.company.companyDescription}
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="cc-meta-row" style={{ color: 'var(--text-muted)' }}><Building2 size={16} /> {detailData.company.industry}</div>
                    <div className="cc-meta-row" style={{ color: 'var(--text-muted)' }}><MapPin size={16} /> {detailData.company.headquarters}</div>
                    <div className="cc-meta-row" style={{ color: 'var(--text-muted)' }}><Users size={16} /> {detailData.company.companySize}</div>
                    <div className="cc-meta-row" style={{ color: 'var(--text-muted)' }}><Calendar size={16} /> Est. {detailData.company.foundedYear}</div>
                  </div>
                  
                  <div>
                    <h3 className="dp-section-title">Jobs Available</h3>
                    {detailData.jobs && detailData.jobs.length > 0 ? (
                      detailData.jobs.map(job => (
                        <div key={job._id} className="dp-job-card">
                          <div className="dp-job-title">{job.jobRole}</div>
                          <div className="dp-job-meta">
                            <div className="dp-job-meta-item"><Briefcase size={14} /> {job.department}</div>
                            <div className="dp-job-meta-item"><Calendar size={14} /> {job.experienceRequired}</div>
                            <div className="dp-job-meta-item"><Building2 size={14} /> {job.workMode}</div>
                            <div className="dp-job-meta-item" style={{ color: '#A855F7' }}>💰 {job.salaryRange}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No open positions currently listed in the database.</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="dp-section-title">Required Skills</h3>
                    {detailData.requiredSkills && detailData.requiredSkills.length > 0 ? (
                      <div className="dp-skills-grid">
                        {/* Deduplicate skills for display */}
                        {Array.from(new Set(detailData.requiredSkills.map(s => s.skillName))).map((skill, idx) => (
                          <span key={idx} className="dp-skill-pill">{skill}</span>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Skill data not available for this company.</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="dp-section-title">Similar Companies</h3>
                    {detailData.similarCompanies && detailData.similarCompanies.length > 0 ? (
                      <div className="dp-similar-grid">
                        {detailData.similarCompanies.map(sim => (
                          <div key={sim._id} className="dp-similar-card" onClick={() => openDetails(sim._id)}>
                            <div style={{ color: '#fff', fontWeight: 600 }}>{sim.companyName}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{sim.industry}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No similar companies found.</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyIntel;
