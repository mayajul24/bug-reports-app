import { BrowserRouter, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppNav() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="nav">
      <div className="nav-brand">🐛 Bug Reporter</div>
      <ul className="nav-links">
        {auth && (
          <>
            <li>
              <NavLink to="/report" className={({ isActive }) => isActive ? 'active' : ''}>
                Report Bug
              </NavLink>
            </li>
            {auth.status === 'admin' && (
              <li>
                <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
                  Reports List
                </NavLink>
              </li>
            )}
          </>
        )}
      </ul>
      {auth && (
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      )}
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
              <Route path="/report" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
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