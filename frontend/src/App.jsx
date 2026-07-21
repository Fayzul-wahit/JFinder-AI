import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { Navbar, Sidebar, Footer } from './components/layout';
import { useAuth } from './hooks/useAuth';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
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

const PublicLayout = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <main style={{ flex: 1 }}>{children}</main>
    <Footer />
  </div>
);

const DashboardLayout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    <Sidebar />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Navbar isAuthenticated={true} />
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>{children}</main>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/auth" />;
  return <DashboardLayout>{children}</DashboardLayout>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Landing /></PublicLayout>} />
      <Route path="/auth" element={<PublicLayout><Auth /></PublicLayout>} />
      
      {/* Protected Routes */}
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
      <Route path="/readiness" element={<ProtectedRoute><Readiness /></ProtectedRoute>} />
      <Route path="/skill-gap" element={<ProtectedRoute><SkillGap /></ProtectedRoute>} />
      <Route path="/companies" element={<ProtectedRoute><CompanyIntel /></ProtectedRoute>} />
      <Route path="/job-trends" element={<ProtectedRoute><JobTrends /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><div><h1>Projects</h1><p>Coming Soon</p></div></ProtectedRoute>} />
      <Route path="/certifications" element={<ProtectedRoute><div><h1>Certifications</h1><p>Coming Soon</p></div></ProtectedRoute>} />
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
