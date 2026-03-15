import { Report } from '../types/Report';
import { API_BASE_URL } from '../config';
import { PLACEHOLDER_ATTACHMENT } from '../constants';
import { StatusBadge } from './StatusBadge';

interface ReportCardProps {
  report: Report;
  onApprove?: (id: string) => Promise<void>;
  onResolve?: (id: string) => Promise<void>;
  isLoading?: boolean;
}

type AdminAction = {
    label: string;
    handler: (id: string) => Promise<void>;
};

export function ReportCard({ report, onApprove, onResolve, isLoading }: ReportCardProps) {
  // Enforces the status lifecycle: NEW → Approve → APPROVED → Resolve → RESOLVED
  const adminAction:AdminAction | null =
    report.status === 'NEW' && onApprove ? { label: 'Approve', handler: onApprove } :
    report.status === 'APPROVED' && onResolve ? { label: 'Resolve', handler: onResolve } :
    null;

  return (
    <div className="report-card">
      <div className="report-card-header">
        <span className="report-issue-type">{report.issueType}</span>
        <StatusBadge status={report.status} />
      </div>
      <p className="report-description">{report.description}</p>
      <div className="report-meta">
        <span>
            <strong>Name:</strong> {report.contactName}
        </span>
        <span>
            <strong>Email:</strong> {report.contactEmail}
        </span>
        <span>
            <strong>Created:</strong> {new Date(report.createdAt).toLocaleDateString()}
        </span>
        {report.approvedAt && (
          <span>
              <strong>Approved:</strong> {new Date(report.approvedAt).toLocaleDateString()}
          </span>
        )}
        {report.attachmentUrl && report.attachmentUrl !== PLACEHOLDER_ATTACHMENT && (
          <span>
            <strong>Attachment:</strong>{' '}
            <a href={`${API_BASE_URL}${report.attachmentUrl}`} target="_blank" rel="noreferrer">
              View file
            </a>
          </span>
        )}
      </div>
      {adminAction && (
        <div className="report-actions">
          <button className="btn btn-primary" onClick={() => adminAction.handler(report.id)} disabled={isLoading}>
            {isLoading ? '...' : adminAction.label}
          </button>
        </div>
      )}
    </div>
  );
}