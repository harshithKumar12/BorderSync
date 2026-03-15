import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { toast } from '../components/Toast'
import api from '../api/axios'

const INPUT = 'w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-white text-sm placeholder-muted/40 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all'
const LABEL = 'block text-[10px] font-mono text-muted uppercase tracking-widest mb-1.5'

export default function NewEntry() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [docPreview, setDocPreview] = useState(null)
  const [docData, setDocData]   = useState(null)
  const [form, setForm] = useState({
    name: '', nationality: '', documentType: 'passport',
    documentNumber: '', dateOfBirth: '', notes: '',
  })

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleFile = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    toast.error('File must be under 5MB')
    return
  }

  // preview image
  const reader = new FileReader()
  reader.onload = (ev) => {
    setDocPreview(ev.target.result)
  }
  reader.readAsDataURL(file)

  try {
    toast.info('Scanning document...')

    const formData = new FormData()
    formData.append('document', file)

    const res = await api.post('/ocr/scan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    const data = res.data

    if (data.success) {
      const extracted = data.extracted

      setForm((f) => ({
        ...f,
        name: extracted.name || f.name,
        nationality: extracted.nationality || f.nationality,
        documentType: extracted.documentType || f.documentType,
        documentNumber: extracted.docNumber || f.documentNumber,
        dateOfBirth: extracted.dateOfBirth || f.dateOfBirth,
      }))

      toast.success('Document scanned successfully')
    }

  } catch (err) {
    toast.error('OCR scan failed')
    console.error(err)
  }

  // keep document data for database
  setDocData({
    fileName: file.name,
    fileType: file.type,
    uploadedAt: new Date().toISOString(),
  })
}

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, scannedDocumentData: docData || undefined }
      await api.post('/travelers', payload)
      toast.success('Traveler entry created successfully')
      navigate('/travelers')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create entry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout
      title="New Entry"
      actions={
        <button onClick={() => navigate('/travelers')} className="text-sm text-muted hover:text-white transition-colors">
          ← Back
        </button>
      }
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
          <div className="px-6 py-5 border-b border-border">
            <h2 className="font-display font-semibold text-white">Traveler Registration</h2>
            <p className="text-xs text-muted mt-0.5">Register a new traveler at the border checkpoint</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Full Name *</label>
                <input className={INPUT} value={form.name} onChange={set('name')} placeholder="Maria Santos" required />
              </div>
              <div>
                <label className={LABEL}>Nationality *</label>
                <input className={INPUT} value={form.nationality} onChange={set('nationality')} placeholder="Brazilian" required />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Document Type *</label>
                <select className={INPUT} value={form.documentType} onChange={set('documentType')} required>
                  <option value="passport">Passport</option>
                  <option value="visa">Visa</option>
                  <option value="refugee_card">Refugee Card</option>
                </select>
              </div>
              <div>
                <label className={LABEL}>Document Number *</label>
                <input className={INPUT} value={form.documentNumber} onChange={set('documentNumber')} placeholder="AB-1234567" required />
              </div>
            </div>

            {/* Row 3 */}
            <div>
              <label className={LABEL}>Date of Birth *</label>
              <input type="date" className={INPUT} value={form.dateOfBirth} onChange={set('dateOfBirth')} required />
            </div>

            {/* Notes */}
            <div>
              <label className={LABEL}>Notes</label>
              <textarea
                className={`${INPUT} resize-none`}
                rows={3}
                value={form.notes}
                onChange={set('notes')}
                placeholder="Additional observations or flags…"
              />
            </div>

            {/* Document upload */}
            <div>
              <label className={LABEL}>Document Scan (optional)</label>
              <div className="relative">
                {docPreview ? (
                  <div className="relative rounded-xl border border-accent/30 overflow-hidden bg-bg">
                    <img src={docPreview} alt="Document preview" className="w-full max-h-48 object-contain" />
                    <button
                      type="button"
                      onClick={() => { setDocPreview(null); setDocData(null) }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 hover:bg-red-500/80 text-white text-xs flex items-center justify-center transition-colors"
                    >
                      ✕
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-black/60 backdrop-blur-sm">
                      <span className="text-xs font-mono text-white/70">{docData?.fileName}</span>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 h-28 rounded-xl border-2 border-dashed border-border hover:border-accent/50 bg-bg/40 cursor-pointer transition-all group">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-muted group-hover:text-accent transition-colors">
                      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-xs text-muted group-hover:text-mutedLight transition-colors">Click to upload passport / ID scan</span>
                    <span className="text-[10px] text-muted/50">PNG, JPG, WEBP — max 5MB</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
                  </label>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/travelers')}
                className="flex-1 py-2.5 rounded-xl border border-border text-muted hover:text-white hover:border-borderLight text-sm font-medium transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-accent hover:bg-accentGlow disabled:opacity-50 disabled:cursor-not-allowed text-white font-display font-semibold text-sm transition-all shadow-glow"
              >
                {loading
                  ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating…</span>
                  : 'Create Entry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}