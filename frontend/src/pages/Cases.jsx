import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Table from '../components/Table'
import StatusBadge from '../components/StatusBadge'
import Pagination from '../components/Pagination'
import api from '../api/axios'

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
const SELECT  = 'px-3 py-2 bg-bg border border-border rounded-xl text-sm text-mutedLight focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all'

export default function Cases() {
  const navigate = useNavigate()
  const [rows, setRows]     = useState([])
  const [total, setTotal]   = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage]     = useState(1)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: '', caseType: '', priority: '' })

  const load = useCallback(async (p = 1) => {
    setLoading(true)
    try {
      const params = { page: p, limit: 10, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) }
      const { data } = await api.get('/cases', { params })
      setRows(data.cases || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { load(page) }, [page])
  const handleSearch = () => { setPage(1); load(1) }
  const setF = (k) => (e) => setFilters(f => ({ ...f, [k]: e.target.value }))

  const columns = [
    { key: 'id',        label: 'Case ID',      render: r => <span className="font-mono text-xs text-muted">#{r._id?.slice(-8).toUpperCase()}</span> },
    { key: 'traveler',  label: 'Traveler',     render: r => <span className="font-medium text-white">{r.travelerId?.name || '—'}</span> },
    { key: 'caseType',  label: 'Type',         render: r => <span className="font-mono text-xs text-mutedLight capitalize">{r.caseType?.replace('_', ' ')}</span> },
    { key: 'priority',  label: 'Priority',     render: r => <StatusBadge status={r.priority} size="xs" /> },
    { key: 'status',    label: 'Status',       render: r => <StatusBadge status={r.status} dot size="xs" /> },
    { key: 'officer',   label: 'Assigned To',  render: r => <span className="text-xs text-muted">{r.assignedOfficerId?.name || 'Unassigned'}</span> },
    { key: 'updatedAt', label: 'Last Updated', render: r => <span className="font-mono text-xs text-muted">{fmtDate(r.updatedAt)}</span> },
  ]

  return (
    <Layout title="Cases">
      {/* Filter bar */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-5 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[130px]">
          <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-1.5">Status</label>
          <select className={SELECT} value={filters.status} onChange={setF('status')}>
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="escalated">Escalated</option>
          </select>
        </div>
        <div className="flex-1 min-w-[130px]">
          <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-1.5">Case Type</label>
          <select className={SELECT} value={filters.caseType} onChange={setF('caseType')}>
            <option value="">All Types</option>
            <option value="regular">Regular</option>
            <option value="refugee">Refugee</option>
            <option value="asylum">Asylum</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
        <div className="flex-1 min-w-[130px]">
          <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-1.5">Priority</label>
          <select className={SELECT} value={filters.priority} onChange={setF('priority')}>
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSearch} className="px-4 py-2 rounded-xl bg-accent hover:bg-accentGlow text-white text-sm font-medium transition-all">
            Filter
          </button>
          <button
            onClick={() => { setFilters({ status: '', caseType: '', priority: '' }); setPage(1); setTimeout(() => load(1), 0) }}
            className="px-4 py-2 rounded-xl border border-border text-muted hover:text-white text-sm font-medium transition-all"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-muted">{total} case{total !== 1 ? 's' : ''} found</span>
      </div>

      <Table
        columns={columns}
        rows={rows}
        loading={loading}
        onRowClick={r => navigate(`/cases/${r._id}`)}
        emptyMsg="No cases match the current filters."
      />
      <Pagination page={page} totalPages={totalPages} onChange={p => setPage(p)} />
    </Layout>
  )
}