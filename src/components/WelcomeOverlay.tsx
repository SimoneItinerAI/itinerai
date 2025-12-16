import { useEffect, useRef, useState } from 'react'

export function WelcomeOverlay({ durationMs = 4000, onDone }: { durationMs?: number; onDone?: () => void }) {
  const [visible, setVisible] = useState(true)
  const [fadeIn, setFadeIn] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(durationMs / 1000))
  const intervalRef = useRef<number | null>(null)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(Boolean(mq.matches))
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
      }, reduceMotion ? 0 : 500)
    }, durationMs)
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      window.clearTimeout(timeout)
    }
  }, [durationMs, onDone])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[1000] flex items-center justify-center bg-white ${fadeIn ? 'opacity-100' : 'opacity-0'} ${fadeOut ? (reduceMotion ? '' : 'transition-opacity duration-500 opacity-0') : (reduceMotion ? '' : 'transition-opacity duration-700')}`}
      style={{
        paddingLeft: 'max(env(safe-area-inset-left), 16px)',
        paddingRight: 'max(env(safe-area-inset-right), 16px)',
        paddingTop: 'max(env(safe-area-inset-top), 16px)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 16px)'
      }}
    >
      <div className="w-full text-center" style={{ maxWidth: 'min(92vw, 720px)' }}>
        <div className="flex flex-col items-center gap-4">
          <img
            src="/logo.png"
            alt="ItinerAI"
            loading="eager"
            decoding="async"
            style={{ width: 'clamp(56px, 10vw, 88px)', height: 'clamp(56px, 10vw, 88px)' }}
          />
          <h1
            className="font-bold text-primary"
            style={{ fontSize: 'clamp(20px, 3.2vw, 32px)', lineHeight: 1.2, paddingInline: '4px', wordBreak: 'break-word' }}
          >
            Il tuo viaggio perfetto in pochi minuti
          </h1>
          <p
            className="text-neutral-600"
            style={{ fontSize: 'clamp(14px, 2vw, 18px)', lineHeight: 1.5, paddingInline: '4px' }}
          >
            Itinerari personalizzati con AI: voli, alloggi ed esperienze su misura.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <div
              className={`border-2 border-neutral-300 border-t-transparent rounded-full ${reduceMotion ? '' : 'animate-spin'}`}
              aria-label="Loading"
              style={{ width: 'clamp(16px, 2vw, 20px)', height: 'clamp(16px, 2vw, 20px)' }}
            />
            <span className="text-neutral-500" style={{ fontSize: 'clamp(12px, 1.8vw, 14px)' }}>
              Avvio… {secondsLeft}s
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
