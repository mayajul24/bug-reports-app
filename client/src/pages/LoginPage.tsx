import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await apiClient.checkStatus(email);

      if (result.status === 'blacklisted') {
        setError(result.reason ?? 'Your account has been blacklisted.');
        return;
      }

      setAuth({ email, status: result.status });

      if (result.status === 'admin') {
        navigate('/reports');
      } else {
        navigate('/report');
      }
    } catch {
      setError('Unable to verify your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="form">
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Checking...' : 'Login'}
        </button>
      </form>
    </div>
  );
}