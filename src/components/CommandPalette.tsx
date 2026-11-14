import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { SECTION_IDS, type SectionId } from '../data/content'
import { useApp } from '../lib/app-context'
import { useLang } from '../lib/lang-context'

const COMMANDS = [
  ...SECTION_IDS.map((id) => `goto ${id}`),
  'optimize',
  'cv',
  'view classic',
  'view fleet',
  'lang en',
  'lang fr',
  'help',
]

/** Terminal-style command palette (Ctrl/Cmd + K). */
export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const { t, setLang } = useLang()
  const { navigate, setView, isDesktop } = useApp()
  const routerNavigate = useNavigate()
  const [value, setValue] = useState('')
  const [log, setLog] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<Element | null>(null)

  useEffect(() => {
    restoreRef.current = document.activeElement
    inputRef.current?.focus()
    return () => {
      const el = restoreRef.current
      if (el instanceof HTMLElement && document.contains(el)) el.focus()
    }
  }, [])

  const query = value.trim().toLowerCase()
  const suggestions = COMMANDS.filter((c) => c.startsWith(query)).slice(0, 8)

  const print = (cmd: string, lines: string[]) =>
    setLog((prev) => [...prev, `> ${cmd}`, ...lines].slice(-10))

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase().replace(/\s+/g, ' ')
    if (!cmd) return
    const [name, arg] = cmd.split(' ')
    setValue('')

    if (name === 'goto' && SECTION_IDS.includes(arg as SectionId)) {
      onClose()
      // let the palette close (and focus return) before driving the robot
      window.setTimeout(() => navigate(arg as SectionId), 0)
    } else if (name === 'optimize') {
      onClose()
      window.setTimeout(() => navigate('projects', { playground: true }), 0)
    } else if (name === 'cv') {
      onClose()
      routerNavigate('/cv')
    } else if (name === 'lang' && (arg === 'en' || arg === 'fr')) {
      setLang(arg)
      print(cmd, [`${t.palette.done} — lang = ${arg}`])
    } else if (name === 'view' && arg === 'classic') {
      setView('classic')
      onClose()
    } else if (name === 'view' && arg === 'fleet') {
      if (isDesktop) {
        setView('fleet')
        onClose()
      } else {
        print(cmd, [t.palette.needDesktop])
      }
    } else if (name === 'help') {
      print(cmd, t.palette.help)
    } else {
      print(cmd, [t.palette.unknown])
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    run(value)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onClose()
      return
    }
    if (e.key !== 'Tab' || !boxRef.current) return
    // Tab on the input completes the first suggestion
    if (
      !e.shiftKey &&
      document.activeElement === inputRef.current &&
      query &&
      suggestions.length > 0 &&
      suggestions[0] !== query
    ) {
      e.preventDefault()
      setValue(suggestions[0])
      return
    }
    const items = Array.from(boxRef.current.querySelectorAll<HTMLElement>('input, button'))
    if (items.length === 0) return
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]">
      <m.div
        className="absolute inset-0 bg-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <m.div
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.palette.title}
        onKeyDown={onKeyDown}
        className="brackets relative w-full max-w-xl border border-line bg-panel font-mono text-sm shadow-2xl"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-2">
          <span className="label text-safety">FLEET//OS · {t.palette.title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.palette.close}
            className="label min-h-[32px] px-1 hover:text-path"
          >
            ESC
          </button>
        </div>

        {log.length > 0 && (
          <div className="border-b border-line px-4 py-2 text-xs leading-6" aria-live="polite">
            {log.map((line, i) => (
              <p key={i} className={line.startsWith('> ') ? 'text-path' : 'text-muted'}>
                {line}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex items-center gap-2 px-4 py-3">
          <span aria-hidden="true" className="text-safety">
            {'>'}
          </span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t.palette.placeholder}
            aria-label={t.palette.placeholder}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="min-h-[36px] w-full bg-transparent text-text placeholder:text-muted focus:outline-none"
          />
        </form>

        <ul className="max-h-[40vh] overflow-y-auto border-t border-line py-1">
          {suggestions.map((c) => (
            <li key={c}>
              <button
                type="button"
                onClick={() => run(c)}
                className="block w-full px-4 py-1.5 text-left text-muted hover:bg-bg hover:text-path focus-visible:bg-bg focus-visible:text-path"
              >
                {c}
              </button>
            </li>
          ))}
          {suggestions.length === 0 && (
            <li className="px-4 py-1.5 text-muted">{t.palette.unknown}</li>
          )}
        </ul>
      </m.div>
    </div>
  )
}
