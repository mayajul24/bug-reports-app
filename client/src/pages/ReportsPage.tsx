import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Report } from '../types/Report';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

function StatusBadge({ status }: { status: Report['status'] }) {
  const classMap: Record<Report['status'], string> = {
    NEW: 'badge badge-new',
    APPROVED: 'badge badge-approved',
    RESOLVED: 'badge badge-resolved',
  };
  return <span className={classMap[status]}>{status}</span>;
}

function ReportCard({ report }: { report: Report }) {
  return (
    <div className="report-card">
      <div className="report-card-header">
        <span className="report-issue-type">{report.issueType}</span>
        <StatusBadge status={report.status} />
      </div>

      <p className="report-description">{report.description}</p>

      <div className="report-meta">
        <span><strong>Name:</strong> {report.contactName}</span>
        <span><strong>Email:</strong> {report.contactEmail}</span>
        <span><strong>Created:</strong> {new Date(report.createdAt).toLocaleDateString()}</span>
        {report.approvedAt && (
          <span><strong>Approved:</strong> {new Date(report.approvedAt).toLocaleDateString()}</span>
        )}
        {report.attachmentUrl && (
          <span>
            <strong>Attachment:</strong>{' '}
            <a href={`${API_BASE_URL}${report.attachmentUrl}`} target="_blank" rel="noreferrer">
              View file
            </a>
          </span>
        )}
      </div>
    </div>
  );
}

export function ReportsPage() {
  const { auth } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiClient.getReports();
      setReports(data);
      setLoaded(true);
    } catch {
      setError('Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Reports List</h1>
      <p className="form-required-note">Logged in as {auth?.email} (admin)</p>

      <button className="btn btn-secondary" onClick={fetchReports} disabled={loading}>
        {loading ? 'Loading...' : 'Load Reports'}
      </button>

      {!loading && error && (
        <div className="alert alert-error" style={{ marginTop: '1rem' }}>{error}</div>
      )}

      {!loading && loaded && !error && reports.length === 0 && (
        <p className="placeholder-text">No reports submitted yet.</p>
      )}

      {!loading && !error && reports.length > 0 && (
        <div className="report-list">
          {reports.map(report => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}