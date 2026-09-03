import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/common";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import {
  Settings as SettingsIcon, Lock, Bell, Palette, Shield, AlertTriangle,
  CheckCircle, X, Eye, EyeOff, UserCheck
} from "lucide-react";

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
    {type === "success" ? <CheckCircle size={18} /> : <X size={18} />}
    <span style={{ flex: 1 }}>{message}</span>
    <button onClick={onClose} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", display: "flex" }}>
      <X size={14} />
    </button>
  </div>
);

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    style={{
      width: "48px", height: "26px", borderRadius: "13px", border: "none",
      background: checked ? "#7C3AED" : "#1E1B4B", cursor: "pointer",
      position: "relative", transition: "background 0.2s", flexShrink: 0
    }}
  >
    <div style={{
      width: "20px", height: "20px", borderRadius: "50%", background: "white",
      position: "absolute", top: "3px", left: checked ? "25px" : "3px", transition: "left 0.2s"
    }} />
  </button>
);

const SectionHeader = ({ icon, title }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
    {icon}
    <h2 style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", margin: 0 }}>{title}</h2>
  </div>
);

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [userData, setUserData] = useState(() => {
    try {
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) return JSON.parse(storedAuth).user || {};
      const storedUser = localStorage.getItem("user");
      if (storedUser) return JSON.parse(storedUser) || {};
    } catch (e) { console.error(e); }
    return user || {};
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  // Notification Toggles with localStorage persistence
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("jf_notifications");
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return {
      careerNews: true,
      roadmapReminders: true,
      companyAlerts: false,
      weeklyReport: true
    };
  });

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [toast, setToast] = useState(null);

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

    localStorage.setItem("jf_notifications", JSON.stringify(notifications));
  }, [notifications, navigate]);

  const handleChangePassword = async (e) => {
    if (e) e.preventDefault();
    setPwError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError("All password fields are required.");
      showToast("Please fill in all password fields.", "error");
      return;
    }

    if (newPassword.length < 6) {
      setPwError("New password must be at least 6 characters.");
      showToast("New password must be at least 6 characters.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwError("Confirm password does not match new password.");
      showToast("Confirm password does not match new password.", "error");
      return;
    }

    setPwSaving(true);
    try {
      const res = await api.put("/api/auth/change-password", { currentPassword, newPassword });
      if (res.data && res.data.success) {
        showToast("Password updated successfully!", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPwError("");
      } else {
        const msg = res.data?.message || "Failed to update password.";
        setPwError(msg);
        showToast(msg, "error");
      }
    } catch (e) {
      const msg = e.response?.data?.message || "Error updating password. Please check your current password.";
      setPwError(msg);
      showToast(msg, "error");
    } finally {
      setPwSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteSaving(true);
    try {
      // Try DELETE /api/users/profile, fallback to DELETE /api/users
      let res;
      try {
        res = await api.delete("/api/users/profile");
      } catch (err) {
        res = await api.delete("/api/users");
      }

      if (res && res.data && res.data.success) {
        localStorage.clear();
        if (logout) logout();
        showToast("Account deleted successfully", "success");
        setTimeout(() => {
          navigate("/signup");
        }, 1000);
      } else {
        showToast("Failed to delete account.", "error");
        setDeleteModal(false);
      }
    } catch (e) {
      showToast(e.response?.data?.message || "Error deleting account.", "error");
      setDeleteModal(false);
    } finally {
      setDeleteSaving(false);
    }
  };

  const memberSince = userData.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";

  const inp = {
    width: "100%", background: "#0A0A1A", border: "1px solid #1E1B4B",
    borderRadius: "8px", padding: "10px 14px", color: "white",
    fontSize: "0.9rem", outline: "none", boxSizing: "border-box"
  };

  const labelStyle = { display: "block", marginBottom: "6px", color: "var(--text-secondary)", fontSize: "0.875rem" };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Delete Account Confirmation Modal */}
      {deleteModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "#13132A", border: "1px solid #EF4444", borderRadius: "16px", padding: "2rem", maxWidth: "440px", width: "100%", textAlign: "center" }}>
            <div style={{ width: "60px", height: "60px", background: "rgba(239,68,68,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
              <AlertTriangle size={28} style={{ color: "#EF4444" }} />
            </div>
            <h3 style={{ color: "white", fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>Delete Account</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "2rem", lineHeight: 1.6 }}>
              This will permanently delete your account and all your data. This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setDeleteModal(false)}
                style={{ flex: 1, background: "transparent", border: "1px solid #1E1B4B", borderRadius: "10px", padding: "12px", color: "white", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteSaving}
                style={{ flex: 1, background: "#EF4444", border: "none", borderRadius: "10px", padding: "12px", color: "white", fontSize: "0.9rem", fontWeight: 700, cursor: deleteSaving ? "not-allowed" : "pointer" }}
              >
                {deleteSaving ? "Deleting..." : "Yes, Delete My Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <SettingsIcon size={32} style={{ color: "#7C3AED" }} /> Settings
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Manage your account and preferences</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* CARD 1 — Account Information */}
        <Card>
          <SectionHeader icon={<UserCheck size={18} style={{ color: "#7C3AED" }} />} title="Account" />
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Full Name</span>
              <span style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>{userData.name || "N/A"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Username</span>
              <span style={{ color: "#A855F7", fontWeight: 600, fontSize: "0.9rem" }}>@{userData.username || "username"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Member Since</span>
              <span style={{ color: "white", fontWeight: 500, fontSize: "0.9rem" }}>{memberSince}</span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", fontStyle: "italic", marginTop: "4px" }}>
              To update your name contact support
            </p>
          </div>
        </Card>

        {/* CARD 2 — Change Password (Security) */}
        <Card>
          <SectionHeader icon={<Lock size={18} style={{ color: "#7C3AED" }} />} title="Security" />
          <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={labelStyle}>Current Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  style={{ ...inp, paddingRight: "42px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex" }}
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={labelStyle}>New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{ ...inp, paddingRight: "42px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex" }}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                style={inp}
              />
            </div>

            {pwError && (
              <p style={{ color: "#EF4444", fontSize: "0.85rem", margin: 0, fontWeight: 500 }}>
                {pwError}
              </p>
            )}

            <button
              type="submit"
              disabled={pwSaving}
              style={{
                alignSelf: "flex-start", background: "#7C3AED", color: "white",
                border: "none", borderRadius: "8px", padding: "10px 24px",
                fontSize: "0.9rem", fontWeight: 600, cursor: pwSaving ? "not-allowed" : "pointer",
                opacity: pwSaving ? 0.7 : 1
              }}
            >
              {pwSaving ? "Updating..." : "Update Password"}
            </button>
          </form>
        </Card>

        {/* CARD 3 — Notifications */}
        <Card>
          <SectionHeader icon={<Bell size={18} style={{ color: "#7C3AED" }} />} title="Notifications" />
          {[
            { key: "careerNews", label: "Career news updates", desc: "Get notified about industry news relevant to your role" },
            { key: "roadmapReminders", label: "Roadmap reminders", desc: "Daily reminders to complete your learning milestones" },
            { key: "companyAlerts", label: "Company hiring alerts", desc: "Hiring status changes for your target company" },
            { key: "weeklyReport", label: "Weekly progress report", desc: "Summary of your career readiness progress each week" },
          ].map(item => (
            <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div>
                <div style={{ color: "white", fontSize: "0.9rem", fontWeight: 500, marginBottom: "2px" }}>{item.label}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{item.desc}</div>
              </div>
              <Toggle
                checked={notifications[item.key]}
                onChange={val => setNotifications(prev => ({ ...prev, [item.key]: val }))}
              />
            </div>
          ))}
        </Card>

        {/* CARD 4 — Appearance */}
        <Card>
          <SectionHeader icon={<Palette size={18} style={{ color: "#7C3AED" }} />} title="Appearance" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            {/* Dark Mode Card */}
            <div style={{
              background: "rgba(124,58,237,0.1)", border: "2px solid #7C3AED",
              borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", gap: "12px"
            }}>
              <div style={{ width: "36px", height: "36px", background: "#0A0A1A", borderRadius: "8px", border: "1px solid #7C3AED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🌙</div>
              <div>
                <div style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>Dark Mode</div>
                <div style={{ color: "#A855F7", fontSize: "0.75rem", fontWeight: 600 }}>Active</div>
              </div>
            </div>

            {/* Light Mode Card */}
            <div style={{
              background: "rgba(255,255,255,0.02)", border: "1px dashed #1E1B4B",
              borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", gap: "12px", opacity: 0.5
            }}>
              <div style={{ width: "36px", height: "36px", background: "#0A0A1A", borderRadius: "8px", border: "1px solid #1E1B4B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>☀️</div>
              <div>
                <div style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>Light Mode</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Coming soon</div>
              </div>
            </div>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: 0 }}>More themes coming soon</p>
        </Card>

        {/* CARD 5 — Danger Zone */}
        <div style={{
          background: "rgba(239, 68, 68, 0.05)", border: "1px solid #EF4444",
          borderRadius: "16px", padding: "1.5rem"
        }}>
          <SectionHeader icon={<AlertTriangle size={18} style={{ color: "#EF4444" }} />} title="Danger Zone" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ color: "white", fontWeight: 600, fontSize: "0.9rem", marginBottom: "4px" }}>Delete Account</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                This will permanently delete your account and all your data. This action cannot be undone.
              </div>
            </div>
            <button
              onClick={() => setDeleteModal(true)}
              style={{
                background: "transparent", border: "1px solid #EF4444",
                borderRadius: "8px", padding: "9px 20px", color: "#EF4444",
                fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap"
              }}
            >
              Delete Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
