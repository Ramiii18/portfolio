import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import LangToggle from '../components/LangToggle'
import RichText from '../components/RichText'
import { useLang } from '../lib/lang-context'

/** Printable A4 CV, generated from src/data/content.ts. */
export default function CvPrint() {
  const { t } = useLang()

  useEffect(() => {
    const previous = document.title
    document.title = `${t.meta.name} — CV`
    return () => {
      document.title = previous
    }
  }, [t.meta.name])

  const projects = t.projects.items.slice(0, 5)

  return (
    <div className="cv-page min-h-screen bg-[#e9edf1] print:bg-white">
      <div className="no-print sticky top-0 z-10 border-b border-[#c9d1d9] bg-white">
        <div className="mx-auto flex max-w-[210mm] flex-wrap items-center gap-3 px-4 py-2">
          <Link to="/" className="mr-auto text-sm font-semibold underline underline-offset-2">
            ← {t.cv.back}
          </Link>
          <LangToggle light />
          <button
            type="button"
            onClick={() => window.print()}
            className="min-h-[36px] bg-[#14181d] px-4 text-sm font-semibold text-white"
          >
            {t.cv.download}
          </button>
        </div>
      </div>

      <main className="cv-sheet my-0 sm:my-6 sm:shadow-lg print:my-0 print:shadow-none">
        <header className="border-b-2 border-[#14181d] pb-3">
          <h1 className="font-wide text-[24pt] font-extrabold uppercase leading-none">
            {t.meta.name}
          </h1>
          <p className="mt-1.5 text-[12pt] font-semibold">
            {t.meta.role} · AMR/AGV · {t.meta.company}
          </p>
          <p className="mt-1.5 flex flex-wrap gap-x-3 text-[9.5pt]">
            <a href={`mailto:${t.contact.email}`}>{t.contact.email}</a>
            <span aria-hidden="true">|</span>
            <a href={t.contact.linkedinUrl}>{t.contact.linkedinLabel}</a>
            <span aria-hidden="true">|</span>
            <span>{t.contact.locationLine}</span>
          </p>
        </header>

        <section>
          <h2 className="cv-h2">{t.cv.profile}</h2>
          <p>{t.cv.profileText}</p>
        </section>

        <section>
          <h2 className="cv-h2">{t.cv.experience}</h2>
          {t.experience.jobs.map((job) => (
            <div key={`${job.company}-${job.period}`} className="cv-avoid-break mb-2.5">
              <div className="flex flex-wrap justify-between gap-x-4">
                <h3 className="font-bold">
                  {job.role} · {job.company}
                </h3>
                <span className="whitespace-nowrap font-semibold">{job.period}</span>
              </div>
              <p className="text-[9pt] italic text-[#4a5561]">{job.location}</p>
              <ul className="mt-1 list-disc pl-4">
                {job.bullets.map((b, i) => (
                  <li key={i}>
                    <RichText text={b} strongClassName="font-bold" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h2 className="cv-h2">{t.cv.projects}</h2>
          <ul className="space-y-1">
            {projects.map((p) => (
              <li key={p.id} className="cv-avoid-break">
                <span className="font-bold">{p.title}.</span> {p.pitch}{' '}
                <span className="text-[#4a5561]">{p.result}</span>{' '}
                <span className="text-[9pt] italic text-[#4a5561]">[{p.stack.join(', ')}]</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="cv-avoid-break">
          <h2 className="cv-h2">{t.cv.education}</h2>
          {t.education.schools.map((s) => (
            <div key={s.school} className="mb-1 flex flex-wrap justify-between gap-x-4">
              <p>
                <span className="font-bold">{s.school}</span>
                <span className="block text-[9.5pt]">{s.degree}</span>
              </p>
              <span className="whitespace-nowrap font-semibold">{s.period}</span>
            </div>
          ))}
        </section>

        <section className="cv-avoid-break">
          <h2 className="cv-h2">{t.cv.skills}</h2>
          <ul className="space-y-0.5">
            {t.skills.modules.map((m) => (
              <li key={m.code}>
                <span className="font-bold">{m.title}:</span> {m.items.join(', ')}.
              </li>
            ))}
          </ul>
        </section>

        <div className="cv-avoid-break grid gap-x-8 sm:grid-cols-2 print:grid-cols-2">
          <section>
            <h2 className="cv-h2">{t.cv.languages}</h2>
            <p>{t.skills.languages.map((l) => `${l.name} (${l.level})`).join(' · ')}</p>
          </section>
          <section>
            <h2 className="cv-h2">{t.cv.certifications}</h2>
            <p>{t.education.certifications.map((c) => `${c.name} (${c.issuer})`).join(' · ')}</p>
          </section>
        </div>
      </main>
    </div>
  )
}
