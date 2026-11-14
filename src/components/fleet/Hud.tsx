import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SECTION_IDS } from '../../data/content'
import { useApp } from '../../lib/app-context'
import { useLang } from '../../lib/lang-context'
import LangToggle from '../LangToggle'

/** Top bar: brand, live telemetry (fleet view) or section nav (classic view), toggles. */
export default function Hud({ telemetry }: { telemetry?: ReactNode }) {
  const { t } = useLang()
  const { view, isDesktop, setView, navigate } = useApp()
  const next = view === 'fleet' ? 'classic' : 'fleet'

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg">
      <div className="mx-auto flex min-h-[52px] max-w-[1600px] items-center gap-3 px-4 lg:px-6">
        <a
          href="/"
          className="font-mono text-sm font-bold tracking-wider text-safety"
          aria-label="FLEET//OS — Rami Bouchnag"
        >
          FLEET//OS
        </a>

        <div className="min-w-0 flex-1">
          {telemetry ?? (
            <nav aria-label={t.map.jumpTo} className="hidden md:block">
              <ul className="flex flex-wrap gap-x-4 font-mono text-xs uppercase tracking-wider">
                {SECTION_IDS.map((id) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        navigate(id)
                      }}
                      className="inline-block py-2 text-muted hover:text-path"
                    >
                      {t.stations[id].label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        {isDesktop && (
          <button
            type="button"
            onClick={() => setView(next)}
            aria-label={next === 'fleet' ? t.hud.switchToFleet : t.hud.switchToClassic}
            className="flex min-h-[36px] items-center gap-2 border border-line px-2 font-mono text-xs tracking-wider hover:border-path"
          >
            <span
              className={`${view === 'fleet' ? 'hidden text-safety xl:inline' : 'text-muted'}`}
            >
              {t.hud.fleetView}
            </span>
            <span aria-hidden="true" className="text-muted">
              ⇄
            </span>
            <span
              className={`${view === 'classic' ? 'hidden text-safety xl:inline' : 'text-muted'}`}
            >
              {t.hud.classicView}
            </span>
          </button>
        )}
        <Link
          to="/cv"
          className="flex min-h-[36px] items-center border border-line px-3 font-mono text-xs tracking-wider text-text hover:border-path hover:text-path"
        >
          {t.hud.cv}
        </Link>
        <LangToggle />
      </div>
    </header>
  )
}
