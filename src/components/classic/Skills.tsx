import { useLang } from '../../lib/lang-context'

export function SkillsBody({ compact = false }: { compact?: boolean }) {
  const { t } = useLang()
  return (
    <div className="space-y-6">
      <div className={`grid gap-4 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
        {t.skills.modules.map((m) => (
          <section key={m.code} className="border border-line bg-panel p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-muted">{m.code}</span>
              <span className="label flex items-center gap-1.5 text-text">
                <span className="led" aria-hidden="true" />
                {m.status}
              </span>
            </div>
            <h3 className="mt-2 text-base font-bold">{m.title}</h3>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {m.items.map((item) => (
                <li key={item} className="chip whitespace-normal">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="border border-line bg-panel p-4">
        <h3 className="label mb-3 text-text">{t.skills.languagesTitle}</h3>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {t.skills.languages.map((l) => (
            <div key={l.name}>
              <dt className="font-bold">{l.name}</dt>
              <dd className="font-mono text-xs text-muted">{l.level}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
