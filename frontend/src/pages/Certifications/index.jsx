import React, { useState } from "react";
import { Card, Badge } from "../../components/common";
import { useAuth } from "../../hooks/useAuth";
import { updateUserProfile } from "../../services/api";
import { Award, Plus, X, ExternalLink, CheckCircle, Clock, Star, Trash2, AlertTriangle } from "lucide-react";

const RECOMMENDED_CERTS = {
  "Data Analyst": [
    { name: "Google Data Analytics Certificate", provider: "Google", platform: "Coursera", duration: "6 months", level: "Beginner" },
    { name: "Microsoft Power BI Data Analyst", provider: "Microsoft", platform: "Microsoft Learn", duration: "3 months", level: "Intermediate" },
    { name: "IBM Data Analyst Professional Certificate", provider: "IBM", platform: "Coursera", duration: "4 months", level: "Beginner" },
    { name: "SQL for Data Science", provider: "UC Davis", platform: "Coursera", duration: "1 month", level: "Beginner" },
    { name: "Tableau Desktop Specialist", provider: "Tableau", platform: "Tableau", duration: "Self-paced", level: "Intermediate" },
    { name: "Excel Expert Certification", provider: "Microsoft", platform: "Microsoft Learn", duration: "1 month", level: "Beginner" },
  ],
  "Software Engineer": [
    { name: "AWS Certified Developer Associate", provider: "Amazon", platform: "AWS", duration: "3 months", level: "Intermediate" },
    { name: "Meta Front-End Developer Certificate", provider: "Meta", platform: "Coursera", duration: "7 months", level: "Beginner" },
    { name: "MongoDB Developer Certification", provider: "MongoDB", platform: "MongoDB University", duration: "2 months", level: "Intermediate" },
    { name: "Google Associate Cloud Engineer", provider: "Google", platform: "Google Cloud", duration: "3 months", level: "Intermediate" },
    { name: "GitHub Actions Certification", provider: "GitHub", platform: "GitHub", duration: "Self-paced", level: "Beginner" },
    { name: "Oracle Java SE Certification", provider: "Oracle", platform: "Oracle", duration: "3 months", level: "Intermediate" },
  ],
  "AI/ML Engineer": [
    { name: "TensorFlow Developer Certificate", provider: "Google", platform: "Google", duration: "3 months", level: "Intermediate" },
    { name: "Deep Learning Specialization", provider: "DeepLearning.AI", platform: "Coursera", duration: "4 months", level: "Advanced" },
    { name: "AWS Machine Learning Specialty", provider: "Amazon", platform: "AWS", duration: "4 months", level: "Advanced" },
    { name: "Microsoft Azure AI Engineer", provider: "Microsoft", platform: "Microsoft Learn", duration: "3 months", level: "Intermediate" },
    { name: "IBM AI Engineering Professional", provider: "IBM", platform: "Coursera", duration: "6 months", level: "Intermediate" },
    { name: "Google Professional ML Engineer", provider: "Google", platform: "Google Cloud", duration: "4 months", level: "Advanced" },
  ],
  "Cloud Engineer": [
    { name: "AWS Solutions Architect Associate", provider: "Amazon", platform: "AWS", duration: "3-6 months", level: "Intermediate" },
    { name: "Google Associate Cloud Engineer", provider: "Google", platform: "Google Cloud", duration: "3-4 months", level: "Intermediate" },
    { name: "Microsoft Azure Administrator", provider: "Microsoft", platform: "Microsoft Learn", duration: "2-3 months", level: "Intermediate" },
    { name: "Certified Kubernetes Administrator", provider: "Linux Foundation", platform: "CNCF", duration: "3-4 months", level: "Advanced" },
    { name: "HashiCorp Terraform Associate", provider: "HashiCorp", platform: "HashiCorp", duration: "2 months", level: "Intermediate" },
    { name: "Docker Certified Associate", provider: "Docker", platform: "Docker", duration: "2-3 months", level: "Intermediate" },
  ],
};

const getRecommended = (dreamJob = "") => {
  if (dreamJob.toLowerCase().includes("data analyst")) return RECOMMENDED_CERTS["Data Analyst"];
  if (dreamJob.toLowerCase().includes("software")) return RECOMMENDED_CERTS["Software Engineer"];
  if (dreamJob.toLowerCase().includes("ai") || dreamJob.toLowerCase().includes("ml") || dreamJob.toLowerCase().includes("machine")) return RECOMMENDED_CERTS["AI/ML Engineer"];
  if (dreamJob.toLowerCase().includes("cloud")) return RECOMMENDED_CERTS["Cloud Engineer"];
  return RECOMMENDED_CERTS["Software Engineer"];
};

