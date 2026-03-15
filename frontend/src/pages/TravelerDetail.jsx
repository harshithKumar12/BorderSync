import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import { toast } from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const fmtDate  = (d) => d ? new Date(d).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—'
const fmtDOB   = (d) => d ? new Date(d).toLocaleDateString('en-US', { dateStyle: 'long' }) : '—'
const LABEL = 'text-[10px] font-mono text-muted uppercase tracking-widest mb-1'
const VALUE = 'text-sm text-white font-medium'

function Field({ label, value }) {
  return (
    <div>
      <div className={LABEL}>{label}</div>
      <div className={VALUE}>{value || '—'}</div>
    </div>
  )
}

export default function TravelerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { canWrite, isAdmin } = useAuth()

  const [traveler, setTraveler] = useState(null)
  const [linkedCase, setLinkedCase] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [openingCase, setOpeningCase] = useState(false)
  const [deleting, setDeleting]   = useState(false)

  const [status, setStatus] = useState('')
  const [notes, setNotes]   = useState('')

  // Case creation form
  const [showCaseForm, setShowCaseForm] = useState(false)
  const [caseType, setCaseType]   = useState('regular')
  const [casePriority, setCasePriority] = useState('medium')

  useEffect(() => {
    api.get(`/travelers/${id}`)
      .then(r => {
        setTraveler(r.data.traveler)
        setLinkedCase(r.data.case)
        setStatus(r.data.traveler.status)
        setNotes(r.data.traveler.notes || '')
      })
      .catch(() => { toast.error('Traveler not found'); navigate('/travelers') })
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data } = await api.patch(`/travelers/${id}`, { status, notes })
      setTraveler(data.traveler)
      toast.success('Traveler updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const handleOpenCase = async () => {
    setOpeningCase(true)
    try {
      const { data } = await api.post('/cases', { travelerId: id, caseType, priority: casePriority })
      setLinkedCase(data)
      setShowCaseForm(false)
      toast.success('Case opened successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to open case')
    } finally {
      setOpeningCase(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Permanently delete this traveler and all related cases?')) return
    setDeleting(true)
    try {
      await api.delete(`/travelers/${id}`)
      toast.success('Traveler deleted')
      navigate('/travelers')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <Layout title="Traveler Detail">
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    )
  }

  if (!traveler) return null

  return (
    <Layout
      title="Traveler Detail"
      actions={
        <button onClick={() => navigate('/travelers')} className="text-sm text-muted hover:text-white transition-colors">← Back</button>
      }
    >
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Main info card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accentDim/40 flex items-center justify-center font-display font-bold text-lg text-accentGlow">
                {traveler.name[0].toUpperCase()}
              </div>
              <div>
                <h2 className="font-display font-bold text-white text-lg">{traveler.name}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted">{traveler.nationality}</span>
                  <span className="text-muted/30">·</span>
                  <StatusBadge status={traveler.status} dot />
                </div>
              </div>
            </div>
            <span className="font-mono text-xs text-muted bg-bg px-2.5 py-1 rounded-lg border border-border">
              {traveler._id?.slice(-8).toUpperCase()}
            </span>
          </div>

          <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-5">
            <Field label="Document Type"   value={traveler.documentType?.replace('_', ' ')} />
            <Field label="Document Number" value={traveler.documentNumber} />
            <Field label="Date of Birth"   value={fmtDOB(traveler.dateOfBirth)} />
            <Field label="Entry Time"      value={fmtDate(traveler.entryTime)} />
            <Field label="Exit Time"       value={fmtDate(traveler.exitTime)} />
            <Field label="Assigned Officer" value={traveler.assignedOfficerId?.name || 'Unassigned'} />
          </div>

          {traveler.notes && (
            <div className="px-6 pb-5">
              <div className={LABEL}>Notes</div>
              <p className="text-sm text-mutedLight bg-bg/60 rounded-xl px-4 py-3 border border-border/50 whitespace-pre-wrap">{traveler.notes}</p>
            </div>
          )}

          {/* Document preview */}
          {traveler.scannedDocumentData?.base64Data && (
            <div className="px-6 pb-5">
              <div className={LABEL}>Scanned Document</div>
              <img
                src={`data:${traveler.scannedDocumentData.fileType};base64,${traveler.scannedDocumentData.base64Data}`}
                alt="Document scan"
                className="max-h-48 rounded-xl border border-border object-contain bg-bg"
              />
            </div>
          )}
        </div>

        {/* Status / notes update — canWrite only */}
        {canWrite && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
            <h3 className="font-display font-semibold text-white text-sm mb-4">Update Record</h3>
            <div className="space-y-4">
              <div>
                <label className={LABEL}>Change Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-white text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="flagged">Flagged</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className={LABEL}>Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-white text-sm placeholder-muted/40 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                  placeholder="Add or edit notes…"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-accent hover:bg-accentGlow disabled:opacity-50 text-white font-medium text-sm transition-all shadow-glow"
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
                {isAdmin && (
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 text-sm font-medium transition-all disabled:opacity-50"
                  >
                    {deleting ? 'Deleting…' : 'Delete'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Linked case card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-white text-sm">Linked Case</h3>
            {!linkedCase && canWrite && (
              <button
                onClick={() => setShowCaseForm(!showCaseForm)}
                className="text-xs px-3 py-1.5 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 transition-all font-medium"
              >
                + Open Case
              </button>
            )}
          </div>

          {linkedCase ? (
            <div
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-bg/60 border border-border/50 cursor-pointer hover:border-accent/30 transition-all"
              onClick={() => navigate(`/cases/${linkedCase._id}`)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accentDim/30 flex items-center justify-center text-xs font-mono text-accentGlow">
                  #{linkedCase._id?.slice(-4).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-medium text-white capitalize">{linkedCase.caseType?.replace('_', ' ')} case</div>
                  <div className="text-xs text-muted">Opened {fmtDate(linkedCase.createdAt)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={linkedCase.priority} type="priority" size="xs" />
                <StatusBadge status={linkedCase.status} type="case" size="xs" />
              </div>
            </div>
          ) : showCaseForm ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Case Type</label>
                  <select value={caseType} onChange={e => setCaseType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-white text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all">
                    <option value="regular">Regular</option>
                    <option value="refugee">Refugee</option>
                    <option value="asylum">Asylum</option>
                    <option value="flagged">Flagged</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Priority</label>
                  <select value={casePriority} onChange={e => setCasePriority(e.target.value)}
                    className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-white text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleOpenCase} disabled={openingCase}
                  className="flex-1 py-2 rounded-xl bg-accent hover:bg-accentGlow text-white text-sm font-medium transition-all disabled:opacity-50">
                  {openingCase ? 'Opening…' : 'Open Case'}
                </button>
                <button onClick={() => setShowCaseForm(false)}
                  className="px-4 py-2 rounded-xl border border-border text-muted hover:text-white text-sm transition-all">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted text-center py-4">No case linked to this traveler.</div>
          )}
        </div>
      </div>
    </Layout>
  )
}