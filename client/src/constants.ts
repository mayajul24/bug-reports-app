import { Report } from './types/Report';

export const STATUS_CLASS_MAP: Record<Report['status'], string> = {
  NEW: 'badge badge-new',
  APPROVED: 'badge badge-approved',
  RESOLVED: 'badge badge-resolved',
};

export const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const REPORTS_PER_PAGE = 5;
export const PLACEHOLDER_ATTACHMENT = '/uploads/placeholder.txt';