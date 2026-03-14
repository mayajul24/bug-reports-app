import { Report } from '../types/Report';
import { STATUS_CLASS_MAP } from '../constants';

export function StatusBadge({ status }: { status: Report['status'] }) {
  return <span className={STATUS_CLASS_MAP[status]}>{status}</span>;
}