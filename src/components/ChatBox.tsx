import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useApp } from '../lib/app-context'
import { useLang } from '../lib/lang-context'
import { ask, buildKnowledge, type Chunk } from '../lib/qa'

interface Message {
  id: number
  question: string
  answers: Chunk[]
}

/** Small chat window that answers questions from the site's own profile content. */
export default function ChatBox({ onClose }: { onClose: () => void }) {
  const { t } = useLang()
  const { navigate } = useApp()
  const c = t.chat
  const knowledge = useMemo(() => buildKnowledge(t), [t])
  const [messages, setMessages] = useState<Message[]>([])
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(1)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  const send = (raw: string) => {
    const question = raw.trim()
    if (!question) return
    const answers = ask(knowledge, question)
    setMessages((prev) => [...prev, { id: nextId.current++, question, answers }].slice(-20))
    setValue('')
    inputRef.current?.focus()
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    send(value)
  }

  const openSection = (chunk: Chunk) => {
    onClose()
    window.setTimeout(() => navigate(chunk.section), 0)
  }

  return (
    <section
      role="dialog"
      aria-label={c.title}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          onClose()
        }
      }}
      className="brackets fixed bottom-3 right-3 z-30 flex max-h-[min(34rem,calc(100vh-5rem))] w-[min(24rem,calc(100vw-1.5rem))] flex-col border border-line bg-panel shadow-2xl"
    >
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-2">
        <p className="label flex items-center gap-2 text-safety">
          <span className="led" aria-hidden="true" />
          {c.title}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label={c.close}
          className="label min-h-[32px] px-1 hover:text-path"
        >
          ESC ✕
        </button>
      </header>

      <div
        ref={logRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-3 text-sm"
        aria-live="polite"
      >
        <p className="text-muted">{c.intro}</p>

        {messages.length === 0 && (
          <ul className="flex flex-col items-start gap-1.5">
            {c.suggestions.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => send(s)}
                  className="border border-line bg-bg px-2 py-1.5 text-left font-mono text-xs text-text hover:border-path hover:text-path"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}

        {messages.map((m) => (
          <div key={m.id} className="space-y-2">
            <p className="font-mono text-xs text-path">
              <span className="sr-only">{c.you}: </span>
              <span aria-hidden="true">{'> '}</span>
              {m.question}
            </p>
            {m.answers.length === 0 ? (
              <p className="border-l-2 border-warn pl-3 text-muted">{c.noAnswer}</p>
            ) : (
              m.answers.map((chunk, i) => (
                <div key={chunk.id} className="border-l-2 border-safety pl-3">
                  {i > 0 && <p className="label mb-1">{c.alsoRelevant}</p>}
                  <p className="font-bold">{chunk.title}</p>
                  {chunk.lines.length === 1 ? (
                    <p className="mt-1">{chunk.lines[0]}</p>
                  ) : (
                    <ul className="mt-1 space-y-1">
                      {chunk.lines.map((line, j) => (
                        <li key={j} className="flex gap-2">
                          <span aria-hidden="true" className="mt-[0.7em] h-px w-2 flex-none bg-muted" />
                          <span className="min-w-0 break-words">{line}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    type="button"
                    onClick={() => openSection(chunk)}
                    className="link mt-1.5 font-mono text-xs"
                  >
                    {c.goTo}: {t.stations[chunk.section].label} →
                  </button>
                </div>
              ))
            )}
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-line px-3 py-2">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={c.placeholder}
          aria-label={c.placeholder}
          autoComplete="off"
          maxLength={200}
          className="min-h-[40px] w-full min-w-0 border border-line bg-bg px-2 text-base text-text placeholder:text-muted sm:text-sm"
        />
        <button type="submit" className="btn btn-primary" disabled={!value.trim()}>
          {c.send}
        </button>
      </form>
      <p className="px-4 pb-2 text-[11px] leading-snug text-muted">{c.disclaimer}</p>
    </section>
  )
}
