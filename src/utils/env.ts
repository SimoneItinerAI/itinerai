export function isStaticMode(): boolean {
  try {
    const v = (import.meta as any)?.env?.VITE_STATIC_MODE
    return String(v) === 'true'
  } catch {
    const v = (process as any)?.env?.VITE_STATIC_MODE
    return String(v) === 'true'
  }
}
