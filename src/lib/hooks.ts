import { useEffect, useState } from 'react'

function matches(query: string): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(query).matches
    : false
}

export function useMediaQuery(query: string): boolean {
  const [value, setValue] = useState(() => matches(query))
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setValue(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return value
}

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
export const DESKTOP = '(min-width: 1024px)'

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery(REDUCED_MOTION)
}

export function prefersReducedMotionNow(): boolean {
  return matches(REDUCED_MOTION)
}
