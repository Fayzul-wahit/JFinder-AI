import React, { useState } from "react";
import { Card, Badge } from "../../components/common";
import { useAuth } from "../../hooks/useAuth";
import { updateUserProfile } from "../../services/api";
import {
  FolderOpen, Plus, Edit3, Trash2, X, Clock, CheckCircle, AlertTriangle
} from "lucide-react";

const RECOMMENDED = {
  "Data Analyst": [
    { name: "Sales Dashboard", desc: "Build an interactive sales dashboard using Excel or Power BI showing KPIs, trends, and regional breakdowns.", difficulty: "Beginner", time: "1-2 weeks", skills: ["Excel", "Power BI", "Data Visualization"] },
    { name: "SQL Data Exploration", desc: "Analyze a real dataset using SQL queries to find meaningful patterns and business insights.", difficulty: "Beginner", time: "1 week", skills: ["SQL", "Data Analysis"] },
    { name: "Python EDA Project", desc: "Perform exploratory data analysis on a Kaggle dataset using Python, Pandas, and Matplotlib.", difficulty: "Intermediate", time: "2 weeks", skills: ["Python", "Pandas", "Matplotlib"] },
    { name: "Web Scraping Project", desc: "Scrape job postings or e-commerce data using BeautifulSoup or Scrapy and analyze the results.", difficulty: "Intermediate", time: "2 weeks", skills: ["Python", "BeautifulSoup", "Data Cleaning"] },
    { name: "Customer Segmentation", desc: "Use K-means clustering to segment customers based on purchase behaviour and visualize personas.", difficulty: "Intermediate", time: "2-3 weeks", skills: ["Python", "Scikit-learn", "Machine Learning"] },
    { name: "End-to-End Analytics Pipeline", desc: "Build a complete data pipeline from collection to visualization using Python, SQL, and Power BI.", difficulty: "Advanced", time: "3-4 weeks", skills: ["Python", "SQL", "Power BI", "ETL"] },
  ],
  "Software Engineer": [
    { name: "REST API with Node.js", desc: "Build a fully functional REST API with authentication and CRUD operations using Node.js and MongoDB.", difficulty: "Beginner", time: "1-2 weeks", skills: ["Node.js", "Express", "MongoDB"] },
    { name: "React Portfolio Website", desc: "Build a personal portfolio website showcasing your projects, skills, and contact information.", difficulty: "Beginner", time: "1 week", skills: ["React", "CSS", "HTML"] },
    { name: "Authentication System", desc: "Implement JWT-based login, signup, and protected routes completely from scratch.", difficulty: "Intermediate", time: "2 weeks", skills: ["Node.js", "JWT", "bcrypt"] },
    { name: "E-commerce Backend", desc: "Build a complete e-commerce backend with products, cart, orders, and payment integration.", difficulty: "Intermediate", time: "3 weeks", skills: ["Node.js", "MongoDB", "REST API"] },
    { name: "Real-time Chat Application", desc: "Build a chat app using Socket.io with rooms, typing indicators, and live messaging.", difficulty: "Intermediate", time: "2-3 weeks", skills: ["Node.js", "Socket.io", "React"] },
    { name: "Full Stack Blog Platform", desc: "Build a complete blog platform with admin panel, CRUD operations, and authentication.", difficulty: "Advanced", time: "4 weeks", skills: ["React", "Node.js", "MongoDB", "REST API"] },
  ],
  "AI/ML Engineer": [
    { name: "Image Classification", desc: "Train a CNN model to classify images using TensorFlow or PyTorch with transfer learning.", difficulty: "Intermediate", time: "2 weeks", skills: ["Python", "TensorFlow", "Deep Learning"] },
    { name: "Sentiment Analysis", desc: "Build an NLP model to classify text as positive, negative, or neutral using sklearn or transformers.", difficulty: "Intermediate", time: "2 weeks", skills: ["Python", "NLP", "Scikit-learn"] },
    { name: "Recommendation System", desc: "Build a movie or product recommendation engine using collaborative filtering techniques.", difficulty: "Intermediate", time: "2-3 weeks", skills: ["Python", "Pandas", "Machine Learning"] },
    { name: "Chatbot with NLP", desc: "Build a rule-based or ML-powered chatbot for a specific domain using Rasa or Dialogflow.", difficulty: "Intermediate", time: "2-3 weeks", skills: ["Python", "NLP", "Rasa"] },
    { name: "Time Series Forecasting", desc: "Predict stock prices or sales revenue using LSTM or ARIMA models with evaluation metrics.", difficulty: "Advanced", time: "3 weeks", skills: ["Python", "TensorFlow", "Time Series"] },
    { name: "Computer Vision Project", desc: "Build an object detection system using YOLO or OpenCV to detect and label objects in images.", difficulty: "Advanced", time: "3-4 weeks", skills: ["Python", "OpenCV", "Deep Learning"] },
  ],
  "Cloud Engineer": [
    { name: "AWS Infrastructure Setup", desc: "Provision a 3-tier architecture on AWS using Terraform: VPC, EC2, RDS, and Auto Scaling.", difficulty: "Intermediate", time: "2-3 weeks", skills: ["AWS", "Terraform", "IaC"] },
    { name: "Docker Containerisation", desc: "Containerise a multi-service application with Docker Compose, volumes, and health checks.", difficulty: "Beginner", time: "1-2 weeks", skills: ["Docker", "Docker Compose", "Linux"] },
    { name: "Kubernetes Deployment", desc: "Deploy a containerised application on Kubernetes with Deployments, Services, Ingress, and HPA.", difficulty: "Advanced", time: "3-4 weeks", skills: ["Kubernetes", "Helm", "kubectl"] },
    { name: "CI/CD Pipeline", desc: "Build an end-to-end CI/CD pipeline using GitHub Actions, Docker, and deployment to AWS.", difficulty: "Intermediate", time: "2 weeks", skills: ["GitHub Actions", "CI/CD", "Docker"] },
    { name: "Serverless Application", desc: "Build a serverless REST API using AWS Lambda, API Gateway, DynamoDB, and S3.", difficulty: "Intermediate", time: "2-3 weeks", skills: ["AWS Lambda", "Serverless", "DynamoDB"] },
    { name: "Cloud Monitoring Dashboard", desc: "Set up observability using Prometheus, Grafana, and CloudWatch with custom alerting rules.", difficulty: "Advanced", time: "3 weeks", skills: ["Prometheus", "Grafana", "CloudWatch"] },
  ],
};

