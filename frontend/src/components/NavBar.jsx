import { useAuth } from '../context/AuthContext'
import StatusBadge from './StatusBadge'

export default function Navbar({ title, actions }) {
  const { user } = useAuth()

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-surface/60 backdrop-blur-sm sticky top-0 z-30">
      <h1 className="font-display font-bold text-white text-base tracking-wide">{title}</h1>
      <div className="flex items-center gap-3">
        {actions}
        <div className="flex items-center gap-2.5 pl-3 border-l border-border">
          <StatusBadge status={user?.role} size="xs" />
          <span className="text-xs text-mutedLight font-medium">{user?.name}</span>
          <span className="text-[10px] font-mono text-muted bg-bg/60 px-1.5 py-0.5 rounded">#{user?.badgeNumber}</span>
        </div>
      </div>
    </header>
  )
}