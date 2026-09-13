import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { Navbar, Sidebar, Footer } from './components/layout';
import AIMentorFloat from './components/common/AIMentorFloat';
import { useAuth } from './hooks/useAuth';
import { Menu } from 'lucide-react';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Readiness from './pages/Readiness';
import SkillGap from './pages/SkillGap';
import CompanyIntel from './pages/CompanyIntel';
import JobTrends from './pages/JobTrends';
import News from './pages/News';
import AIMentor from './pages/AIMentor';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Projects from './pages/Projects';
import Certifications from './pages/Certifications';
import Practice from './pages/Practice';

const PublicLayout = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <main style={{ flex: 1 }}>{children}</main>
    <Footer />
  </div>
);

// DashboardLayout includes the floating AI Mentor on every authenticated page
const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="dashboard-layout">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dashboard-main-wrapper">
        {/* Mobile Dashboard Topbar with Hamburger Trigger for Sidebar */}
        <div className="dashboard-mobile-topbar">
          <button 
            className="mobile-sidebar-trigger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open dashboard navigation menu"
          >
            <Menu size={20} color="#fff" />
            <span>Dashboard Navigation</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'var(--accent-primary)', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white', fontSize: '0.75rem' }}>
              JF
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'white' }}>JFinder AI</span>
          </div>
        </div>

        <Navbar isAuthenticated={true} onLogout={logout} />
        <main className="dashboard-content">{children}</main>
      </div>
      {/* Floating AI Mentor — visible on ALL authenticated pages */}
      <AIMentorFloat />
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <DashboardLayout>{children}</DashboardLayout>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Landing /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/signup" element={<PublicLayout><Signup /></PublicLayout>} />

      {/* Protected Routes */}
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
      <Route path="/readiness" element={<ProtectedRoute><Readiness /></ProtectedRoute>} />
      <Route path="/skill-gap" element={<ProtectedRoute><SkillGap /></ProtectedRoute>} />
      <Route path="/company-intelligence" element={<ProtectedRoute><CompanyIntel /></ProtectedRoute>} />
      <Route path="/job-trends" element={<ProtectedRoute><JobTrends /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/certifications" element={<ProtectedRoute><Certifications /></ProtectedRoute>} />
      <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
      <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
      <Route path="/ai-mentor" element={<ProtectedRoute><AIMentor /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      <Route path="*" element={<PublicLayout><div style={{ textAlign: 'center', padding: '4rem' }}><h2>404 - Not Found</h2></div></PublicLayout>} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