const getRecommended = (dreamJob = "") => {
  if (dreamJob.toLowerCase().includes("data analyst")) return RECOMMENDED["Data Analyst"];
  if (dreamJob.toLowerCase().includes("software")) return RECOMMENDED["Software Engineer"];
  if (dreamJob.toLowerCase().includes("ai") || dreamJob.toLowerCase().includes("ml") || dreamJob.toLowerCase().includes("machine")) return RECOMMENDED["AI/ML Engineer"];
  if (dreamJob.toLowerCase().includes("cloud")) return RECOMMENDED["Cloud Engineer"];
  return RECOMMENDED["Software Engineer"];
};

const diffColor = (d) => ({ Beginner: "green", Intermediate: "orange", Advanced: "red" })[d] || "muted";

const Toast = ({ msg, type, onClose }) => (
  <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: type === "success" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)", border: `1px solid ${type === "success" ? "#10B981" : "#EF4444"}`, borderRadius: 12, padding: "14px 20px", color: type === "success" ? "#10B981" : "#EF4444", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", minWidth: 280 }}>
    <CheckCircle size={16} />
    <span style={{ flex: 1 }}>{msg}</span>
    <button onClick={onClose} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", display: "flex" }}><X size={14} /></button>
  </div>
);

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: 16 }}>
    <div style={{ background: "#13132A", border: "1px solid #1E1B4B", borderRadius: 16, padding: "2rem", maxWidth: 420, width: "100%", textAlign: "center" }}>
      <div style={{ width: 56, height: 56, background: "rgba(239,68,68,0.12)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
        <AlertTriangle size={24} style={{ color: "#EF4444" }} />
      </div>
      <h3 style={{ color: "white", marginBottom: 8 }}>Are you sure?</h3>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>{message}</p>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={onCancel} style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid #1E1B4B", borderRadius: 10, padding: "10px", color: "white", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
        <button onClick={onConfirm} style={{ flex: 1, background: "rgba(239,68,68,0.15)", border: "1px solid #EF4444", borderRadius: 10, padding: "10px", color: "#EF4444", fontWeight: 700, cursor: "pointer" }}>Yes, Delete</button>
      </div>
    </div>
  </div>
);

const ProjectModal = ({ project, onClose, onSave, saving }) => {
  const [title, setTitle] = useState(project?.title || "");
  const [desc, setDesc] = useState(project?.description || "");
  const inp = { width: "100%", background: "#0A0A1A", border: "1px solid #1E1B4B", borderRadius: 8, padding: "10px 14px", color: "white", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
      <div style={{ background: "#13132A", border: "1px solid #1E1B4B", borderRadius: 16, padding: "2rem", width: "100%", maxWidth: 500 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ color: "white", fontSize: "1.2rem", fontWeight: 700 }}>{project ? "Edit Project" : "Add Project"}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex" }}><X size={20} /></button>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: 6, color: "var(--text-secondary)", fontSize: "0.875rem" }}>Project Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Sales Dashboard in Power BI" style={inp} />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: 6, color: "var(--text-secondary)", fontSize: "0.875rem" }}>Description</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="What did you build? What did you learn?" rows={4} style={{ ...inp, resize: "vertical" }} />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, background: "transparent", border: "1px solid #1E1B4B", borderRadius: 10, padding: "11px", color: "var(--text-secondary)", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          <button onClick={() => onSave({ title, description: desc })} disabled={!title.trim() || saving} style={{ flex: 2, background: "#7C3AED", color: "white", border: "none", borderRadius: 10, padding: "11px", fontWeight: 600, cursor: title.trim() && !saving ? "pointer" : "not-allowed", opacity: title.trim() && !saving ? 1 : 0.6 }}>
            {saving ? "Saving..." : "Save Project"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const { user } = useAuth();
  const profile = (() => { try { const a = localStorage.getItem("auth"); return a ? JSON.parse(a).user : {}; } catch { return {}; } })();
  const currentUser = user || profile || {};

  const [projects, setProjects] = useState(currentUser.projects || []);
  const [modal, setModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editIdx, setEditIdx] = useState(null);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };
  const dreamJob = currentUser.dreamJob || "";
  const recommended = getRecommended(dreamJob);

  const persist = async (list) => {
    setSaving(true);
    try {
      const res = await updateUserProfile({ projects: list });
      if (res.data?.success) {
        setProjects(list);
        const s = localStorage.getItem("auth");
        if (s) { const p = JSON.parse(s); p.user = { ...p.user, projects: list }; localStorage.setItem("auth", JSON.stringify(p)); }
        showToast("Projects saved!");
      } else showToast("Failed to save.", "error");
    } catch (e) { showToast(e.response?.data?.message || "Error saving.", "error"); }
    finally { setSaving(false); }
  };

  const handleSave = async ({ title, description }) => {
    if (!title.trim()) return;
    const list = editIdx !== null ? projects.map((p, i) => i === editIdx ? { title, description } : p) : [...projects, { title, description }];
    await persist(list);
    setModal(false); setEditData(null); setEditIdx(null);
  };

  const confirmDelete = async () => {
    await persist(projects.filter((_, i) => i !== deleteIdx));
    setDeleteIdx(null);
  };

  const addRecommended = async (rec) => {
    if (projects.some(p => p.title === rec.name)) { showToast("Already in your projects!", "error"); return; }
    await persist([...projects, { title: rec.name, description: rec.desc }]);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {modal && <ProjectModal project={editData} onClose={() => { setModal(false); setEditData(null); setEditIdx(null); }} onSave={handleSave} saving={saving} />}
      {deleteIdx !== null && <ConfirmModal message="Are you sure you want to delete this project? This cannot be undone." onConfirm={confirmDelete} onCancel={() => setDeleteIdx(null)} />}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <FolderOpen size={30} style={{ color: "#7C3AED" }} /> Projects
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>Build real projects to prove your skills to employers</p>
        </div>
        <button onClick={() => { setEditData(null); setEditIdx(null); setModal(true); }} style={{ background: "#7C3AED", color: "white", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <Plus size={18} /> Add Project
        </button>
      </div>

      {/* My Projects */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "white", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
          My Projects <Badge variant="purple">{projects.length}</Badge>
        </h2>
        {projects.length === 0 ? (
          <div style={{ background: "#13132A", border: "1px dashed #1E1B4B", borderRadius: 14, padding: "3rem", textAlign: "center" }}>
            <FolderOpen size={48} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
            <p style={{ color: "white", fontSize: "1.05rem", fontWeight: 600, marginBottom: 6 }}>No projects added yet</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>Add your first project to boost your Career Readiness Score</p>
            <button onClick={() => setModal(true)} style={{ background: "#7C3AED", color: "white", border: "none", borderRadius: 8, padding: "9px 20px", fontWeight: 600, cursor: "pointer" }}>Add Project</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1.5rem" }}>
            {projects.map((p, idx) => (
              <Card key={idx}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <h3 style={{ color: "white", fontWeight: 600, fontSize: "1rem", flex: 1, marginRight: 12, lineHeight: 1.4 }}>{p.title}</h3>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button onClick={() => { setEditData(p); setEditIdx(idx); setModal(true); }} style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.35)", borderRadius: 6, padding: 6, cursor: "pointer", color: "#A855F7", display: "flex" }}><Edit3 size={14} /></button>
                    <button onClick={() => setDeleteIdx(idx)} style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, padding: 6, cursor: "pointer", color: "#EF4444", display: "flex" }}><Trash2 size={14} /></button>
                  </div>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>{p.description || "No description provided."}</p>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Recommended */}
      <section>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "white", marginBottom: 6 }}>
          {dreamJob ? `Projects to Build for ${dreamJob}` : "Recommended Projects for You"}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>Curated project ideas to strengthen your portfolio</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: "1.5rem" }}>
          {recommended.map((rec, idx) => (
            <Card key={idx}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <h3 style={{ color: "white", fontWeight: 600, fontSize: "0.95rem", flex: 1, marginRight: 10, lineHeight: 1.4 }}>{rec.name}</h3>
                <Badge variant={diffColor(rec.difficulty)} size="sm">{rec.difficulty}</Badge>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.84rem", lineHeight: 1.6, marginBottom: "0.75rem" }}>{rec.desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: "0.78rem", marginBottom: "0.75rem" }}>
                <Clock size={12} /> {rec.time}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1.25rem" }}>
                {rec.skills.map(s => <span key={s} style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 999, padding: "2px 10px", fontSize: "0.75rem", color: "#A855F7" }}>{s}</span>)}
              </div>
              <button onClick={() => addRecommended(rec)} disabled={saving} style={{ width: "100%", background: "transparent", border: "1px solid rgba(124,58,237,0.45)", borderRadius: 8, padding: "8px", color: "#A855F7", fontSize: "0.875rem", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer" }}>
                + Add to My Projects
              </button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Projects;
