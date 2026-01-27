import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardPage from '@/pages/DashboardPage';
// We'll wrap TaskForm in a page or just use it directly, but let's use the existing page if possible or create a new route view
// The user asked for "Routing Logic", so I will map the new paths.
import TaskSubmissionPage from '@/pages/TaskSubmissionPage';
import AutomationPage from '@/pages/AutomationPage';
import DepartmentsPage from '@/pages/DepartmentsPage';
import WelcomePage from '@/pages/WelcomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import TaskSubmissionForm from '@/components/TaskSubmissionForm';

// Role Protected Route Wrapper
const ProtectedRoute = ({ children, requiredRole }) => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);
  const userRoles = user.roles || [];

  if (requiredRole && !userRoles.includes(requiredRole)) {
    // Redirect to their default page based on their actual role? 
    // Or just dashboard/unauthorized. For now, redirect to login or dashboard.
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- Role Based Routes --- */}

        {/* Collector: High Level Charts */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute requiredRole="ROLE_COLLECTOR">
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Dept Head: Table View */}
        <Route path="/dept-dashboard" element={
          <ProtectedRoute requiredRole="ROLE_DEPT_HEAD">
            <DashboardLayout>
              <DepartmentsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Staff: Submit New Work Request */}
        <Route path="/staff-portal" element={
          <ProtectedRoute requiredRole="ROLE_STAFF">
            <DashboardLayout>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-slate-800">Staff Workspace</h2>
                <TaskSubmissionPage />
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Supervisor: Live Console/Automation */}
        <Route path="/active-monitoring" element={
          <ProtectedRoute requiredRole="ROLE_AUTO_SUPERVISOR">
            <DashboardLayout>
              <AutomationPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Generic Dashboard Fallback (if user manually goes here) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
