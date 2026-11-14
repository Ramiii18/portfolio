import { Link } from 'react-router-dom'
import { useApp } from '../../lib/app-context'
import { usePrefersReducedMotion } from '../../lib/hooks'
import { useLang } from '../../lib/lang-context'

const ROUTE = 'M 20 96 H 120 Q 140 96 140 76 V 44 Q 140 24 160 24 H 300'

/** Decorative: a small AMR following a planned route. */
function HeroRoute() {
  const reduced = usePrefersReducedMotion()
  return (
    <svg
      viewBox="0 0 320 120"
      className="h-auto w-full max-w-[420px]"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id="hero-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 H 0 V 20" fill="none" stroke="var(--grid)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="320" height="120" fill="url(#hero-grid)" />
      <rect x="40" y="20" width="80" height="24" fill="var(--panel)" stroke="var(--line)" />
      <rect x="170" y="56" width="110" height="24" fill="var(--panel)" stroke="var(--line)" />
      <path d={ROUTE} fill="none" stroke="var(--path)" strokeWidth="2" strokeDasharray="6 6" />
      <rect
        x="292"
        y="16"
        width="16"
        height="16"
        fill="none"
        stroke="var(--safety)"
        strokeWidth="2"
      />
      <g>
        {!reduced && (
          <animateMotion dur="6s" repeatCount="indefinite" rotate="auto" path={ROUTE} />
        )}
        <g transform={reduced ? 'translate(20 96)' : undefined}>
          <rect
            x="-11"
            y="-8"
            width="22"
            height="16"
            rx="4"
            fill="var(--panel)"
            stroke="var(--safety)"
            strokeWidth="2"
          />
          <path d="M 2 -4 L 8 0 L 2 4 Z" fill="var(--safety)" />
        </g>
      </g>
    </svg>
  )
}

export default function Hero() {
  const { t } = useLang()
  const { navigate } = useApp()

  return (
    <section aria-labelledby="hero-title" className="pb-10 pt-10 md:pt-16">
      <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="label mb-4 flex items-center gap-2">
            <span className="led" aria-hidden="true" />
            {t.hero.kicker}
          </p>
          <h1
            id="hero-title"
            className="font-wide text-[2.6rem] font-extrabold uppercase leading-[0.95] sm:text-6xl lg:text-7xl"
          >
            {t.meta.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text sm:text-xl">{t.meta.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('projects', { playground: true })}
            >
              {t.hero.ctaPlayground}
            </button>
            <Link to="/cv" className="btn">
              {t.hero.ctaCv}
            </Link>
            <button type="button" className="btn" onClick={() => navigate('contact')}>
              {t.hero.ctaContact}
            </button>
          </div>
        </div>
        <HeroRoute />
      </div>

      <dl className="brackets mt-10 grid grid-cols-2 border border-line bg-panel md:grid-cols-4">
        {t.hero.stats.map((stat, i) => (
          <div
            key={stat.value}
            className={`flex flex-col-reverse p-4 sm:p-5 ${i % 2 === 1 ? 'border-l border-line' : ''} ${
              i >= 2 ? 'border-t border-line md:border-t-0' : ''
            } ${i === 2 ? 'md:border-l' : ''}`}
          >
            <dt className="label mt-1">{stat.label}</dt>
            <dd className="font-wide text-xl font-bold text-safety sm:text-2xl">{stat.value}</dd>
          </div>
        ))}
      </dl>
      <div className="hazard mt-10" aria-hidden="true" />
    </section>
  )
}
