// src/components/Pagination.jsx
import { IcFleche } from './Icons';

const IcFlecheLeft = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>
  </svg>
);

export default function Pagination({ page, totalPages, onPrev, onNext, onGoTo }) {
  if (totalPages <= 1) return null;

  // Générer les numéros à afficher (max 5 boutons)
  const getPages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (page >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', page - 1, page, page + 1, '...', totalPages];
  };

  return (
    <div className="pagination">
      <button className="page-btn nav" onClick={onPrev} disabled={page === 1}>
        <IcFlecheLeft size={14} />
      </button>

      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="page-dots">···</span>
        ) : (
          <button
            key={p}
            className={`page-btn${p === page ? ' active' : ''}`}
            onClick={() => onGoTo(p)}
          >
            {p}
          </button>
        )
      )}

      <button className="page-btn nav" onClick={onNext} disabled={page === totalPages}>
        <IcFleche size={14} />
      </button>
    </div>
  );
}