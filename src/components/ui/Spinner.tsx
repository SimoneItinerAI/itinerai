export function Spinner({ className = '' }: { className?: string }) {
  return <div className={`animate-spin h-5 w-5 border-2 border-neutral-300 border-t-transparent rounded-full ${className}`} aria-label="Loading" />
}
