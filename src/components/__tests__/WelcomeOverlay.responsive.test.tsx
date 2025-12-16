import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WelcomeOverlay } from '../../components/WelcomeOverlay'

function setViewport(w: number, h: number) {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: w })
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: h })
  window.dispatchEvent(new Event('resize'))
}

describe('WelcomeOverlay responsive', () => {
  beforeEach(() => {
    localStorage.removeItem('welcomeSeen')
    jest.useFakeTimers()
    jest.spyOn(window, 'matchMedia').mockImplementation((q: string) => ({ matches: q.includes('reduce') ? false : false, media: q, onchange: null, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false }))
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  const sizes = [
    [320, 568],
    [375, 667],
    [414, 896],
    [768, 1024],
    [1024, 1366],
    [1366, 768],
    [1920, 1080]
  ]

  it('renders and hides after duration across viewports', () => {
    for (const [w, h] of sizes) {
      setViewport(w, h)
      const onDone = jest.fn()
      render(<WelcomeOverlay durationMs={1000} onDone={onDone} />)
      expect(screen.getByAltText('ItinerAI')).toBeInTheDocument()
      act(() => { jest.advanceTimersByTime(1600) })
      expect(onDone).toHaveBeenCalled()
    }
  })

  it('supports landscape', () => {
    setViewport(896, 414)
    render(<WelcomeOverlay durationMs={500} />)
    expect(screen.getByText(/Il tuo viaggio perfetto/)).toBeInTheDocument()
    act(() => { jest.advanceTimersByTime(1100) })
    expect(screen.queryByText(/Il tuo viaggio perfetto/)).not.toBeInTheDocument()
  })
})
