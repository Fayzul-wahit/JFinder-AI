import React, { useState, useEffect } from "react";
import { Card, Badge } from "../../components/common";
import { useAuth } from "../../hooks/useAuth";
import { getNews, getTrends, getCompanies } from "../../services/api";
import {
  Rss, TrendingUp, Building2, Bookmark, BookmarkCheck,
  Clock, Tag, ArrowRight, Wifi, Sparkles, Search
} from "lucide-react";

const TABS = ["All", "Hiring", "Technology", "AI", "Economy", "Career"];

const catColor = (cat = "") => {
  const c = cat.toLowerCase();
  if (c.includes("hiring")) return { bg: "rgba(16,185,129,0.12)", border: "#10B981", text: "#10B981" };
  if (c.includes("tech")) return { bg: "rgba(59,130,246,0.12)", border: "#3B82F6", text: "#3B82F6" };
  if (c.includes("ai") || c.includes("ml")) return { bg: "rgba(124,58,237,0.15)", border: "#7C3AED", text: "#A855F7" };
  if (c.includes("economy") || c.includes("econ")) return { bg: "rgba(245,158,11,0.12)", border: "#F59E0B", text: "#F59E0B" };
  if (c.includes("career")) return { bg: "rgba(16,185,129,0.12)", border: "#10B981", text: "#10B981" };
  return { bg: "rgba(124,58,237,0.1)", border: "rgba(124,58,237,0.3)", text: "#A855F7" };
};

const matchTab = (item, tab) => {
  if (tab === "All") return true;
  const cat = (item.category || item.tag || "").toLowerCase();
  return cat.includes(tab.toLowerCase());
};

const FALLBACK_NEWS = [
  { _id: "1", title: "AI Companies Are Hiring 40% More Data Scientists in 2025", summary: "Tech giants and AI startups are ramping up hiring for ML engineers and data scientists as demand for AI capabilities surges across industries.", category: "Hiring", tag: "Jobs", readTime: 3, publishedAt: new Date().toISOString(), relatedCompany: "Google" },
  { _id: "2", title: "The Rise of Full-Stack AI Development", summary: "Software engineers who can build end-to-end AI-powered applications are commanding 25-35% salary premiums over traditional engineers.", category: "Technology", tag: "Skills", readTime: 4, publishedAt: new Date().toISOString(), relatedCompany: "Microsoft" },
  { _id: "3", title: "Cloud Computing Jobs See Unprecedented Growth", summary: "AWS, Azure, and GCP certifications are now among the most sought-after credentials with companies rapidly migrating to cloud infrastructure.", category: "Career", tag: "Cloud", readTime: 5, publishedAt: new Date().toISOString(), relatedCompany: "Amazon" },
  { _id: "4", title: "Tech Layoffs Stabilize as New Roles Emerge", summary: "After two years of corrections, the tech job market is stabilising with new job categories in AI governance, ML Ops, and AI safety.", category: "Economy", tag: "Layoffs", readTime: 3, publishedAt: new Date().toISOString(), relatedCompany: "Meta" },
  { _id: "5", title: "How to Negotiate Your First Tech Salary", summary: "A comprehensive guide to salary negotiation for fresh graduates entering software engineering, data science, and AI roles.", category: "Career", tag: "Salary", readTime: 6, publishedAt: new Date().toISOString(), relatedCompany: "Freshworks" },
  { _id: "6", title: "Python Overtakes Java in Enterprise Adoption", summary: "Python has surpassed Java as the most used enterprise language, driven by the AI and data science revolution sweeping the industry.", category: "Technology", tag: "Python", readTime: 4, publishedAt: new Date().toISOString(), relatedCompany: "IBM" },
];

const FALLBACK_TRENDS = [
  { title: "AI/ML Engineer Demand", growth: "+18.4%", direction: "up" },
  { title: "Full Stack Dev Jobs", growth: "+12.1%", direction: "up" },
  { title: "Cloud Architect Openings", growth: "+9.7%", direction: "up" },
  { title: "IT Support Roles", growth: "-2.1%", direction: "down" },
];

