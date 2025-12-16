import '@testing-library/jest-dom'

if (!('matchMedia' in window)) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false
    })
  })
}

try {
  const { TextEncoder, TextDecoder } = require('util')
  ;(globalThis as any).TextEncoder = TextEncoder
  ;(globalThis as any).TextDecoder = TextDecoder
} catch {}
