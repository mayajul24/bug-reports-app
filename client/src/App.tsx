import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { ReportPage } from './pages/ReportPage';
import { ReportsPage } from './pages/ReportsPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { auth } = useAuth();
  if (!auth || auth.status !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AppNav() {
  const { auth } = useAuth();

  return (
    <nav className="nav">
      <div className="nav-brand">🐛 Bug Reporter</div>
      <ul className="nav-links">
        <li>
          <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>
            Login
          </NavLink>
        </li>
        <li>
          <NavLink to="/report" className={({ isActive }) => isActive ? 'active' : ''}>
            Report Bug
          </NavLink>
        </li>
        {auth?.status === 'admin' && (
          <li>
            <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
              Reports List
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <AppNav />
          <main className="main">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route
                path="/reports"
                element={
                  <AdminRoute>
                    <ReportsPage />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;