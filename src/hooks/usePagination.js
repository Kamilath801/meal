// src/hooks/usePagination.js
import { useState, useEffect } from 'react';

export default function usePagination(items, perPage = 8) {
  const [page, setPage] = useState(1);

  // Revenir à la page 1 quand les items changent
  useEffect(() => { setPage(1); }, [items]);

  const totalPages  = Math.ceil(items.length / perPage);
  const start       = (page - 1) * perPage;
  const paginated   = items.slice(start, start + perPage);

  const goTo    = (p) => setPage(Math.max(1, Math.min(p, totalPages)));
  const next    = () => goTo(page + 1);
  const prev    = () => goTo(page - 1);

  return { page, totalPages, paginated, goTo, next, prev };
}