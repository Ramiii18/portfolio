import { useLang } from '../../lib/lang-context'

export function EducationBody({ compact = false }: { compact?: boolean }) {
  const { t } = useLang()
  const e = t.education
  return (
    <div className="space-y-6">
      <ol className="space-y-3">
        {e.schools.map((s, i) => (
          <li
            key={s.school}
            className={`border bg-panel p-4 ${i === 0 ? 'brackets border-safety' : 'border-line'}`}
          >
            <p className="font-mono text-xs tracking-wider text-muted">
              <span className="text-path">{s.period}</span> · {s.location}
            </p>
            <h3 className="mt-1 text-base font-bold">{s.school}</h3>
            <p className="text-[0.95rem] text-muted">{s.degree}</p>
          </li>
        ))}
      </ol>

      <div className={`grid gap-4 ${compact ? '' : 'md:grid-cols-2'}`}>
        <section className="border border-line bg-panel p-4">
          <h3 className="label mb-3 text-text">{e.certificationsTitle}</h3>
          <ul className="space-y-2 text-[0.95rem]">
            {e.certifications.map((c) => (
              <li key={c.name} className="flex flex-wrap justify-between gap-x-3">
                <span>{c.name}</span>
                <span className="font-mono text-xs text-muted">{c.issuer}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="border border-line bg-panel p-4">
          <h3 className="label mb-3 text-text">{e.activitiesTitle}</h3>
          <ul className="space-y-2 text-[0.95rem]">
            {e.activities.map((a) => (
              <li key={a.name}>
                <span>{a.name}</span>
                <span className="block font-mono text-xs text-muted">
                  {a.role} · {a.period}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section>
        <h3 className="label mb-3 text-text">{e.courseworkTitle}</h3>
        <ul className="flex flex-wrap gap-1.5">
          {e.coursework.map((c) => (
            <li key={c} className="chip">
              {c}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
