import { SECTION_IDS } from '../../data/content'
import { useLang } from '../../lib/lang-context'
import { STATIONS } from '../../lib/grid'
import Hud from '../fleet/Hud'
import SectionBody from '../SectionBody'
import Hero from './Hero'

export default function ClassicView() {
  const { t } = useLang()
  return (
    <>
      <Hud />
      <main className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <Hero />
        {SECTION_IDS.map((id) => {
          const station = STATIONS.find((s) => s.id === id)
          return (
            <section
              key={id}
              id={id}
              aria-labelledby={`${id}-title`}
              tabIndex={-1}
              className="scroll-mt-16 py-10 outline-none"
            >
              <header className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line pb-3">
                <span className="font-mono text-xs text-safety">{station?.code}</span>
                <h2
                  id={`${id}-title`}
                  className="font-wide text-2xl font-bold uppercase sm:text-3xl"
                >
                  {t.stations[id].label}
                </h2>
                <span className="label ml-auto">{t.stations[id].name}</span>
              </header>
              <SectionBody section={id} />
            </section>
          )
        })}
      </main>
      <footer className="mt-10 border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-between gap-2 px-4 py-6 font-mono text-xs text-muted sm:px-6">
          <span>
            © {new Date().getFullYear()} {t.meta.name}
          </span>
          <span>{t.footer}</span>
        </div>
      </footer>
    </>
  )
}
