import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Report, FetchStatus } from '../types/Report';
import { ReportCard } from '../components/ReportCard';
import { usePagination } from '../hooks/usePagination';

export function MyReportsPage() {
  const { auth } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [status, setStatus] = useState<FetchStatus>('loading');
  const [error, setError] = useState('');
  const reportsListRef = useRef<HTMLDivElement>(null);

  const { currentPage, totalPages, paginatedItems, changePage } = usePagination(reports);

  useEffect(() => {
    reportsListRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    const fetchMyReports = async () => {
      setStatus('loading');
      setError('');
      try {
        const all = await apiClient.getReports();
        setReports(all.filter(r => r.contactEmail === auth?.email));
        setStatus('success');
      } catch {
        setError('Failed to load your reports. Please try again.');
        setStatus('error');
      }
    };

    fetchMyReports();
  }, [auth?.email]);

  return (
    <div className="page">
      <h1>My Reports</h1>

      {status === 'loading' && <div className="spinner" />}

      {status === 'error' && (
        <div className="alert alert-error">{error}</div>
      )}

      {status === 'success' && reports.length === 0 && (
        <p className="placeholder-text">You haven't submitted any reports yet.</p>
      )}

      {status === 'success' && reports.length > 0 && (
        <>
          <div className="report-list" ref={reportsListRef}>
            {paginatedItems.map(report => (
              <ReportCard key={report.id} report={report} />
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