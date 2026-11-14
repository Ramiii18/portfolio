import { useEffect, useRef, useState } from 'react'
import { useLang } from '../../lib/lang-context'

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const el = document.createElement('textarea')
      el.value = text
      el.setAttribute('readonly', '')
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(el)
      return ok
    } catch {
      return false
    }
  }
}

export function ContactBody() {
  const { t } = useLang()
  const c = t.contact
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>()

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const onCopy = async () => {
    if (await copyText(c.email)) {
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="max-w-2xl space-y-5">
      <p className="text-[1.05rem]">{c.intro}</p>

      <div className="brackets border border-line bg-panel p-5">
        <p className="label mb-2">E-mail</p>
        <div className="flex flex-wrap items-center gap-3">
          <a href={`mailto:${c.email}`} className="link break-all font-mono text-base sm:text-lg">
            {c.email}
          </a>
          <button type="button" className="btn" onClick={onCopy}>
            {copied ? c.copied : c.copy}
          </button>
          <span className="sr-only" role="status">
            {copied ? c.copied : ''}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={`mailto:${c.email}`} className="btn btn-primary">
            {c.emailCta}
          </a>
          <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn">
            LinkedIn
          </a>
        </div>
      </div>

      <p className="label flex items-center gap-2">
        <span className="led" aria-hidden="true" />
        {c.locationLine}
      </p>
    </div>
  )
}
