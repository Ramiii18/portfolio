import type { Lang } from '../data/content'
import { useLang } from '../lib/lang-context'

const LANGS: Lang[] = ['en', 'fr']

export default function LangToggle({ light = false }: { light?: boolean }) {
  const { lang, setLang, t } = useLang()
  const active = light ? 'bg-[#14181d] text-white' : 'bg-safety text-bg font-bold'
  const idle = light ? 'text-[#14181d]' : 'text-muted hover:text-text'
  return (
    <div
      role="group"
      aria-label={t.hud.language}
      className={`flex border font-mono text-xs ${light ? 'border-[#14181d]' : 'border-line'}`}
    >
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
          className={`min-h-[36px] min-w-[40px] px-2 uppercase ${lang === l ? active : idle}`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