const LoadingSpinner = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem", gap: "1rem" }}>
    <div style={{ width: 40, height: 40, border: "3px solid #1E1B4B", borderTop: "3px solid #7C3AED", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading news...</p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const NewsCard = ({ item, bookmarked, onBookmark }) => {
  const col = catColor(item.category || item.tag);
  const date = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
  return (
    <div style={{ background: "#13132A", border: "1px solid #1E1B4B", borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s", cursor: "default" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(124,58,237,0.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#1E1B4B"; e.currentTarget.style.boxShadow = "none"; }}>
      {item.imageUrl && (
        <div style={{ height: 160, overflow: "hidden", background: "rgba(124,58,237,0.1)" }}>
          <img src={item.imageUrl} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
        </div>
      )}
      {!item.imageUrl && (
        <div style={{ height: 120, background: col.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Rss size={36} style={{ color: col.text, opacity: 0.5 }} />
        </div>
      )}
      <div style={{ padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
          <span style={{ background: col.bg, border: `1px solid ${col.border}`, borderRadius: 999, padding: "2px 10px", fontSize: "0.72rem", color: col.text, fontWeight: 600 }}>
            {item.category || item.tag || "General"}
          </span>
          <button onClick={() => onBookmark(item._id)} style={{ background: "none", border: "none", cursor: "pointer", color: bookmarked ? "#7C3AED" : "var(--text-muted)", display: "flex", padding: 0 }}>
            {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>
        <h3 style={{ color: "white", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.5rem", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.title}</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", lineHeight: 1.5, marginBottom: "0.75rem", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.summary}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)", fontSize: "0.75rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={11} /> {item.readTime || 3} min read</span>
            <span>{date}</span>
          </div>
          <span style={{ color: "#7C3AED", fontSize: "0.78rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
            Read More <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );
};

const News = () => {
  const { user } = useAuth();
  const profile = (() => { try { const a = localStorage.getItem("auth"); return a ? JSON.parse(a).user : {}; } catch { return {}; } })();
  const currentUser = user || profile || {};

  const [activeTab, setActiveTab] = useState("All");
  const [news, setNews] = useState([]);
  const [trends, setTrends] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("jf_bookmarks") || "[]"); } catch { return []; }
  });
  const [search, setSearch] = useState("");

  const dreamJob = currentUser.dreamJob || "";
  const dreamCompany = currentUser.dreamCompany || "";

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [newsRes, trendsRes, companiesRes] = await Promise.allSettled([
          getNews(),
          getTrends(),
          getCompanies()
        ]);
        if (newsRes.status === "fulfilled" && newsRes.value.data?.success) {
          setNews(newsRes.value.data.data);
        } else setNews(FALLBACK_NEWS);
        if (trendsRes.status === "fulfilled" && trendsRes.value.data?.success) {
          const tData = trendsRes.value.data.data;
          setTrends(Array.isArray(tData) ? tData.slice(0, 4) : FALLBACK_TRENDS);
        } else setTrends(FALLBACK_TRENDS);
        if (companiesRes.status === "fulfilled" && companiesRes.value.data?.success) {
          const hiringCos = companiesRes.value.data.data.filter(c => c.hiringStatus === "Actively Hiring" || c.isHiring).slice(0, 6);
          setCompanies(hiringCos.length > 0 ? hiringCos : companiesRes.value.data.data.slice(0, 6));
        }
      } catch { setNews(FALLBACK_NEWS); setTrends(FALLBACK_TRENDS); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const toggleBookmark = (id) => {
    const next = bookmarks.includes(id) ? bookmarks.filter(b => b !== id) : [...bookmarks, id];
    setBookmarks(next);
    localStorage.setItem("jf_bookmarks", JSON.stringify(next));
  };

  const filteredNews = news.filter(n => {
    const matchesTab = matchTab(n, activeTab);
    const matchesSearch = !search || n.title?.toLowerCase().includes(search.toLowerCase()) || n.summary?.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const personalizedNews = filteredNews.filter(n =>
    (dreamJob && (n.relatedJob || n.tag || n.category || "").toLowerCase().includes(dreamJob.toLowerCase().split(" ")[0])) ||
    (dreamCompany && (n.relatedCompany || "").toLowerCase().includes(dreamCompany.toLowerCase()))
  );

  const generalNews = filteredNews.filter(n => !personalizedNews.includes(n));

  const initials = (name) => (name || "").substring(0, 2).toUpperCase();
  const avatarColors = ["#7C3AED", "#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <div style={{ maxWidth: 1300, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <Rss size={30} style={{ color: "#7C3AED" }} /> Industry News
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Stay updated with the latest career and technology news</p>
      </div>

      {/* Search + Tabs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 240px", minWidth: 200 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search news..." style={{ width: "100%", background: "#13132A", border: "1px solid #1E1B4B", borderRadius: 10, padding: "9px 14px 9px 36px", color: "white", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: activeTab === tab ? "#7C3AED" : "rgba(255,255,255,0.04)", border: `1px solid ${activeTab === tab ? "#7C3AED" : "#1E1B4B"}`, borderRadius: 8, padding: "7px 16px", color: activeTab === tab ? "white" : "var(--text-secondary)", fontWeight: activeTab === tab ? 600 : 400, cursor: "pointer", fontSize: "0.875rem", transition: "all 0.15s" }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="news-layout-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", alignItems: "start" }}>

        {/* LEFT — News Feed */}
        <div>
          {loading ? <LoadingSpinner /> : (
            <>
              {/* Personalized */}
              {personalizedNews.length > 0 && (
                <section style={{ marginBottom: "2.5rem" }}>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "white", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: 8 }}>
                    <Sparkles size={18} style={{ color: "#7C3AED" }} />
                    For You
                  </h2>
                  {(dreamJob || dreamCompany) && (
                    <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "1rem" }}>
                      Personalized for <strong style={{ color: "#A855F7" }}>{dreamJob || dreamCompany}</strong>
                      {dreamJob && dreamCompany ? <> at <strong style={{ color: "#A855F7" }}>{dreamCompany}</strong></> : null}
                    </p>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1.25rem" }}>
                    {personalizedNews.map(item => <NewsCard key={item._id} item={item} bookmarked={bookmarks.includes(item._id)} onBookmark={toggleBookmark} />)}
                  </div>
                </section>
              )}

              {/* General */}
              <section>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "white", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
                  <TrendingUp size={18} style={{ color: "#7C3AED" }} />
                  {personalizedNews.length > 0 ? "Technology & Industry Updates" : activeTab === "All" ? "All News" : `${activeTab} News`}
                </h2>
                {generalNews.length === 0 && personalizedNews.length === 0 ? (
                  <div style={{ background: "#13132A", border: "1px dashed #1E1B4B", borderRadius: 14, padding: "3rem", textAlign: "center" }}>
                    <Rss size={48} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
                    <p style={{ color: "white", fontWeight: 600, marginBottom: 6 }}>No articles found</p>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Try a different tab or clear your search filter</p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1.25rem" }}>
                    {(generalNews.length > 0 ? generalNews : filteredNews).map(item => <NewsCard key={item._id} item={item} bookmarked={bookmarks.includes(item._id)} onBookmark={toggleBookmark} />)}
                  </div>
                )}
              </section>
            </>
          )}
        </div>

        {/* RIGHT — Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", position: "sticky", top: "1rem" }}>

          {/* Market Pulse */}
          <div style={{ background: "#13132A", border: "1px solid #1E1B4B", borderRadius: 14, padding: "1.25rem" }}>
            <h3 style={{ color: "white", fontWeight: 700, fontSize: "1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", display: "inline-block", boxShadow: "0 0 6px #10B981" }} />
              Market Pulse
            </h3>
            {(trends.length > 0 ? trends : FALLBACK_TRENDS).map((t, i) => {
              const isUp = (t.direction === "up") || (typeof t.growth === "string" && t.growth.startsWith("+")) || (t.growthRate > 0);
              const val = t.growth || (t.growthRate != null ? `${t.growthRate > 0 ? "+" : ""}${t.growthRate}%` : "N/A");
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>{t.title || t.jobRole}</span>
                  <span style={{ color: isUp ? "#10B981" : "#EF4444", fontSize: "0.82rem", fontWeight: 700 }}>{val}</span>
                </div>
              );
            })}
          </div>

          {/* Trending Companies */}
          <div style={{ background: "#13132A", border: "1px solid #1E1B4B", borderRadius: 14, padding: "1.25rem" }}>
            <h3 style={{ color: "white", fontWeight: 700, fontSize: "1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
              <Building2 size={16} style={{ color: "#7C3AED" }} /> Trending Companies
            </h3>
            {companies.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>Loading companies...</p>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: "1rem" }}>
                  {companies.slice(0, 6).map((c, i) => (
                    <div key={i} title={c.companyName} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: avatarColors[i % avatarColors.length], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem", color: "white", border: "2px solid #1E1B4B" }}>
                        {initials(c.companyName)}
                      </div>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.68rem", textAlign: "center", lineHeight: 1.2 }}>{(c.companyName || "").split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
                <a href="/company-intelligence" style={{ color: "#7C3AED", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                  View all companies <ArrowRight size={12} />
                </a>
              </>
            )}
          </div>

          {/* Quick Stats */}
          <div style={{ background: "#13132A", border: "1px solid #1E1B4B", borderRadius: 14, padding: "1.25rem" }}>
            <h3 style={{ color: "white", fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>Quick Stats</h3>
            {[
              { label: "Articles Available", value: news.length || "6+" },
              { label: "Companies Tracked", value: companies.length || "20+" },
              { label: "Updated", value: "24/7" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{s.label}</span>
                <span style={{ color: "white", fontWeight: 700, fontSize: "0.875rem" }}>{s.value}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default News;
