import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import { Card, Badge } from "../../components/common";
import { useAuth } from "../../hooks/useAuth";
import { getUserProfile, updateUserProfile } from "../../services/api";
import { calculateCRS } from "../../utils/crsCalculator";
import {
  User, Briefcase, GraduationCap, Award, FolderOpen, CheckCircle, X, Edit3, Save,
  ExternalLink, FileText, Download, Lock, Sparkles
} from "lucide-react";

const JOB_ROLES = [
  "Software Engineer", "Data Analyst", "Data Scientist", "Business Analyst",
  "Cloud Engineer", "DevOps Engineer", "AI/ML Engineer", "Cybersecurity Analyst",
  "Full Stack Developer", "Product Manager"
];

const COMPANIES = [
  "Zoho", "Accenture", "Amazon", "Google", "Microsoft", "IBM", "TCS",
  "Infosys", "Wipro", "Cognizant", "Deloitte", "Capgemini", "Oracle",
  "Adobe", "Salesforce", "Freshworks", "Tiger Analytics", "HCLTech",
  "Flipkart", "PayPal"
];

const SKILL_CATEGORIES = {
  Programming: ["python", "java", "c++", "c#", "javascript", "typescript", "go", "rust", "html", "css", "php", "ruby", "kotlin", "swift"],
  Database: ["sql", "mysql", "postgresql", "mongodb", "redis", "oracle", "sqlite", "dynamodb", "cassandra"],
  Analytics: ["power bi", "tableau", "excel", "pandas", "numpy", "matplotlib", "seaborn", "data analysis", "dax", "r", "statistics", "data modeling"],
  AI: ["machine learning", "deep learning", "tensorflow", "pytorch", "nlp", "computer vision", "scikit-learn", "keras", "bert", "opencv", "ai"],
  Cloud: ["aws", "azure", "gcp", "docker", "kubernetes", "terraform", "linux", "ci/cd", "github actions", "devops", "cloud"],
};

const getSkillCategory = (skillName = "") => {
  const lower = skillName.toLowerCase().trim();
  for (const [cat, items] of Object.entries(SKILL_CATEGORIES)) {
    if (items.some(item => lower.includes(item) || item.includes(lower))) return cat;
  }
  return "Soft Skills";
};

const skillPillStyles = {
  Programming: { bg: "rgba(59, 130, 246, 0.15)", border: "#3B82F6", text: "#60A5FA" },
  Database: { bg: "rgba(16, 185, 129, 0.15)", border: "#10B981", text: "#34D399" },
  Analytics: { bg: "rgba(245, 158, 11, 0.15)", border: "#F59E0B", text: "#FBBF24" },
  AI: { bg: "rgba(124, 58, 237, 0.15)", border: "#7C3AED", text: "#A855F7" },
  Cloud: { bg: "rgba(6, 182, 212, 0.15)", border: "#06B6D4", text: "#22D3EE" },
  "Soft Skills": { bg: "rgba(100, 116, 139, 0.15)", border: "#64748B", text: "#94A3B8" },
};

const Toast = ({ message, type, onClose }) => (
  <div style={{
    position: "fixed", top: "24px", right: "24px", zIndex: 9999,
    background: type === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
    border: `1px solid ${type === "success" ? "#10B981" : "#EF4444"}`,
    borderRadius: "10px", padding: "14px 20px",
    color: type === "success" ? "#10B981" : "#EF4444",
    display: "flex", alignItems: "center", gap: "10px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)", minWidth: "280px"
  }}>
    <CheckCircle size={18} />
    <span style={{ flex: 1 }}>{message}</span>
    <button onClick={onClose} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", display: "flex" }}>
      <X size={14} />
    </button>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
    <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{label}</span>
    <span style={{ color: "white", fontSize: "0.9rem", fontWeight: 500 }}>{value || <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Not set</span>}</span>
  </div>
);

