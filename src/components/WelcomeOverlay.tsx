import { useEffect, useRef, useState } from 'react'

export function WelcomeOverlay({ durationMs = 4000, onDone }: { durationMs?: number; onDone?: () => void }) {
  const [visible, setVisible] = useState(true)
  const [fadeIn, setFadeIn] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(durationMs / 1000))
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    setFadeIn(true)
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    const timeout = window.setTimeout(() => {
      setFadeOut(true)
      window.setTimeout(() => {
        setVisible(false)
        localStorage.setItem('welcomeSeen', String(Date.now()))
        if (intervalRef.current) window.clearInterval(intervalRef.current)
        onDone?.()
      }, 500)
    }, durationMs)
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      window.clearTimeout(timeout)
    }
  }, [durationMs, onDone])

  if (!visible) return null

  return (
    <div className={`fixed inset-0 z-[1000] flex items-center justify-center bg-white ${fadeIn ? 'opacity-100' : 'opacity-0'} ${fadeOut ? 'transition-opacity duration-500 opacity-0' : 'transition-opacity duration-700'} px-6`}>
      <div className="max-w-xl w-full text-center">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo.png" alt="ItinerAI" className="w-16 h-16 md:w-20 md:h-20" />
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Il tuo viaggio perfetto in pochi minuti</h1>
          <p className="text-neutral-600">Itinerari personalizzati con AI: voli, alloggi ed esperienze su misura.</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="animate-spin h-5 w-5 border-2 border-neutral-300 border-t-transparent rounded-full" aria-label="Loading" />
            <span className="text-sm text-neutral-500">Avvio… {secondsLeft}s</span>
          </div>
        </div>
      </div>
    </div>
  )
}

