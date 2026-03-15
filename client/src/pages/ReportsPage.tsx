import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Report } from '../types/Report';
import { FetchStatus } from '../types/common';
import { ReportCard } from '../components/ReportCard';
import { usePagination } from '../hooks/usePagination';

export function ReportsPage() {
  const { auth } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [status, setStatus] = useState<FetchStatus>('loading');
  const [error, setError] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { currentPage, totalPages, paginatedItems: paginatedReports, changePage, reset } = usePagination(reports);

  const reportsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    reportsListRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentPage]);

  const fetchReports = async () => {
    setStatus('loading');
    setError('');
    reset();
    try {
      const data: Report[] = await apiClient.getReports();
      setReports(data);
      setStatus('success');
    } catch {
      setError('Failed to load reports. Please try again.');
      setStatus('error');
    }
  };

  // Tracks which report is being actioned to disable its button and prevent double-clicks
  const handleAction = async (id: string, action: () => Promise<Report>, errorMsg: string) => {
    setLoadingId(id);
    try {
      const updated = await action();
      setReports(prev => prev.map(report => report.id === updated.id ? updated : report));
    } catch {
      setError(errorMsg);
    } finally {
      setLoadingId(null);
    }
  };

  const handleApprove = (id: string) => handleAction(
    id,
    () => apiClient.approveReport(id, auth?.email ?? ''),
    'Failed to approve report. Please try again.'
  );

  const handleResolve = (id: string) => handleAction(
    id,
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
      {status === 'error' && (
        <div className="alert alert-error">{error}</div>
      )}
      {status === 'success' && reports.length === 0 && (
        <p className="placeholder-text">No reports submitted yet.</p>
      )}
      {status === 'success' && reports.length > 0 && (
        <>
          <div className="report-list" ref={reportsListRef}>
            {paginatedReports.map(report => (
              <ReportCard key={report.id} report={report} onApprove={handleApprove} onResolve={handleResolve} isLoading={loadingId === report.id} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn-page"
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Prev
              </button>
              <span className="page-info">Page {currentPage} of {totalPages}</span>
              <button
                className="btn-page"
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
