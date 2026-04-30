export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div style={{ display: "flex", gap: "10px", justifyContent: "center", margin: "20px 0" }}>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: "8px 12px",
            background: page === currentPage ? "#333" : "#eee",
            color: page === currentPage ? "#fff" : "#000",
            border: "none",
            cursor: "pointer",
          }}
        >
          {page}
        </button>
      ))}
    </div>
  );
}