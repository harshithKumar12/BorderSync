import { useState, useEffect, useCallback } from 'react'

let _addToast = null

export const toast = {
  success: (msg) => _addToast?.({ type: 'success', msg }),
  error:   (msg) => _addToast?.({ type: 'error',   msg }),
  info:    (msg) => _addToast?.({ type: 'info',     msg }),
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([])

  const add = useCallback(({ type, msg }) => {
    const id = Date.now() + Math.random()
    setToasts(p => [...p, { id, type, msg }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000)
  }, [])

  useEffect(() => {
    _addToast = add
    return () => { _addToast = null }
  }, [add])

  const cfg = {
    success: { icon: '✓', bar: 'bg-emerald-400', text: 'text-emerald-300', bg: 'bg-emerald-400/10 border-emerald-400/20' },
    error:   { icon: '✕', bar: 'bg-red-400',     text: 'text-red-300',     bg: 'bg-red-400/10 border-red-400/20'         },
    info:    { icon: 'i', bar: 'bg-blue-400',     text: 'text-blue-300',    bg: 'bg-blue-400/10 border-blue-400/20'       },
  }

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(({ id, type, msg }) => {
        const c = cfg[type]
        return (
          <div
            key={id}
            className={`animate-fade-up flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl min-w-[280px] max-w-sm ${c.bg}`}
          >
            <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 border-current ${c.text}`}>
              {c.icon}
            </span>
            <span className="text-sm text-white/90 font-body">{msg}</span>
          </div>
        )
      })}
    </div>
  )
}