import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Table from '../components/Table'
import StatusBadge from '../components/StatusBadge'
import Pagination from '../components/Pagination'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

const SELECT = 'px-3 py-2 bg-bg border border-border rounded-xl text-sm text-mutedLight focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all'
const INPUT  = 'px-3 py-2 bg-bg border border-border rounded-xl text-sm text-white placeholder-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all'

export default function Travelers() {
  const navigate   = useNavigate()
  const { canWrite } = useAuth()
  const [rows, setRows]       = useState([])
  const [total, setTotal]     = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage]       = useState(1)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: '', nationality: '', startDate: '', endDate: '' })

  const load = useCallback(async (p = 1) => {
    setLoading(true)
    try {
      const params = { page: p, limit: 10, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) }
      const { data } = await api.get('/travelers', { params })
      setRows(data.data || [])
      setTotal(data.pagination?.total || 0)
      setTotalPages(data.pagination?.totalPages || 1)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { load(page) }, [page])           // on page change
  const handleSearch = () => { setPage(1); load(1) } // on filter apply

  const setF = (k) => (e) => setFilters(f => ({ ...f, [k]: e.target.value }))

  const columns = [
    { key: 'name',         label: 'Name',         render: r => <span className="font-medium text-white">{r.name}</span> },
    { key: 'nationality',  label: 'Nationality',   render: r => <span className="text-mutedLight">{r.nationality}</span> },
    { key: 'documentType', label: 'Doc Type',      render: r => <span className="font-mono text-xs text-muted capitalize">{r.documentType?.replace('_', ' ')}</span> },
    { key: 'documentNumber', label: 'Doc #',       render: r => <span className="font-mono text-xs text-muted">{r.documentNumber}</span> },
    { key: 'status',       label: 'Status',        render: r => <StatusBadge status={r.status} dot /> },
    { key: 'entryTime',    label: 'Entry Time',    render: r => <span className="font-mono text-xs text-muted">{fmtDate(r.entryTime)}</span> },
    { key: 'actions',      label: '',              render: r => (
      <button
        onClick={e => { e.stopPropagation(); navigate(`/travelers/${r._id}`) }}
        className="px-2.5 py-1 rounded-lg text-xs text-muted hover:text-white hover:bg-surface border border-transparent hover:border-border transition-all"
      >
        View →
      </button>
    )},
  ]

  return (
    <Layout
      title="Travelers"
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
      {/* Filter bar */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-5 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[140px]">
          <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-1.5">Status</label>
          <select className={SELECT} value={filters.status} onChange={setF('status')}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="flagged">Flagged</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-1.5">Nationality</label>
          <input className={INPUT} placeholder="e.g. Brazilian" value={filters.nationality} onChange={setF('nationality')} />
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-1.5">From Date</label>
          <input type="date" className={INPUT} value={filters.startDate} onChange={setF('startDate')} />
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-1.5">To Date</label>
          <input type="date" className={INPUT} value={filters.endDate} onChange={setF('endDate')} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-xl bg-accent hover:bg-accentGlow text-white text-sm font-medium transition-all"
          >
            Filter
          </button>
          <button
            onClick={() => { setFilters({ status: '', nationality: '', startDate: '', endDate: '' }); setPage(1); setTimeout(() => load(1), 0) }}
            className="px-4 py-2 rounded-xl border border-border text-muted hover:text-white text-sm font-medium transition-all"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Count */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-muted">{total} traveler{total !== 1 ? 's' : ''} found</span>
      </div>

      <Table
        columns={columns}
        rows={rows}
        loading={loading}
        onRowClick={r => navigate(`/travelers/${r._id}`)}
        emptyMsg="No travelers match the current filters."
      />
      <Pagination page={page} totalPages={totalPages} onChange={p => setPage(p)} />
    </Layout>
  )
}