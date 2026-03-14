import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Report, FetchStatus } from '../types/Report';
import { ReportCard } from '../components/ReportCard';

export function ReportsPage() {
  const { auth } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [status, setStatus] = useState<FetchStatus>('idle');
  const [error, setError] = useState('');

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

  const updateReport = (updated: Report) => {
    setReports(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  const handleApprove = async (id: string) => {
    try {
      const updated = await apiClient.approveReport(id);
      updateReport(updated);
    } catch {
      setError('Failed to approve report. Please try again.');
    }
  };

  const handleResolve = async (id: string) => {
    try {
      const updated = await apiClient.resolveReport(id);
      updateReport(updated);
    } catch {
      setError('Failed to resolve report. Please try again.');
    }
  };

  return (
    <div className="page">
      <h1>Reports List</h1>
      <p className="form-required-note">Logged in as {auth?.email} (admin)</p>

      <button className="btn btn-secondary" onClick={fetchReports} disabled={status === 'loading'}>
        {status === 'loading' ? 'Loading...' : 'Load Reports'}
      </button>

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