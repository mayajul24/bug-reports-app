export interface Report {
  id: string;
  issueType: string;
  description: string;
  contactName: string;
  contactEmail: string;
  status: 'NEW' | 'APPROVED' | 'RESOLVED';
  createdAt: number;
  approvedAt?: number;
  attachmentUrl: string;
}

export interface CreateReportPayload {
  [key: string]: string;
  issueType: string;
  description: string;
  contactName: string;
  contactEmail: string;
  attachmentUrl: string;
}
