import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { login }               = useAuth()
  const navigate                = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      if (data.success) {
        login(data.token, data.user)
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fill = (e, p) => { setEmail(e); setPassword(p) }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-accentDim/10 rounded-full blur-[80px]" />
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent shadow-glow mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-7 h-7">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="font-display font-bold text-2xl text-white">BorderSync</h1>
          <p className="text-sm text-muted mt-1">Digital Border Management System</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
          <h2 className="font-display font-semibold text-lg text-white mb-1">Officer Sign In</h2>
          <p className="text-xs text-muted mb-6">Authorized personnel only</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="officer@bordersync.io"
                required
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-white text-sm placeholder-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-white text-sm placeholder-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl bg-accent hover:bg-accentGlow disabled:opacity-50 disabled:cursor-not-allowed text-white font-display font-semibold text-sm transition-all shadow-glow"
            >
              {loading
                ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Authenticating…</span>
                : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-[10px] font-mono text-muted uppercase tracking-widest mb-3">Demo Credentials</p>
            <div className="space-y-1.5">
              {[
                { label: 'Admin',          e: 'admin@bordersync.io',   p: 'admin123'   },
                { label: 'Border Officer', e: 'officer@bordersync.io', p: 'officer123' },
                { label: 'NGO Coord',      e: 'ngo@bordersync.io',     p: 'ngo123'     },
              ].map(({ label, e, p }) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => fill(e, p)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-bg/60 hover:bg-surface border border-border/50 hover:border-accent/30 transition-all group"
                >
                  <span className="text-xs text-mutedLight group-hover:text-white transition-colors">{label}</span>
                  <span className="text-[10px] font-mono text-muted">{e}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}