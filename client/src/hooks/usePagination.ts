import { useState, useMemo } from 'react';
import { REPORTS_PER_PAGE } from '../constants';

export function usePagination<T>(items: T[]) {
  const [currentPage, setCurrentPage] = useState(1);

  const { totalPages, paginatedItems } = useMemo(() => {
    const totalPages = Math.ceil(items.length / REPORTS_PER_PAGE);
    const paginatedItems = items.slice(
      (currentPage - 1) * REPORTS_PER_PAGE,
      currentPage * REPORTS_PER_PAGE
    );
    return { totalPages, paginatedItems };
  }, [items, currentPage]);

  const changePage = (page: number) => setCurrentPage(page);

  const reset = () => setCurrentPage(1);

  return { currentPage, totalPages, paginatedItems, changePage, reset };
}
