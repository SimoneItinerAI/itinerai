import { ReactNode } from 'react'

export function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="bg-white rounded shadow p-4 w-full max-w-md">
        <button className="absolute top-2 right-2" onClick={onClose} aria-label="Chiudi">×</button>
        {children}
      </div>
    </div>
  )
}
