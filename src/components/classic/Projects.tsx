import { lazy, Suspense } from 'react'
import type { Project } from '../../data/content'
import { useLang } from '../../lib/lang-context'

const OptimizerPlayground = lazy(() => import('../playground/OptimizerPlayground'))

function ProjectCard({ project }: { project: Project }) {
  const { t } = useLang()
  const rows: Array<[string, string]> = [
    [t.projects.problem, project.problem],
    [t.projects.approach, project.approach],
    [t.projects.result, project.result],
  ]
  return (
    <article
      className={`flex h-full flex-col border bg-panel p-5 ${
        project.featured ? 'brackets border-safety' : 'border-line'
      }`}
    >
      {(project.featured || project.context) && (
        <p className="label mb-2">
          {project.featured && <span className="text-safety">{t.projects.featuredLabel}</span>}
          {project.featured && project.context && ' · '}
          {project.context}
        </p>
      )}
      <h3 className="text-lg font-bold leading-snug">{project.title}</h3>
      <p className="mt-1 text-[0.95rem] text-muted">{project.pitch}</p>
      <dl className="mt-4 space-y-2 text-sm">
        {rows.map(([label, text]) => (
          <div key={label} className="grid gap-x-3 sm:grid-cols-[5.5rem_1fr]">
            <dt className="label pt-[3px] text-path">{label}</dt>
            <dd>{text}</dd>
          </div>
        ))}
      </dl>
      {project.note && <p className="mt-3 text-sm text-path">{project.note}</p>}
      <ul className="mt-auto flex flex-wrap gap-1.5 pt-4">
        {project.stack.map((s) => (
          <li key={s} className="chip">
            {s}
          </li>
        ))}
      </ul>
    </article>
  )
}

export function ProjectsBody({ compact = false }: { compact?: boolean }) {
  const { t } = useLang()
  const featured = t.projects.items.filter((p) => p.featured)
  const others = t.projects.items.filter((p) => !p.featured)
  return (
    <div className="space-y-5">
      {featured.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
      <div id="playground" className="scroll-mt-20">
        <Suspense
          fallback={
            <div className="label border border-line bg-panel p-5" role="status">
              {t.playground.loading}
            </div>
          }
        >
          <OptimizerPlayground />
        </Suspense>
      </div>
      <div className={`grid gap-5 ${compact ? '' : 'md:grid-cols-2'}`}>
        {others.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  )
}
