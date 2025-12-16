import { useEffect, useRef, useState } from 'react'

export function WelcomeOverlay({ durationMs = 4000, onDone }: { durationMs?: number; onDone?: () => void }) {
  const [visible, setVisible] = useState(true)
  const [fadeIn, setFadeIn] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [dark, setDark] = useState(false)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(Boolean(mq.matches))
    const dmq = window.matchMedia('(prefers-color-scheme: dark)')
    setDark(Boolean(dmq.matches))
    setFadeIn(true)
    const start = performance.now()
    if (!reduceMotion) {
      intervalRef.current = window.setInterval(() => {
        const elapsed = performance.now() - start
        const pct = Math.min(100, (elapsed / durationMs) * 100)
        setProgress(pct)
      }, 100)
    } else {
      setProgress(100)
    }
    const timeout = window.setTimeout(() => {
      setFadeOut(true)
      window.setTimeout(() => {
        setVisible(false)
        localStorage.setItem('welcomeSeen', String(Date.now()))
        onDone?.()
      }, reduceMotion ? 0 : 900)
    }, durationMs)
    return () => {
      window.clearTimeout(timeout)
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [durationMs, onDone])

  if (!visible) return null

  return (
    <div
      className={`${fadeIn ? 'opacity-100' : 'opacity-0'} ${reduceMotion ? '' : 'transition-opacity'} fixed inset-0 z-[1000] ${fadeOut ? 'opacity-0' : ''}`}
      style={{
        backgroundColor: '#ffffff',
        transition: reduceMotion ? 'none' : `opacity ${fadeOut ? '900ms' : '400ms'} ease-in-out`
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          paddingLeft: 'max(env(safe-area-inset-left), 0px)',
          paddingRight: 'max(env(safe-area-inset-right), 0px)',
          paddingTop: 'max(env(safe-area-inset-top), 0px)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 0px)'
        }}
      >
        <div style={{ position: 'absolute', inset: 0 }}>
          <div
            className={`${reduceMotion ? '' : 'transition-opacity duration-700'} ${reduceMotion ? '' : 'animate-pulse'}`}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(12px, 3vh, 20px)',
              padding: '24px'
            }}
          >
            <img
              src="/logo.png"
              alt="Logo ItinerAI"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              onLoad={() => setImgLoaded(true)}
              style={{
                width: 'clamp(96px, 22vw, 220px)',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 2px 8px rgba(15,59,99,0.16)) saturate(1.06) brightness(1.03)'
              }}
            />
            <div
              style={{
                fontSize: 'clamp(22px, 5vw, 40px)',
                fontWeight: 700,
                letterSpacing: '0.02em',
                color: '#0F3B63'
              }}
            >Itiner<span style={{ color: '#F5821E' }}>AI</span></div>
            <div
              style={{
                fontSize: 'clamp(14px, 2.6vw, 18px)',
                color: '#000000',
                textAlign: 'center',
                maxWidth: 'min(92vw, 640px)',
                textShadow: '0 1px 0 rgba(0,0,0,0.04)'
              }}
            >
              Benvenuto! Stiamo preparando i contenuti e le migliori proposte di viaggio per te.
            </div>
            <div
              style={{
                width: 'min(74vw, 520px)',
                height: '10px',
                borderRadius: '9999px',
                background: '#e5e7eb',
                border: '2px solid #0F3B63',
                overflow: 'hidden',
                boxShadow: '0 1px 6px rgba(0,0,0,0.08)'
              }}
              aria-label="Preparazione contenuti"
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #0F3B63 0%, #0F5A9A 50%, #F5821E 100%)',
                  transition: reduceMotion ? 'none' : 'width 150ms ease-out',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.6)'
                }}
              />
            </div>
          </div>
          {!imgLoaded && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div
                className={`${reduceMotion ? '' : 'animate-spin'}`}
                style={{
                  width: 'clamp(24px, 3vw, 36px)',
                  height: 'clamp(24px, 3vw, 36px)',
                  borderRadius: '9999px',
                  border: `2px solid ${dark ? '#0F3B63' : '#0F3B63'}`,
                  borderTopColor: '#F5821E'
                }}
                aria-label="Loading"
              />
            </div>
          )}
          
        </div>
      </div>
    </div>
  )
}
