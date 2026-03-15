const STYLES = {
  // traveler status
  approved:    'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25',
  pending:     'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/25',
  flagged:     'bg-red-500/15 text-red-300 ring-1 ring-red-500/25',
  rejected:    'bg-zinc-500/15 text-zinc-400 ring-1 ring-zinc-500/25',
  // case status
  open:        'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/25',
  in_progress: 'bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/25',
  resolved:    'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25',
  escalated:   'bg-red-500/15 text-red-300 ring-1 ring-red-500/25',
  // priority
  low:         'bg-slate-500/15 text-slate-400 ring-1 ring-slate-500/25',
  medium:      'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/25',
  high:        'bg-red-500/15 text-red-300 ring-1 ring-red-500/25',
  // roles
  admin:           'bg-purple-500/15 text-purple-300 ring-1 ring-purple-500/25',
  border_officer:  'bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/25',
  ngo_coordinator: 'bg-teal-500/15 text-teal-300 ring-1 ring-teal-500/25',
}

const DOTS = {
  approved: 'bg-emerald-400', pending: 'bg-amber-400', flagged: 'bg-red-400',
  rejected: 'bg-zinc-400', open: 'bg-sky-400', in_progress: 'bg-violet-400',
  resolved: 'bg-emerald-400', escalated: 'bg-red-400',
  low: 'bg-slate-400', medium: 'bg-amber-400', high: 'bg-red-400',
}

export default function StatusBadge({ status, dot = false, size = 'sm' }) {
  if (!status) return null
  const cls = STYLES[status] || 'bg-zinc-500/15 text-zinc-400 ring-1 ring-zinc-500/25'
  const label = status.replace(/_/g, ' ')
  const sz = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-mono font-medium capitalize ${sz} ${cls}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOTS[status] || 'bg-zinc-400'}`} />}
      {label}
    </span>
  )
}