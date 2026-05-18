export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button className="btn-secondary disabled:opacity-40" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Prev</button>
      <span className="text-sm text-slate-300">Page {page} of {totalPages}</span>
      <button className="btn-secondary disabled:opacity-40" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
    </div>
  );
}