const levelColor = (l) => ({ Beginner: "green", Intermediate: "orange", Advanced: "red" })[l] || "muted";

const Toast = ({ msg, type, onClose }) => (
  <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: type === "success" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)", border: `1px solid ${type === "success" ? "#10B981" : "#EF4444"}`, borderRadius: 12, padding: "14px 20px", color: type === "success" ? "#10B981" : "#EF4444", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", minWidth: 280 }}>
    <CheckCircle size={16} /><span style={{ flex: 1 }}>{msg}</span>
    <button onClick={onClose} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", display: "flex" }}><X size={14} /></button>
  </div>
);

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: 16 }}>
    <div style={{ background: "#13132A", border: "1px solid #1E1B4B", borderRadius: 16, padding: "2rem", maxWidth: 420, width: "100%", textAlign: "center" }}>
      <div style={{ width: 56, height: 56, background: "rgba(239,68,68,0.12)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
        <AlertTriangle size={24} style={{ color: "#EF4444" }} />
      </div>
      <h3 style={{ color: "white", marginBottom: 8 }}>Remove Certification?</h3>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>{message}</p>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={onCancel} style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid #1E1B4B", borderRadius: 10, padding: "10px", color: "white", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
        <button onClick={onConfirm} style={{ flex: 1, background: "rgba(239,68,68,0.15)", border: "1px solid #EF4444", borderRadius: 10, padding: "10px", color: "#EF4444", fontWeight: 700, cursor: "pointer" }}>Yes, Remove</button>
      </div>
    </div>
  </div>
);

const CertModal = ({ onClose, onSave, saving }) => {
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [date, setDate] = useState("");
  const inp = { width: "100%", background: "#0A0A1A", border: "1px solid #1E1B4B", borderRadius: 8, padding: "10px 14px", color: "white", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
      <div style={{ background: "#13132A", border: "1px solid #1E1B4B", borderRadius: 16, padding: "2rem", width: "100%", maxWidth: 500 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ color: "white", fontSize: "1.2rem", fontWeight: 700 }}>Add Certification</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex" }}><X size={20} /></button>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: 6, color: "var(--text-secondary)", fontSize: "0.875rem" }}>Certificate Name *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. AWS Solutions Architect" style={inp} />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: 6, color: "var(--text-secondary)", fontSize: "0.875rem" }}>Issuing Organization *</label>
          <input value={org} onChange={e => setOrg(e.target.value)} placeholder="e.g. Amazon Web Services" style={inp} />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: 6, color: "var(--text-secondary)", fontSize: "0.875rem" }}>Date Completed</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ ...inp, colorScheme: "dark" }} />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: 6, color: "var(--text-secondary)", fontSize: "0.875rem" }}>Certificate File (optional)</label>
          <input type="file" accept=".pdf,.png,.jpg,.jpeg" style={{ width: "100%", background: "#0A0A1A", border: "1px solid #1E1B4B", borderRadius: 8, padding: "10px 14px", color: "var(--text-muted)", fontSize: "0.85rem", boxSizing: "border-box" }} />
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>PDF, PNG or JPG — file storage coming soon</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, background: "transparent", border: "1px solid #1E1B4B", borderRadius: 10, padding: "11px", color: "var(--text-secondary)", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          <button onClick={() => onSave({ name, organization: org, date })} disabled={!name.trim() || !org.trim() || saving} style={{ flex: 2, background: "#7C3AED", color: "white", border: "none", borderRadius: 10, padding: "11px", fontWeight: 600, cursor: name.trim() && org.trim() && !saving ? "pointer" : "not-allowed", opacity: name.trim() && org.trim() && !saving ? 1 : 0.6 }}>
            {saving ? "Saving..." : "Save Certificate"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Certifications = () => {
  const { user } = useAuth();
  const profile = (() => { try { const a = localStorage.getItem("auth"); return a ? JSON.parse(a).user : {}; } catch { return {}; } })();
  const currentUser = user || profile || {};

  const [certs, setCerts] = useState(currentUser.certifications || []);
  const [modal, setModal] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };
  const dreamJob = currentUser.dreamJob || "";
  const recommended = getRecommended(dreamJob);

  const persist = async (list) => {
    setSaving(true);
    try {
      const res = await updateUserProfile({ certifications: list });
      if (res.data?.success) {
        setCerts(list);
        const s = localStorage.getItem("auth");
        if (s) { const p = JSON.parse(s); p.user = { ...p.user, certifications: list }; localStorage.setItem("auth", JSON.stringify(p)); }
        showToast("Certifications saved!");
      } else showToast("Failed to save.", "error");
    } catch (e) { showToast(e.response?.data?.message || "Error saving.", "error"); }
    finally { setSaving(false); }
  };

  const handleSave = async ({ name, organization, date }) => {
    if (!name.trim() || !organization.trim()) return;
    await persist([...certs, { name, organization, date, fileUrl: "" }]);
    setModal(false);
  };

  const markEarned = async (cert) => {
    if (certs.some(c => c.name === cert.name)) { showToast("Already in your certifications!", "error"); return; }
    await persist([...certs, { name: cert.name, organization: cert.provider, date: new Date().toISOString().split("T")[0], fileUrl: "" }]);
  };

  const confirmDelete = async () => {
    await persist(certs.filter((_, i) => i !== deleteIdx));
    setDeleteIdx(null);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {modal && <CertModal onClose={() => setModal(false)} onSave={handleSave} saving={saving} />}
      {deleteIdx !== null && <ConfirmModal message="This certification will be removed from your profile." onConfirm={confirmDelete} onCancel={() => setDeleteIdx(null)} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <Award size={30} style={{ color: "#7C3AED" }} /> Certifications
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>Earn certifications to stand out to employers</p>
        </div>
        <button onClick={() => setModal(true)} style={{ background: "#7C3AED", color: "white", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <Plus size={18} /> Add Certification
        </button>
      </div>

      {/* My Certs */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "white", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
          <Star size={18} style={{ color: "#7C3AED" }} /> My Certifications <Badge variant="purple">{certs.length}</Badge>
        </h2>
        {certs.length === 0 ? (
          <div style={{ background: "#13132A", border: "1px dashed #1E1B4B", borderRadius: 14, padding: "3rem", textAlign: "center" }}>
            <Award size={48} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
            <p style={{ color: "white", fontSize: "1.05rem", fontWeight: 600, marginBottom: 6 }}>No certifications added yet</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>Add certifications you have earned during onboarding or new ones here</p>
            <button onClick={() => setModal(true)} style={{ background: "#7C3AED", color: "white", border: "none", borderRadius: 8, padding: "9px 20px", fontWeight: 600, cursor: "pointer" }}>Add Certification</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1.5rem" }}>
            {certs.map((c, idx) => (
              <Card key={idx}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ width: 40, height: 40, background: "rgba(124,58,237,0.18)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
                      <Award size={20} style={{ color: "#A855F7" }} />
                    </div>
                    <h3 style={{ color: "white", fontWeight: 600, fontSize: "0.95rem", marginBottom: 4, lineHeight: 1.4 }}>{c.name}</h3>
                    <p style={{ color: "#A855F7", fontSize: "0.84rem", marginBottom: 4 }}>{c.organization}</p>
                    {c.date && <p style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>Completed: {c.date}</p>}
                    {c.fileUrl && (
                      <button style={{ marginTop: 10, background: "none", border: "1px solid #1E1B4B", borderRadius: 6, padding: "4px 12px", color: "var(--text-secondary)", fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        <ExternalLink size={12} /> View Certificate
                      </button>
                    )}
                  </div>
                  <button onClick={() => setDeleteIdx(idx)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 6, padding: 6, cursor: "pointer", color: "#EF4444", display: "flex", flexShrink: 0, marginLeft: 12 }}><Trash2 size={14} /></button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Recommended */}
      <section>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "white", marginBottom: 6 }}>
          {dreamJob ? `Top Certifications for ${dreamJob}` : "Recommended Certifications"}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>Industry-recognised credentials to accelerate your career</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: "1.5rem" }}>
          {recommended.map((cert, idx) => (
            <Card key={idx}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <h3 style={{ color: "white", fontWeight: 600, fontSize: "0.95rem", flex: 1, marginRight: 10, lineHeight: 1.4 }}>{cert.name}</h3>
                <Badge variant={levelColor(cert.level)} size="sm">{cert.level}</Badge>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "0.75rem" }}>
                <span style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 999, padding: "2px 10px", fontSize: "0.75rem", color: "#A855F7" }}>{cert.provider}</span>
                <span style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #1E1B4B", borderRadius: 999, padding: "2px 10px", fontSize: "0.75rem", color: "var(--text-muted)" }}>{cert.platform}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: "0.78rem", marginBottom: "1.25rem" }}>
                <Clock size={12} /> {cert.duration}
              </div>
              <button onClick={() => markEarned(cert)} disabled={saving} style={{ width: "100%", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, padding: "8px", color: "#10B981", fontSize: "0.875rem", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <CheckCircle size={14} /> Mark as Earned
              </button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Certifications;
