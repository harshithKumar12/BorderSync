export default function Table({ columns, rows, onRowClick, loading, emptyMsg = 'No records found.' }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface/50">
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3 text-left text-[10px] font-mono text-muted uppercase tracking-widest">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-border/50">
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3">
                    <div className="h-4 rounded bg-border animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (!rows?.length) {
    return (
      <div className="rounded-2xl border border-border bg-surface/30 px-6 py-16 text-center">
        <div className="text-3xl mb-3 opacity-20">◉</div>
        <div className="text-sm text-muted">{emptyMsg}</div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface/80">
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3 text-left text-[10px] font-mono text-muted uppercase tracking-widest whitespace-nowrap">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row._id || i}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-border/40 transition-colors ${onRowClick ? 'cursor-pointer hover:bg-surface/60' : ''}`}
              >
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 text-sm">
                    {c.render ? c.render(row) : <span className="text-mutedLight">{row[c.key] ?? '—'}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}