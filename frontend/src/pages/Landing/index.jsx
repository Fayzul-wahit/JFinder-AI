import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNews, getCompanies } from '../../services/api';
import { Button, Card, Badge } from '../../components/common';
import { 
  TrendingUp, Award, Users, RefreshCw, Rss, ArrowRight, Play, 
  Target, Shield, Zap, Sparkles, CheckCircle2, ChevronLeft, ChevronRight, Globe
} from 'lucide-react';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [activeCompanyHover, setActiveCompanyHover] = useState(null);

  // Fetch News and Companies on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingNews(true);
        const newsResponse = await getNews();
        if (newsResponse.data && newsResponse.data.success) {
          setNews(newsResponse.data.data);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoadingNews(false);
      }

      try {
        setLoadingCompanies(true);
        const companiesResponse = await getCompanies();
        if (companiesResponse.data && companiesResponse.data.success) {
          setCompanies(companiesResponse.data.data);
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchData();
  }, []);

  // Filter trending news for the Hero carousel
  const trendingNews = news.filter(item => item.isTrending);

  // Auto-rotate Hero Carousel every 6 seconds
  useEffect(() => {
    if (trendingNews.length <= 1) return;
    const interval = setInterval(() => {
      setCarouselIndex((prevIndex) => (prevIndex + 1) % trendingNews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [trendingNews]);

  // Handle Tab Switch
  const filteredNews = news.filter(item => {
    if (activeTab === 'All') return true;
    return item.category.toLowerCase() === activeTab.toLowerCase();
  });

  const scrollNews = () => {
    const element = document.getElementById('news-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCompanyLogoError = (e, companyName) => {
    e.target.onerror = null; 
    // Fallback: draw a letter badge instead of broken image
    e.target.style.display = 'none';
    const parent = e.target.parentNode;
    const fallbackText = document.createElement('span');
    fallbackText.innerText = companyName.substring(0, 2).toUpperCase();
    fallbackText.style.color = 'var(--accent-highlight)';
    fallbackText.style.fontWeight = 'bold';
    fallbackText.style.fontSize = '1.1rem';
    parent.appendChild(fallbackText);
  };

  return (
    <div className="landing-container">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          {/* Left Column */}
          <div className="hero-left">
            <div className="live-updates-badge">
              <span className="live-indicator-dot"></span>
              Live Updates
            </div>
            
            <div className="real-time-text">
              Real-time industry & career news
            </div>
            
            <h1 className="hero-title-white">Stay Ahead.</h1>
            <h1 className="hero-title-violet">Know the Future.</h1>
            
            <p className="hero-subtitle">
              Curated news, hiring trends, and AI-powered insights to guide your career journey. Land your dream job at your dream company.
            </p>
            
            <div className="hero-actions">
              <Button size="lg" variant="primary" onClick={scrollNews}>
                Explore News &rarr;
              </Button>
              <Button size="lg" variant="ghost" onClick={() => navigate('/auth')}>
                &#9654; Get Started
              </Button>
            </div>
            
            {/* Stats row */}
            <div className="hero-stats-row">
              <div className="hero-stat-item">
                <span className="hero-stat-number">10K+</span>
                <span className="hero-stat-label">News Articles</span>
              </div>
              <div className="hero-stat-divider">|</div>
              <div className="hero-stat-item">
                <span className="hero-stat-number">500+</span>
                <span className="hero-stat-label">Companies Tracked</span>
              </div>
              <div className="hero-stat-divider">|</div>
              <div className="hero-stat-item">
                <span className="hero-stat-number">50K+</span>
                <span className="hero-stat-label">Users</span>
              </div>
              <div className="hero-stat-divider">|</div>
              <div className="hero-stat-item">
                <span className="hero-stat-number">24/7</span>
                <span className="hero-stat-label">Updated</span>
              </div>
            </div>
          </div>

          {/* Right Column: News Carousel */}
          <div className="hero-right">
            {loadingNews ? (
              <Card glass={true} style={{ height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--text-muted)' }}>Analyzing latest career trends...</div>
              </Card>
            ) : trendingNews.length > 0 ? (
              <div className="carousel-wrapper">
                {trendingNews.map((item, index) => (
                  <div 
                    key={item.newsId || index}
                    className="carousel-card"
                    style={{ display: index === carouselIndex ? 'block' : 'none' }}
                  >
                    <Card glass={true}>
                      <div className="news-card-image-wrapper" style={{ height: '200px' }}>
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="news-card-image"
                        />
                        <div className="news-card-tags">
                          <Badge variant="purple">Global Trend</Badge>
                          <Badge variant="green">Trending</Badge>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <Badge variant="muted" size="sm">{item.category}</Badge>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>&bull; {item.readTime} min read</span>
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'white', marginBottom: '8px', lineHeight: 1.4 }}>
                        {item.title}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.summary}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>Relates to: <strong style={{ color: 'var(--accent-highlight)' }}>{item.relatedCompany}</strong></span>
                        <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </Card>
                  </div>
                ))}
                
                {/* Indicators */}
                {trendingNews.length > 1 && (
                  <div className="carousel-indicators">
                    {trendingNews.map((_, index) => (
                      <button 
                        key={index} 
                        className={`carousel-dot ${index === carouselIndex ? 'active' : ''}`}
                        onClick={() => setCarouselIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Card glass={true} style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--text-muted)' }}>No trending news found.</div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* 2. STATS BAR (Separate container) */}
      <section className="stats-bar-section">
        <div className="stats-bar-wrapper">
          <div className="stats-bar-item">
            <div className="stats-bar-value">10K+</div>
            <div className="stats-bar-label">Verified News Articles</div>
          </div>
          <div style={{ width: '1px', background: 'var(--border-color)', height: '40px' }} className="desktop-only"></div>
          <div className="stats-bar-item">
            <div className="stats-bar-value">500+</div>
            <div className="stats-bar-label">Companies Systematically Tracked</div>
          </div>
          <div style={{ width: '1px', background: 'var(--border-color)', height: '40px' }} className="desktop-only"></div>
          <div className="stats-bar-item">
            <div className="stats-bar-value">50K+</div>
            <div className="stats-bar-label">Users Onboarded</div>
          </div>
          <div style={{ width: '1px', background: 'var(--border-color)', height: '40px' }} className="desktop-only"></div>
          <div className="stats-bar-item">
            <div className="stats-bar-value">24/7</div>
            <div className="stats-bar-label">Live Placement Readiness Scoring</div>
          </div>
        </div>
      </section>

      {/* 3. LATEST NEWS & SIDEBAR SECTION */}
      <section className="news-section-container" id="news-section">
        <div className="section-header">
          <h2 className="section-title">
            <Rss size={28} style={{ color: 'var(--accent-primary)' }} />
            Latest News & Trends
          </h2>
          
          <div className="news-filter-tabs">
            {['All', 'Hiring', 'Technology', 'Economy'].map((tab) => (
              <button 
                key={tab} 
                className={`filter-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="news-grid-layout">
          {/* News list (Left) */}
          <div className="news-list-container">
            {loadingNews ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                Syncing career intelligence databases...
              </div>
            ) : filteredNews.length > 0 ? (
              <div className="news-cards-grid">
                {filteredNews.map((item, idx) => (
                  <Card key={item._id || idx}>
                    <div className="news-card-image-wrapper">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="news-card-image"
                      />
                      <div className="news-card-tags">
                        <Badge 
                          variant={
                            item.category.toLowerCase() === 'hiring' ? 'green' : 
                            item.category.toLowerCase() === 'technology' ? 'purple' : 'orange'
                          }
                          size="sm"
                        >
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Tag: {item.tag}</span>
                      <span>{item.readTime} min read</span>
                    </div>
                    
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.title}
                    </h3>
                    
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                      {item.summary}
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', marginTop: 'auto' }}>
                      <span style={{ color: 'var(--text-muted)' }}>
                        Company: <strong style={{ color: 'var(--text-primary)' }}>{item.relatedCompany}</strong>
                      </span>
                      <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed var(--border-color)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                No news articles match this category in prototype database.
              </div>
            )}
          </div>

          {/* Sidebar (Right) */}
          <div className="sidebar-container">
            {/* Widget 1: Market Pulse */}
            <Card glass={true}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={20} style={{ color: 'var(--success)' }} />
                Market Pulse
              </h3>
              <div className="market-pulse-list">
                <div className="market-pulse-item">
                  <span>AI/ML Engineers Hiring Growth</span>
                  <Badge variant="green" size="sm">+18.4%</Badge>
                </div>
                <div className="market-pulse-item">
                  <span>Full Stack Dev Demand</span>
                  <Badge variant="green" size="sm">+12.1%</Badge>
                </div>
                <div className="market-pulse-item">
                  <span>Remote Software Jobs</span>
                  <Badge variant="muted" size="sm">Stable</Badge>
                </div>
                <div className="market-pulse-item">
                  <span>Average CTC for Data Analysts</span>
                  <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>&#8377;9.5 LPA</span>
                </div>
                <div className="market-pulse-item">
                  <span>Product Management Placements</span>
                  <Badge variant="orange" size="sm">High Difficulty</Badge>
                </div>
              </div>
            </Card>

            {/* Widget 2: Trending Companies */}
            <Card>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} style={{ color: 'var(--accent-primary)' }} />
                Trending Companies
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Active industry tracking (20 total)
              </p>
              
              {loadingCompanies ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                  Loading companies...
                </div>
              ) : (
                <>
                  <div className="company-logo-grid">
                    {companies.map((company) => (
                      <div 
                        key={company.companyId} 
                        className="company-logo-card"
                        title={company.companyName}
                        onMouseEnter={() => setActiveCompanyHover(company)}
                        onMouseLeave={() => setActiveCompanyHover(null)}
                        onClick={() => navigate('/auth')}
                      >
                        <img 
                          src={company.logo} 
                          alt={company.companyName} 
                          onError={(e) => handleCompanyLogoError(e, company.companyName)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Company Mini Tooltip Box inside card */}
                  {activeCompanyHover && (
                    <div style={{ 
                      marginTop: '1.5rem', 
                      padding: '12px', 
                      background: 'var(--bg-secondary)', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color)',
                      animation: 'fadeIn 0.2s ease-in'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <strong style={{ color: 'white', fontSize: '0.9rem' }}>{activeCompanyHover.companyName}</strong>
                        <Badge 
                          variant={activeCompanyHover.hiringStatus === 'Active' ? 'green' : 'orange'} 
                          size="sm"
                        >
                          Hiring: {activeCompanyHover.hiringStatus}
                        </Badge>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                        {activeCompanyHover.companyDescription.substring(0, 100)}...
                      </p>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Size: {activeCompanyHover.companySize}</span>
                        <span>HQ: {activeCompanyHover.headquarters.split(',')[0]}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section className="features-section">
        <div className="features-section-container">
          <div className="features-header">
            <Badge variant="purple" style={{ marginBottom: '1rem' }}>Platform Features</Badge>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              Your Career Operating System
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              We don't teach or sell job postings. We guide you step-by-step to bridge your skills gap and land your dream job.
            </p>
          </div>

          <div className="features-grid">
            <Card>
              <div className="feature-card-icon"><Target size={24} /></div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>Skill Gap Engine</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Compares your skills against any target job. Highlights missing skills in high-priority learning paths.
              </p>
            </Card>

            <Card>
              <div className="feature-card-icon"><Award size={24} /></div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>Career Readiness Score</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                A weighted Readiness Index (CRS) incorporating skill matches, academic CGPA, projects, and certifications.
              </p>
            </Card>

            <Card>
              <div className="feature-card-icon"><Zap size={24} /></div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>Personalized Roadmaps</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Level-by-level learning maps with courses, videos, quizzes, and projects to gamify your career path.
              </p>
            </Card>

            <Card>
              <div className="feature-card-icon"><Shield size={24} /></div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>Company Intelligence</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Deep-dive insights on hiring statuses, salary benchmarks, work modes, and difficulty across 20+ top tier entities.
              </p>
            </Card>

            <Card>
              <div className="feature-card-icon"><TrendingUp size={24} /></div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>Job Trend Analysis</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Visual analytics showing growth rates of tech stacks, AI impacts on jobs, and salary trajectory data.
              </p>
            </Card>

            <Card>
              <div className="feature-card-icon"><Sparkles size={24} /></div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>AI Career Digital Twin</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Visualizes your career readiness curve over 3, 6, and 12 months assuming standard daily goals are met.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section className="how-it-works-section">
        <div className="how-it-works-header">
          <Badge variant="purple" style={{ marginBottom: '1rem' }}>Simple Steps</Badge>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '1rem' }}>How JFinder AI Works</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Three steps to unlock your career companion</p>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Create Career Profile</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Onboard in 2 minutes. Sync your skills, upload your resume, and select your dream company and job roles.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>AI Calculations Running</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Our AI engines compute your Skill Gap analysis, compile your Career Readiness Score, and project your Career Digital Twin.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Start Guided Path</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Follow your Duolingo-style roadmap, complete projects, verify achievements, and match with active company roles.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <Button size="lg" variant="primary" onClick={() => navigate('/auth')}>
            Begin Your Career Onboarding
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
