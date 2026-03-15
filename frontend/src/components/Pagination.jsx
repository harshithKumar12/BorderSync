export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null

  const pages = []
  for (let i = 1; i <= totalPages; i++) pages.push(i)

  return (
    <div className="flex items-center justify-end gap-1 mt-4 pt-4 border-t border-border">
      <span className="text-xs text-muted mr-2 font-mono">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-2.5 py-1.5 rounded-lg text-sm text-muted hover:text-white hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ←
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-8 h-8 rounded-lg text-sm font-mono transition-all ${
            p === page
              ? 'bg-accent text-white shadow-glow'
              : 'text-muted hover:text-white hover:bg-surface'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="px-2.5 py-1.5 rounded-lg text-sm text-muted hover:text-white hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        →
      </button>
    </div>
  )
}