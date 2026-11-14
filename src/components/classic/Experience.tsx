import { useLang } from '../../lib/lang-context'
import RichText from '../RichText'

export function ExperienceBody() {
  const { t } = useLang()
  return (
    <ol className="space-y-8 border-l border-line pl-5 sm:pl-7">
      {t.experience.jobs.map((job, i) => (
        <li key={`${job.company}-${job.period}`} className="relative">
          <span
            aria-hidden="true"
            className={`absolute -left-[25px] top-2 h-2.5 w-2.5 sm:-left-[33px] ${
              i === 0 ? 'bg-safety' : 'border border-muted bg-bg'
            }`}
          />
          <p className="font-mono text-xs tracking-wider text-muted">
            <span className="text-path">{job.period}</span> · {job.location}
          </p>
          <h3 className="mt-1 text-lg font-bold leading-snug">
            {job.role} <span className="text-muted">·</span>{' '}
            <span className="text-safety">{job.company}</span>
          </h3>
          <ul className="mt-3 space-y-2 text-[0.95rem]">
            {job.bullets.map((b, j) => (
              <li key={j} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.7em] h-px w-3 flex-none bg-muted" />
                <span>
                  <RichText text={b} />
                </span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}
