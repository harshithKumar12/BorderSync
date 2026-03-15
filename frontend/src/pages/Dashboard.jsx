import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import Table from '../components/Table'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const fmtTime = (d) => d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

export default function Dashboard() {
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const { isNGO, canWrite } = useAuth()
  const navigate            = useNavigate()

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(r => setStats(r.data))
      .finally(() => setLoading(false))
  }, [])

  const recentCols = [
    { key: 'name',         label: 'Name',        render: r => <span className="font-medium text-white">{r.name}</span> },
    { key: 'nationality',  label: 'Nationality',  render: r => <span className="text-mutedLight">{r.nationality}</span> },
    { key: 'documentType', label: 'Doc Type',     render: r => <span className="font-mono text-xs text-muted capitalize">{r.documentType?.replace('_', ' ')}</span> },
    { key: 'status',       label: 'Status',       render: r => <StatusBadge status={r.status} dot /> },
    { key: 'entryTime',    label: 'Entry Time',   render: r => <span className="font-mono text-xs text-muted">{fmtTime(r.entryTime)}</span> },
  ]

  return (
    <Layout
      title="Dashboard"
      actions={
        canWrite && (
          <button
            onClick={() => navigate('/entry/new')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent hover:bg-accentGlow text-white text-sm font-medium transition-all shadow-glow"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/></svg>
            New Entry
          </button>
        )
      }
    >
      {/* Stat grid */}
      {!isNGO ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <StatCard label="Today's Entries" value={stats?.totalToday}  icon="↑" accent="#6C5CE7" loading={loading} />
          <StatCard label="Pending"          value={stats?.pending}     icon="◌" accent="#F59E0B" loading={loading} />
          <StatCard label="Approved"         value={stats?.approved}    icon="✓" accent="#10B981" loading={loading} />
          <StatCard label="Flagged"          value={stats?.flagged}     icon="⚑" accent="#EF4444" loading={loading} />
          <StatCard label="Rejected"         value={stats?.rejected}    icon="✕" accent="#6B7280" loading={loading} />
          <StatCard label="Open Cases"       value={stats?.openCases}   icon="◉" accent="#3B82F6" loading={loading} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <StatCard label="Open Cases"    value={stats?.openCases} icon="◉" accent="#3B82F6" loading={loading} />
          <StatCard label="Total Flagged" value={stats?.flagged}   icon="⚑" accent="#EF4444" loading={loading} />
        </div>
      )}

      {/* Recent entries table — hidden for NGO */}
      {!isNGO && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="font-display font-semibold text-white text-sm">Recent Entries</h2>
              <p className="text-[11px] text-muted mt-0.5">Latest traveler registrations</p>
            </div>
            <button
              onClick={() => navigate('/travelers')}
              className="text-xs text-accent hover:text-accentGlow font-medium transition-colors"
            >
              View all →
            </button>
          </div>
          <Table
            columns={recentCols}
            rows={stats?.recentEntries || []}
            loading={loading}
            onRowClick={r => navigate(`/travelers/${r._id}`)}
            emptyMsg="No entries yet today."
          />
        </div>
      )}

      {isNGO && (
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3 opacity-20">◉</div>
          <h3 className="font-display font-semibold text-white mb-1">Cases Overview</h3>
          <p className="text-sm text-muted mb-4">You have read-only access to cases and traveler data.</p>
          <button
            onClick={() => navigate('/cases')}
            className="inline-flex px-5 py-2 rounded-xl bg-accent/20 hover:bg-accent/30 text-accent text-sm font-medium border border-accent/30 transition-all"
          >
            Browse Cases
          </button>
        </div>
      )}
    </Layout>
  )
}