const LoadingSpinner = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "1rem" }}>
    <div style={{ width: 40, height: 40, border: "3px solid #1E1B4B", borderTop: "3px solid #7C3AED", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading profile...</p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);
const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [userData, setUserData] = useState(() => {
    try {
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) return JSON.parse(storedAuth).user || {};
      const storedUser = localStorage.getItem("user");
      if (storedUser) return JSON.parse(storedUser) || {};
    } catch (e) { console.error(e); }
    return user || {};
  });

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Edit states
  const [editingJob, setEditingJob] = useState(false);
  const [editingCompany, setEditingCompany] = useState(false);
  const [editingLoc, setEditingLoc] = useState(false);
  const [editingSal, setEditingSal] = useState(false);

  const [dreamJob, setDreamJob] = useState("");
  const [dreamCompany, setDreamCompany] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [preferredSalary, setPreferredSalary] = useState("");
  const [saving, setSaving] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchFreshProfile = async () => {
      setLoading(true);
      try {
        const res = await getUserProfile();
        if (res.data && res.data.success) {
          const fresh = res.data.data;
          setUserData(fresh);
          setDreamJob(fresh.dreamJob || "");
          setDreamCompany(fresh.dreamCompany || "");
          setPreferredLocation(fresh.preferredLocation || "");
          setPreferredSalary(fresh.preferredSalary || "");

          const storedAuth = localStorage.getItem("auth");
          if (storedAuth) {
            const parsed = JSON.parse(storedAuth);
            parsed.user = fresh;
            localStorage.setItem("auth", JSON.stringify(parsed));
          }
          localStorage.setItem("user", JSON.stringify(fresh));
          if (setUser) setUser(fresh);
        }
      } catch (e) {
        if (e.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFreshProfile();
  }, [navigate, setUser]);

  const handleSaveGoals = async () => {
    setSaving(true);
    try {
      const payload = { dreamJob, dreamCompany, preferredLocation, preferredSalary };
      const res = await updateUserProfile(payload);
      if (res.data && res.data.success) {
        const updated = res.data.data;
        setUserData(updated);

        const storedAuth = localStorage.getItem("auth");
        if (storedAuth) {
          const parsed = JSON.parse(storedAuth);
          parsed.user = updated;
          localStorage.setItem("auth", JSON.stringify(parsed));
        }
        localStorage.setItem("user", JSON.stringify(updated));
        if (setUser) setUser(updated);

        setEditingJob(false);
        setEditingCompany(false);
        setEditingLoc(false);
        setEditingSal(false);
        showToast("Profile updated successfully!", "success");
      } else {
        showToast("Failed to update profile.", "error");
      }
    } catch (e) {
      showToast(e.response?.data?.message || "Error updating profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const crsData = calculateCRS(userData);

  // PDF Resume Generator Function using jsPDF
  const handleDownloadResumePDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20; // 2cm margin
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      const checkPageBreak = (needed = 15) => {
        if (y + needed > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
      };

      // Header: User's Full Name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42);
      doc.text(userData.name || "User Name", margin, y);
      y += 8;

      // Subheader: dreamJob | college | department
      doc.setFontSize(10.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      const subHeaderStr = [
        userData.dreamJob || "Professional",
        userData.college,
        userData.department
      ].filter(Boolean).join(" | ");
      doc.text(subHeaderStr, margin, y);
      y += 5;

      // Username
      doc.setFontSize(9.5);
      doc.setTextColor(124, 58, 237);
      doc.text(`Username: @${userData.username || "user"}`, margin, y);
      y += 7;

      // Top divider line
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.4);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      const addSectionHeading = (title) => {
        checkPageBreak(16);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11.5);
        doc.setTextColor(30, 27, 75);
        doc.text(title.toUpperCase(), margin, y);
        y += 2;
        doc.setDrawColor(124, 58, 237);
        doc.setLineWidth(0.6);
        doc.line(margin, y, pageWidth - margin, y);
        y += 6;
      };

      // Section 5 — Career Objective
      addSectionHeading("Career Objective");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      const objectiveText = `Aspiring ${userData.dreamJob || "Professional"} seeking opportunities at ${userData.dreamCompany || "top tech organizations"} and similar organizations. Passionate about building a career in ${userData.dreamJob || "technology"} with a current Career Readiness Score of ${crsData.overall}%.`;
      const splitObj = doc.splitTextToSize(objectiveText, contentWidth);
      doc.text(splitObj, margin, y);
      y += splitObj.length * 4.5 + 4;

      // Section 1 — Education
      addSectionHeading("Education");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(userData.college || "University / College", margin, y);
      y += 4.5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      const eduDetails = [
        `Degree: ${userData.degree || "Bachelor Degree"}`,
        `Department: ${userData.department || "Engineering / Science"}`,
        `Year: ${userData.currentYear || "N/A"} | Semester: ${userData.currentSemester || "N/A"}`,
        userData.cgpa ? `CGPA: ${userData.cgpa} / 10` : null
      ].filter(Boolean).join("   •   ");
      const splitEdu = doc.splitTextToSize(eduDetails, contentWidth);
      doc.text(splitEdu, margin, y);
      y += splitEdu.length * 4.5 + 4;

      // Section 2 — Technical Skills
      const skillsList = userData.skills || [];
      if (skillsList.length > 0) {
        addSectionHeading("Technical Skills");
        doc.setFontSize(9.5);

        const catMap = {};
        skillsList.forEach(s => {
          const cat = getSkillCategory(s);
          if (!catMap[cat]) catMap[cat] = [];
          catMap[cat].push(s);
        });

        Object.entries(catMap).forEach(([cat, list]) => {
          if (list.length > 0) {
            checkPageBreak(8);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(30, 27, 75);
            doc.text(`${cat}: `, margin, y);
            const prefixWidth = doc.getTextWidth(`${cat}: `);

            doc.setFont("helvetica", "normal");
            doc.setTextColor(51, 65, 85);
            const skillsStr = list.join(", ");
            const splitSkills = doc.splitTextToSize(skillsStr, contentWidth - prefixWidth);

            doc.text(splitSkills[0], margin + prefixWidth, y);
            if (splitSkills.length > 1) {
              for (let i = 1; i < splitSkills.length; i++) {
                y += 4.5;
                doc.text(splitSkills[i], margin + prefixWidth, y);
              }
            }
            y += 5.5;
          }
        });
        y += 2;
      }

      // Section 3 — Projects
      const projectsList = userData.projects || [];
      if (projectsList.length > 0) {
        addSectionHeading("Projects");
        projectsList.forEach(proj => {
          checkPageBreak(14);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(15, 23, 42);
          doc.text(proj.title || "Project Title", margin, y);
          y += 4.5;

          if (proj.description) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(71, 85, 105);
            const splitDesc = doc.splitTextToSize(proj.description, contentWidth);
            doc.text(splitDesc, margin, y);
            y += splitDesc.length * 4 + 3;
          } else {
            y += 2;
          }
        });
        y += 2;
      }

      // Section 4 — Certifications
      const certsList = userData.certifications || [];
      if (certsList.length > 0) {
        addSectionHeading("Certifications");
        certsList.forEach(cert => {
          checkPageBreak(8);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(15, 23, 42);
          const certLine = `${cert.name}${cert.organization ? ` — ${cert.organization}` : ''}${cert.date ? ` — ${cert.date}` : ''}`;
          const splitCert = doc.splitTextToSize(certLine, contentWidth);
          doc.text(splitCert, margin, y);
          y += splitCert.length * 4.5 + 2;
        });
      }

      const filename = `${(userData.name || "User").replace(/\s+/g, "_")}_Resume.pdf`;
      doc.save(filename);
      showToast("Standard Resume PDF downloaded!", "success");
    } catch (e) {
      console.error(e);
      showToast("Error generating PDF. Please try again.", "error");
    }
  };
  if (loading && !userData.name) {
    return <LoadingSpinner />;
  }

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (crsData.overall / 100) * circumference;

  const initials = (userData.name || "User")
    .trim()
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const memberSince = userData.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";

  const skillsList = userData.skills || [];
  const groupedSkills = {
    Programming: [],
    Database: [],
    Analytics: [],
    AI: [],
    Cloud: [],
    "Soft Skills": [],
  };

  skillsList.forEach(skill => {
    const cat = getSkillCategory(skill);
    groupedSkills[cat].push(skill);
  });

  const projectsList = userData.projects || [];
  const certsList = userData.certifications || [];

  const inputStyle = {
    width: "100%", background: "#0A0A1A", border: "1px solid #1E1B4B",
    borderRadius: "8px", padding: "8px 12px", color: "white",
    fontSize: "0.875rem", outline: "none", boxSizing: "border-box", minHeight: "44px"
  };

  const selectStyle = {
    ...inputStyle, appearance: "none"
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "white", marginBottom: "6px" }}>My Profile</h1>
        <p style={{ color: "var(--text-secondary)" }}>Your career profile and account details</p>
      </div>

      <div className="profile-grid-container" style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "2rem", alignItems: "start" }}>

        {/* LEFT COLUMN — Profile Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <Card glow glass>
            {/* Avatar & Header */}
            <div style={{ textAlign: "center", paddingBottom: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{
                width: "80px", height: "80px",
                background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)",
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1rem", fontSize: "1.75rem", fontWeight: 700, color: "white",
                boxShadow: "0 0 20px rgba(124,58,237,0.4)"
              }}>
                {initials}
              </div>
              <h2 style={{ color: "white", fontWeight: 700, fontSize: "1.5rem", marginBottom: "4px" }}>
                {userData.name || "User"}
              </h2>
              <p style={{ color: "#A855F7", fontSize: "0.875rem", fontWeight: 600, marginBottom: "8px" }}>
                @{userData.username || "username"}
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.4 }}>
                Aspiring <strong style={{ color: "white" }}>{userData.dreamJob || "Role"}</strong>
                {userData.dreamCompany && <> at <strong style={{ color: "white" }}>{userData.dreamCompany}</strong></>}
              </p>
            </div>

            {/* CRS Ring Chart */}
            <div style={{ padding: "1.25rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
              <div style={{ position: "relative", width: "90px", height: "90px", margin: "0 auto 8px" }}>
                <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="45" cy="45" r={radius} fill="none" stroke="#1E1B4B" strokeWidth="7" />
                  <circle cx="45" cy="45" r={radius} fill="none" stroke="#7C3AED" strokeWidth="7"
                    strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.6s ease" }} />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                  <span style={{ fontSize: "1.3rem", fontWeight: 700, color: "white" }}>{crsData.overall}%</span>
                </div>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 500 }}>Career Readiness</p>
            </div>

            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", padding: "1.25rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "8px", padding: "8px", textAlign: "center" }}>
                <span style={{ display: "block", color: "var(--text-muted)", fontSize: "0.72rem" }}>XP</span>
                <span style={{ color: "#A855F7", fontWeight: 700, fontSize: "0.95rem" }}>⚡ {userData.xp || 0}</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "8px", padding: "8px", textAlign: "center" }}>
                <span style={{ display: "block", color: "var(--text-muted)", fontSize: "0.72rem" }}>Lessons</span>
                <span style={{ color: "white", fontWeight: 700, fontSize: "0.95rem" }}>{userData.completedLessons?.length || 0}</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "8px", padding: "8px", textAlign: "center" }}>
                <span style={{ display: "block", color: "var(--text-muted)", fontSize: "0.72rem" }}>Certs</span>
                <span style={{ color: "white", fontWeight: 700, fontSize: "0.95rem" }}>{certsList.length}</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "8px", padding: "8px", textAlign: "center" }}>
                <span style={{ display: "block", color: "var(--text-muted)", fontSize: "0.72rem" }}>Projects</span>
                <span style={{ color: "white", fontWeight: 700, fontSize: "0.95rem" }}>{projectsList.length}</span>
              </div>
            </div>

            {/* Member Since */}
            <div style={{ paddingTop: "1rem", textAlign: "center" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                Member since {memberSince}
              </span>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN — Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* SECTION 1 — Academic Info */}
          <Card>
            <h3 style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <GraduationCap size={18} style={{ color: "#7C3AED" }} /> Academic Info
            </h3>
            <InfoRow label="College" value={userData.college} />
            <InfoRow label="Department" value={userData.department} />
            <InfoRow label="Degree" value={userData.degree} />
            <InfoRow label="Current Year" value={userData.currentYear} />
            <InfoRow label="Semester" value={userData.currentSemester} />
            <InfoRow label="CGPA" value={userData.cgpa ? `${userData.cgpa} / 10` : null} />
          </Card>

          {/* SECTION 2 — Career Goals (EDITABLE) */}
          <Card>
            <h3 style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <Briefcase size={18} style={{ color: "#7C3AED" }} /> Career Goals
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>

              {/* Dream Job Role */}
              <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid #1E1B4B" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: editingJob ? "8px" : "0" }}>
                  <div>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", display: "block" }}>Dream Job Role</span>
                    {!editingJob && <span style={{ color: "white", fontWeight: 600, fontSize: "0.95rem" }}>{dreamJob || "Not set"}</span>}
                  </div>
                  <button
                    onClick={() => setEditingJob(!editingJob)}
                    style={{ background: "none", border: "none", color: "#A855F7", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.8rem", minHeight: "44px" }}
                  >
                    <Edit3 size={14} /> {editingJob ? "Cancel" : "Edit"}
                  </button>
                </div>
                {editingJob && (
                  <select value={dreamJob} onChange={e => setDreamJob(e.target.value)} style={selectStyle}>
                    <option value="">Select Dream Job Role...</option>
                    {JOB_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                )}
              </div>

              {/* Dream Company */}
              <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid #1E1B4B" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: editingCompany ? "8px" : "0" }}>
                  <div>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", display: "block" }}>Dream Company</span>
                    {!editingCompany && <span style={{ color: "white", fontWeight: 600, fontSize: "0.95rem" }}>{dreamCompany || "Not set"}</span>}
                  </div>
                  <button
                    onClick={() => setEditingCompany(!editingCompany)}
                    style={{ background: "none", border: "none", color: "#A855F7", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.8rem", minHeight: "44px" }}
                  >
                    <Edit3 size={14} /> {editingCompany ? "Cancel" : "Edit"}
                  </button>
                </div>
                {editingCompany && (
                  <select value={dreamCompany} onChange={e => setDreamCompany(e.target.value)} style={selectStyle}>
                    <option value="">Select Target Company...</option>
                    {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                )}
              </div>

              {/* Preferred Location */}
              <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid #1E1B4B" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: editingLoc ? "8px" : "0" }}>
                  <div>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", display: "block" }}>Preferred Location</span>
                    {!editingLoc && <span style={{ color: "white", fontWeight: 600, fontSize: "0.95rem" }}>{preferredLocation || "Not set"}</span>}
                  </div>
                  <button
                    onClick={() => setEditingLoc(!editingLoc)}
                    style={{ background: "none", border: "none", color: "#A855F7", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.8rem", minHeight: "44px" }}
                  >
                    <Edit3 size={14} /> {editingLoc ? "Cancel" : "Edit"}
                  </button>
                </div>
                {editingLoc && (
                  <input
                    value={preferredLocation}
                    onChange={e => setPreferredLocation(e.target.value)}
                    placeholder="e.g. Bangalore, Remote"
                    style={inputStyle}
                  />
                )}
              </div>

              {/* Preferred Salary */}
              <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid #1E1B4B" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: editingSal ? "8px" : "0" }}>
                  <div>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", display: "block" }}>Preferred Salary</span>
                    {!editingSal && <span style={{ color: "white", fontWeight: 600, fontSize: "0.95rem" }}>{preferredSalary || "Not set"}</span>}
                  </div>
                  <button
                    onClick={() => setEditingSal(!editingSal)}
                    style={{ background: "none", border: "none", color: "#A855F7", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.8rem", minHeight: "44px" }}
                  >
                    <Edit3 size={14} /> {editingSal ? "Cancel" : "Edit"}
                  </button>
                </div>
                {editingSal && (
                  <input
                    value={preferredSalary}
                    onChange={e => setPreferredSalary(e.target.value)}
                    placeholder="e.g. 12 LPA"
                    style={inputStyle}
                  />
                )}
              </div>

            </div>

            <button
              onClick={handleSaveGoals}
              disabled={saving}
              style={{
                width: "100%", background: "#7C3AED", color: "white", border: "none",
                borderRadius: "10px", padding: "12px", fontSize: "0.95rem", fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                minHeight: "44px"
              }}
            >
              <Save size={16} /> {saving ? "Saving..." : "Save Career Goals"}
            </button>
          </Card>

          {/* TASK 2 — DOWNLOAD RESUME SECTION */}
          <Card>
            <div style={{ marginBottom: "1.25rem" }}>
              <h3 style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px", margin: "0 0 4px 0" }}>
                <FileText size={18} style={{ color: "#7C3AED" }} /> Resume
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0 }}>
                Download your profile as a resume
              </p>
            </div>

            <div className="resume-cards-grid">
              {/* CARD 1 — Standard Resume (FREE) */}
              <div className="resume-option-card free">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(124,58,237,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FileText size={20} style={{ color: "#A855F7" }} />
                  </div>
                  <Badge variant="green">FREE</Badge>
                </div>
                <h4 style={{ color: "white", fontWeight: 700, fontSize: "1rem", marginBottom: "6px" }}>
                  Standard Resume
                </h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "1.25rem", flex: 1 }}>
                  Clean, professional resume with all your profile details auto-filled.
                </p>
                <button
                  onClick={handleDownloadResumePDF}
                  style={{
                    width: "100%", background: "#7C3AED", color: "white", border: "none",
                    borderRadius: "8px", padding: "10px 16px", fontWeight: 600, fontSize: "0.875rem",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    minHeight: "44px"
                  }}
                >
                  <Download size={16} /> Download PDF
                </button>
              </div>

              {/* CARD 2 — ATS Friendly Resume (LOCKED/PAID) */}
              <div className="resume-option-card locked" title="Upgrade to Pro to access ATS optimized resume builder">
                {/* Lock Overlay */}
                <div className="resume-lock-overlay">
                  <div className="resume-lock-badge">
                    <Lock size={16} style={{ color: "#F59E0B" }} />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Sparkles size={20} style={{ color: "#F59E0B" }} />
                  </div>
                  <span style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)", padding: "2px 10px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700 }}>
                    PRO
                  </span>
                </div>

                <h4 style={{ color: "white", fontWeight: 700, fontSize: "1rem", marginBottom: "6px" }}>
                  ATS Friendly Resume
                </h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                  Optimized resume that passes Applicant Tracking Systems used by top companies.
                </p>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <li style={{ color: "var(--text-secondary)", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle size={14} style={{ color: "#F59E0B" }} /> ATS optimized formatting
                  </li>
                  <li style={{ color: "var(--text-secondary)", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle size={14} style={{ color: "#F59E0B" }} /> Keyword optimization for your role
                  </li>
                  <li style={{ color: "var(--text-secondary)", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle size={14} style={{ color: "#F59E0B" }} /> Section scoring
                  </li>
                  <li style={{ color: "var(--text-secondary)", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle size={14} style={{ color: "#F59E0B" }} /> Multiple format options
                  </li>
                </ul>

                <button
                  disabled
                  style={{
                    width: "100%", background: "rgba(245,158,11,0.15)", color: "#F59E0B",
                    border: "1px solid rgba(245,158,11,0.35)", borderRadius: "8px", padding: "10px 16px",
                    fontWeight: 600, fontSize: "0.875rem", cursor: "not-allowed", opacity: 0.8,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    minHeight: "44px"
                  }}
                >
                  <Lock size={16} /> Unlock Pro
                </button>
                <div style={{ textAlign: "center", marginTop: "6px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Coming soon — Pro feature
                </div>
              </div>
            </div>
          </Card>

          {/* SECTION 3 — My Skills */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                <Award size={18} style={{ color: "#7C3AED" }} /> My Skills
              </h3>
              <Badge variant="purple">{skillsList.length}</Badge>
            </div>

            {skillsList.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>No skills added yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                {Object.entries(groupedSkills).map(([category, skills]) => {
                  if (skills.length === 0) return null;
                  const style = skillPillStyles[category] || skillPillStyles["Soft Skills"];
                  return (
                    <div key={category}>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: 600, display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {category} ({skills.length})
                      </span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {skills.map(skill => (
                          <span
                            key={skill}
                            style={{
                              background: style.bg,
                              border: `1px solid ${style.border}`,
                              color: style.text,
                              borderRadius: "999px",
                              padding: "4px 12px",
                              fontSize: "0.8rem",
                              fontWeight: 500
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => navigate("/onboarding?step=2")}
              style={{
                background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.4)",
                borderRadius: "8px", padding: "8px 16px", color: "#A855F7",
                fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", minHeight: "44px"
              }}
            >
              Update Skills
            </button>
          </Card>

          {/* SECTION 4 — My Projects */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                <FolderOpen size={18} style={{ color: "#7C3AED" }} /> My Projects
              </h3>
              <Badge variant="purple">{projectsList.length}</Badge>
            </div>

            {projectsList.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>No projects added yet.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.25rem 0", display: "flex", flexDirection: "column", gap: "8px" }}>
                {projectsList.map((p, idx) => (
                  <li key={idx} style={{ padding: "8px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid #1E1B4B", borderRadius: "6px", color: "white", fontSize: "0.875rem", fontWeight: 500 }}>
                    {p.title}
                  </li>
                ))}
              </ul>
            )}

            <Link
              to="/projects"
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.4)",
                borderRadius: "8px", padding: "8px 16px", color: "#A855F7",
                fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", minHeight: "44px"
              }}
            >
              Manage Projects <ExternalLink size={14} />
            </Link>
          </Card>

          {/* SECTION 5 — My Certifications */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                <Award size={18} style={{ color: "#7C3AED" }} /> My Certifications
              </h3>
              <Badge variant="purple">{certsList.length}</Badge>
            </div>

            {certsList.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>No certifications added yet.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.25rem 0", display: "flex", flexDirection: "column", gap: "8px" }}>
                {certsList.map((c, idx) => (
                  <li key={idx} style={{ padding: "8px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid #1E1B4B", borderRadius: "6px", color: "white", fontSize: "0.875rem", fontWeight: 500, display: "flex", justifyContent: "space-between" }}>
                    <span>{c.name}</span>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{c.organization}</span>
                  </li>
                ))}
              </ul>
            )}

            <Link
              to="/certifications"
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.4)",
                borderRadius: "8px", padding: "8px 16px", color: "#A855F7",
                fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", minHeight: "44px"
              }}
            >
              Manage Certifications <ExternalLink size={14} />
            </Link>
          </Card>

        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .profile-grid-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
