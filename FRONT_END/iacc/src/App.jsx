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
import AdminDepartmentsPage from '@/pages/AdminDepartmentsPage';
import AdminAssignTaskPage from '@/pages/AdminAssignTaskPage';
import AdminTaskStatusPage from '@/pages/AdminTaskStatusPage';
import AdminProfilePage from '@/pages/AdminProfilePage';

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
        {/* Public Routes with Gateway Context */}
        <Route path="/" element={<WelcomePage />} />

        {/* Admin Gateway - Strictly for Collectors */}
        <Route path="/admin/auth" element={<LoginPage gateway="ADMIN" title="Admin Command Access" />} />

        {/* Department Gateway - For Heads, Staff, Supervisors */}
        <Route path="/dept/auth" element={<LoginPage gateway="DEPT" title="Department Portal" />} />

        {/* Legacy routes kept for compatibility or internal redirects */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- Role Based Routes --- */}

        {/* Collector: Central Command Room */}
        <Route path="/dashboard/admin/central" element={
          <ProtectedRoute requiredRole="ROLE_COLLECTOR">
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/departments" element={
          <ProtectedRoute requiredRole="ROLE_COLLECTOR">
            <DashboardLayout>
              <AdminDepartmentsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/assign-task" element={
          <ProtectedRoute requiredRole="ROLE_COLLECTOR">
            <DashboardLayout>
              <AdminAssignTaskPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/task-status" element={
          <ProtectedRoute requiredRole="ROLE_COLLECTOR">
            <DashboardLayout>
              <AdminTaskStatusPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/profile" element={
          <ProtectedRoute requiredRole="ROLE_COLLECTOR">
            <DashboardLayout>
              <AdminProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        {/* Legacy Alias */}
        <Route path="/admin-dashboard" element={<Navigate to="/dashboard/admin/central" replace />} />

        {/* Dept Head: Dynamic Department Dashboard */}
        <Route path="/dashboard/:dept/head" element={
          <ProtectedRoute requiredRole="ROLE_DEPT_HEAD">
            <DashboardLayout>
              <DepartmentsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        {/* Legacy Alias */}
        <Route path="/dept-dashboard" element={
          // We can't easily redirect to dynamic route without knowing dept here, 
          // but the Login page handles the correct redirection now.
          // This fallback is just in case.
          <Navigate to="/login" replace />
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
