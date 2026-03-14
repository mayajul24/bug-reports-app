import { Report } from './types/Report';

export const STATUS_CLASS_MAP: Record<Report['status'], string> = {
  NEW: 'badge badge-new',
  APPROVED: 'badge badge-approved',
  RESOLVED: 'badge badge-resolved',
};