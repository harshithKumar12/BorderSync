export default function StatCard({ label, value, icon, accent = '#6C5CE7', sub, loading }) {
  return (
    <div
      className="relative rounded-2xl border border-border bg-card p-5 overflow-hidden shadow-card animate-fade-up"
      style={{ '--accent': accent }}
    >
      {/* Subtle glow in corner */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-2xl"
        style={{ background: accent }}
      />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-mono text-muted uppercase tracking-widest">{label}</span>
          <span className="text-xl opacity-60">{icon}</span>
        </div>
        {loading ? (
          <div className="h-8 w-16 rounded-lg bg-border animate-pulse" />
        ) : (
          <div className="text-3xl font-display font-bold text-white">{value ?? '—'}</div>
        )}
        {sub && <div className="text-xs text-muted mt-1">{sub}</div>}
      </div>
    </div>
  )
}