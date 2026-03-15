import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import { toast } from '../components/Toast'
import api from '../api/axios'

const INPUT = 'w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-white text-sm placeholder-muted/40 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all'
const LABEL = 'block text-[10px] font-mono text-muted uppercase tracking-widest mb-1.5'

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

export default function Admin() {
  const [officers, setOfficers] = useState([])
  const [loadingList, setLoadingList] = useState(true)
  const [toggling, setToggling]   = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'border_officer', badgeNumber: ''
  })

  const load = () => {
    setLoadingList(true)
    api.get('/admin/officers')
      .then(r => setOfficers(r.data))
      .catch(() => toast.error('Failed to load officers'))
      .finally(() => setLoadingList(false))
  }

  useEffect(() => { load() }, [])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleRegister = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/auth/register', form)
      toast.success(`Officer ${form.name} registered successfully`)
      setForm({ name: '', email: '', password: '', role: 'border_officer', badgeNumber: '' })
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggle = async (officerId) => {
    setToggling(officerId)
    try {
      const { data } = await api.patch(`/admin/officers/${officerId}/toggle`)
      setOfficers(prev => prev.map(o => o._id === officerId ? data : o))
      toast.info(`Officer ${data.isActive ? 'activated' : 'deactivated'}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update officer')
    } finally {
      setToggling(null)
    }
  }

  const roleLabel = { admin: 'Admin', border_officer: 'Border Officer', ngo_coordinator: 'NGO Coordinator' }

  return (
    <Layout title="Admin Panel">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Register form */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
          <div className="px-6 py-5 border-b border-border">
            <h2 className="font-display font-semibold text-white">Register New Officer</h2>
            <p className="text-xs text-muted mt-0.5">Create a new account for a border officer or NGO coordinator</p>
          </div>
          <form onSubmit={handleRegister} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Full Name *</label>
                <input className={INPUT} value={form.name} onChange={set('name')} placeholder="Officer Name" required />
              </div>
              <div>
                <label className={LABEL}>Email Address *</label>
                <input type="email" className={INPUT} value={form.email} onChange={set('email')} placeholder="officer@bordersync.io" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Password *</label>
                <input type="password" className={INPUT} value={form.password} onChange={set('password')} placeholder="min. 8 characters" required minLength={6} />
              </div>
              <div>
                <label className={LABEL}>Badge Number *</label>
                <input className={INPUT} value={form.badgeNumber} onChange={set('badgeNumber')} placeholder="OFF-099" required />
              </div>
            </div>
            <div>
              <label className={LABEL}>Role *</label>
              <select className={INPUT} value={form.role} onChange={set('role')} required>
                <option value="border_officer">Border Officer</option>
                <option value="ngo_coordinator">NGO Coordinator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-accent hover:bg-accentGlow disabled:opacity-50 text-white font-display font-semibold text-sm transition-all shadow-glow"
            >
              {submitting
                ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Registering…</span>
                : 'Register Officer'}
            </button>
          </form>
        </div>

        {/* Officers list */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <h2 className="font-display font-semibold text-white">All Officers</h2>
            <span className="text-xs font-mono text-muted">{officers.length} total</span>
          </div>

          {loadingList ? (
            <div className="p-6 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-border/40 animate-pulse" />
              ))}
            </div>
          ) : officers.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-muted">No officers found.</div>
          ) : (
            <div className="divide-y divide-border/50">
              {officers.map(officer => (
                <div key={officer._id} className="flex items-center justify-between px-6 py-4 hover:bg-surface/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accentDim/30 flex items-center justify-center font-display font-bold text-base text-accentGlow shrink-0">
                      {officer.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{officer.name}</span>
                        {!officer.isActive && (
                          <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                            INACTIVE
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted">{officer.email}</span>
                        <span className="text-muted/30">·</span>
                        <span className="text-[10px] font-mono text-muted">#{officer.badgeNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={officer.role} size="xs" />
                    <span className="text-[10px] font-mono text-muted hidden sm:block">{fmtDate(officer.createdAt)}</span>
                    <button
                      onClick={() => handleToggle(officer._id)}
                      disabled={toggling === officer._id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all disabled:opacity-50 ${
                        officer.isActive
                          ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                      }`}
                    >
                      {toggling === officer._id ? '…' : officer.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}