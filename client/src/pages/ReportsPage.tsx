import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Report, FetchStatus } from '../types/Report';
import { ReportCard } from '../components/ReportCard';

export function ReportsPage() {
  const { auth } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [status, setStatus] = useState<FetchStatus>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    void fetchReports();
  }, []);

  const fetchReports = async () => {
    setStatus('loading');
    setError('');
    try {
      const data: Report[] = await apiClient.getReports();
      setReports(data);
      setStatus('success');
    } catch {
      setError('Failed to load reports. Please try again.');
      setStatus('error');
    }
  };

  const handleAction = async (action: () => Promise<Report>, errorMsg: string) => {
    try {
      const updated = await action();
      setReports(prev => prev.map(report => report.id === updated.id ? updated : report));
    } catch {
      setError(errorMsg);
    }
  };

  const handleApprove = (id: string) => handleAction(
    () => apiClient.approveReport(id, auth?.email ?? ''),
    'Failed to approve report. Please try again.'
  );

  const handleResolve = (id: string) => handleAction(
    () => apiClient.resolveReport(id, auth?.email ?? ''),
    'Failed to resolve report. Please try again.'
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Reports List</h1>
          <p className="form-required-note">Logged in as {auth?.email} (admin)</p>
        </div>
        <button className="btn-refresh" onClick={fetchReports} disabled={status === 'loading'}>
          {status === 'loading' ? '↻' : '↻ Refresh'}
        </button>
      </div>

      {status === 'loading' && <div className="spinner" />}

      {error && (
        <div className="alert alert-error" style={{ marginTop: '1rem' }}>{error}</div>
      )}

      {status === 'success' && reports.length === 0 && (
        <p className="placeholder-text">No reports submitted yet.</p>
      )}

      {status === 'success' && reports.length > 0 && (
        <div className="report-list">
          {reports.map(report => (
            <ReportCard key={report.id} report={report} onApprove={handleApprove} onResolve={handleResolve} />
          ))}
        </div>
      )}
    </div>
  );
}