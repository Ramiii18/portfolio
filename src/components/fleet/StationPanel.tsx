import { useEffect, useRef, type KeyboardEvent } from 'react'
import { m } from 'framer-motion'
import type { SectionId } from '../../data/content'
import { stationById } from '../../lib/grid'
import { useLang } from '../../lib/lang-context'
import SectionBody from '../SectionBody'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

/** "Mission report" panel that slides in from the right when AMR-01 reaches a station. */
export default function StationPanel({
  section,
  scrollToPlayground,
  onClose,
}: {
  section: SectionId
  scrollToPlayground: boolean
  onClose: () => void
}) {
  const { t } = useLang()
  const ref = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const station = stationById(section)
  const copy = t.stations[section]

  useEffect(() => {
    closeRef.current?.focus()
    if (scrollToPlayground) {
      // the playground chunk is lazy: wait a moment for it to mount
      const id = window.setTimeout(() => {
        document.getElementById('playground')?.scrollIntoView({ block: 'start' })
      }, 350)
      return () => window.clearTimeout(id)
    }
  }, [scrollToPlayground])

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onClose()
      return
    }
    if (e.key !== 'Tab' || !ref.current) return
    const items = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null,
    )
    if (items.length === 0) return
    const first = items[0]
    const last = items[items.length - 1]
    const current = document.activeElement
    if (e.shiftKey && (current === first || !ref.current.contains(current))) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && (current === last || !ref.current.contains(current))) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <>
      <m.div
        className="fixed inset-0 z-40 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <m.aside
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
        onKeyDown={onKeyDown}
        className="scan fixed right-0 top-0 z-50 flex h-full w-[min(680px,100vw)] flex-col border-l border-line bg-bg shadow-2xl"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line bg-panel px-6 py-4">
          <div>
            <p className="label flex items-center gap-2">
              <span className="led" aria-hidden="true" />
              {t.panel.report} · {station.code} · {copy.name}
            </p>
            <h2 id="panel-title" className="font-wide mt-1 text-2xl font-bold uppercase">
              {copy.label}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t.panel.close}
            className="btn min-w-[40px] px-2"
          >
            <span aria-hidden="true">ESC ✕</span>
          </button>
        </header>
        <div className="hazard" aria-hidden="true" />
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <SectionBody section={section} compact />
        </div>
      </m.aside>
    </>
  )
}
