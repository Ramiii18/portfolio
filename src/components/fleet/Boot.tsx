import { useEffect, useRef, useState } from 'react'
import { m } from 'framer-motion'
import { useLang } from '../../lib/lang-context'

const TOTAL_MS = 1500

/** Fake FMS boot log, shown once per session. Skip button or Esc ends it at once. */
export default function Boot({ onDone }: { onDone: () => void }) {
  const { t } = useLang()
  const lines = t.boot.lines
  const [shown, setShown] = useState(1)
  const skipRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    skipRef.current?.focus()
    const step = (TOTAL_MS - 250) / lines.length
    const interval = window.setInterval(() => setShown((n) => Math.min(lines.length, n + 1)), step)
    const end = window.setTimeout(onDone, TOTAL_MS)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDone()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearInterval(interval)
      window.clearTimeout(end)
      window.removeEventListener('keydown', onKey)
    }
  }, [lines.length, onDone])

  return (
    <m.div
      className="fixed inset-0 z-[70] flex flex-col justify-center bg-bg px-6"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <div className="mx-auto w-full max-w-xl font-mono text-sm leading-7">
        <div aria-hidden="true" className="min-h-[12rem]">
          {lines.slice(0, shown).map((line, i) => (
            <p key={i} className={i === 0 ? 'font-bold text-safety' : 'text-text'}>
              <span className="text-muted">{'> '}</span>
              {line}
            </p>
          ))}
          <p className="text-path">
            <span className="cursor-blink">_</span>
          </p>
        </div>
        <p className="sr-only" role="status">
          {lines[0]}
        </p>
        <button ref={skipRef} type="button" className="btn mt-4" onClick={onDone}>
          {t.boot.skip} <span className="text-muted">[Esc]</span>
        </button>
      </div>
    </m.div>
  )
}
