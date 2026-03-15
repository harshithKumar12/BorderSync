import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import { toast } from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const fmtDate = (d) => d ? new Date(d).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—'
const LABEL   = 'text-[10px] font-mono text-muted uppercase tracking-widest mb-1'

function Field({ label, value }) {
  return (
    <div>
      <div className={LABEL}>{label}</div>
      <div className="text-sm text-white font-medium">{value || '—'}</div>
    </div>
  )
}

export default function CaseDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { canWrite, user } = useAuth()

  const [caseData, setCaseData] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [status, setStatus]     = useState('')
  const [priority, setPriority] = useState('')
  const [noteText, setNoteText] = useState('')

  useEffect(() => {
    api.get(`/cases/${id}`)
      .then(r => {
        setCaseData(r.data)
        setStatus(r.data.status)
        setPriority(r.data.priority)
      })
      .catch(() => { toast.error('Case not found'); navigate('/cases') })
      .finally(() => setLoading(false))
  }, [id])

  const handleUpdate = async () => {
    if (!status && !priority && !noteText.trim()) return
    setSaving(true)
    try {
      const payload = { status, priority }
      if (noteText.trim()) payload.note = noteText.trim()
      const { data } = await api.patch(`/cases/${id}`, payload)
      setCaseData(data)
      setStatus(data.status)
      setPriority(data.priority)
      setNoteText('')
      toast.success('Case updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Layout title="Case Detail">
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    )
  }

  if (!caseData) return null

  const traveler = caseData.travelerId
  const officer  = caseData.assignedOfficerId

  return (
    <Layout
      title="Case Detail"
      actions={<button onClick={() => navigate('/cases')} className="text-sm text-muted hover:text-white transition-colors">← Back</button>}
    >
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Case header */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accentDim/30 flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-accentGlow">
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
                </svg>
              </div>
              <div>
                <div className="font-mono text-xs text-muted mb-0.5">CASE #{caseData._id?.slice(-8).toUpperCase()}</div>
                <h2 className="font-display font-bold text-white text-lg capitalize">
                  {caseData.caseType?.replace('_', ' ')} Case
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={priority} size="xs" />
              <StatusBadge status={status} dot size="xs" />
            </div>
          </div>

          <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-5">
            <Field label="Case Type"      value={caseData.caseType?.replace('_', ' ')} />
            <Field label="Assigned To"    value={officer?.name || 'Unassigned'} />
            <Field label="Badge #"        value={officer?.badgeNumber} />
            <Field label="Opened"         value={fmtDate(caseData.createdAt)} />
            <Field label="Last Updated"   value={fmtDate(caseData.updatedAt)} />
            <Field label="Notes Count"    value={`${caseData.notes?.length || 0} note${caseData.notes?.length !== 1 ? 's' : ''}`} />
          </div>
        </div>

        {/* Traveler info — read only */}
        {traveler && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-display font-semibold text-white text-sm">Traveler Record</h3>
              <button
                onClick={() => navigate(`/travelers/${traveler._id}`)}
                className="text-xs text-accent hover:text-accentGlow font-medium transition-colors"
              >
                Open profile →
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-5">
              <Field label="Full Name"       value={traveler.name} />
              <Field label="Nationality"     value={traveler.nationality} />
              <Field label="Document Type"   value={traveler.documentType?.replace('_', ' ')} />
              <Field label="Document #"      value={traveler.documentNumber} />
              <Field label="Entry Time"      value={fmtDate(traveler.entryTime)} />
              <div>
                <div className={LABEL}>Traveler Status</div>
                <StatusBadge status={traveler.status} dot />
              </div>
            </div>
            {traveler.notes && (
              <div className="px-6 pb-5">
                <div className={LABEL}>Traveler Notes</div>
                <p className="text-sm text-mutedLight bg-bg/60 rounded-xl px-4 py-3 border border-border/50">{traveler.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Notes timeline */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-display font-semibold text-white text-sm">Activity Timeline</h3>
          </div>
          <div className="p-6">
            {caseData.notes?.length > 0 ? (
              <div className="space-y-4">
                {[...caseData.notes].reverse().map((note, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-lg bg-accentDim/30 border border-accent/20 flex items-center justify-center text-xs font-display font-bold text-accentGlow shrink-0">
                        {note.author?.[0]?.toUpperCase() || '?'}
                      </div>
                      {i < caseData.notes.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xs font-medium text-white">{note.author || 'Unknown Officer'}</span>
                        <span className="text-[10px] font-mono text-muted">{fmtDate(note.createdAt)}</span>
                      </div>
                      <p className="text-sm text-mutedLight bg-bg/40 rounded-xl px-4 py-3 border border-border/40 whitespace-pre-wrap">
                        {note.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted text-center py-6">No notes yet.</div>
            )}
          </div>
        </div>

        {/* Update panel — canWrite only */}
        {canWrite && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
            <h3 className="font-display font-semibold text-white text-sm mb-4">Update Case</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-white text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="escalated">Escalated</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-white text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={LABEL}>Add Note</label>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  rows={3}
                  placeholder="Enter case notes, observations or actions taken…"
                  className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-white text-sm placeholder-muted/40 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                />
              </div>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="w-full py-2.5 rounded-xl bg-accent hover:bg-accentGlow disabled:opacity-50 text-white font-medium text-sm transition-all shadow-glow"
              >
                {saving
                  ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</span>
                  : 'Save Update'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}