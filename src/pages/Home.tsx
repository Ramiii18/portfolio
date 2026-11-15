import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import ClassicView from '../components/classic/ClassicView'
import CommandPalette from '../components/CommandPalette'
import Boot from '../components/fleet/Boot'
import FleetView from '../components/fleet/FleetView'
import { AppContext, type AppValue, type FleetNavigate, type View } from '../lib/app-context'
import { DESKTOP, prefersReducedMotionNow, useMediaQuery } from '../lib/hooks'
import { useLang } from '../lib/lang-context'
import { readSession, writeSession } from '../lib/storage'

const ChatBox = lazy(() => import('../components/ChatBox'))

const VIEW_KEY = 'fleetos.view'
const SEEN_KEY = 'seen'

export default function Home() {
  const { t } = useLang()
  const isDesktop = useMediaQuery(DESKTOP)
  const [viewPref, setViewPref] = useState<View>(() =>
    readSession(VIEW_KEY) === 'classic' ? 'classic' : 'fleet',
  )
  const view: View = isDesktop ? viewPref : 'classic'
  const [booting, setBooting] = useState(
    () => !prefersReducedMotionNow() && readSession(SEEN_KEY) !== 'true',
  )
  const [paletteOpen, setPaletteOpen] = useState(false)
  const fleetNav = useRef<FleetNavigate | null>(null)

  const setView = useCallback((next: View) => {
    setViewPref(next)
    writeSession(VIEW_KEY, next)
    window.scrollTo(0, 0)
  }, [])

  const navigate = useCallback<FleetNavigate>((section, options) => {
    if (fleetNav.current) {
      fleetNav.current(section, options)
      return
    }
    const scroll = (attempt: number) => {
      const el = document.getElementById(options?.playground ? 'playground' : section)
      if (!el) {
        // the classic view may still be mounting after a view switch
        if (attempt < 10) window.setTimeout(() => scroll(attempt + 1), 50)
        return
      }
      el.scrollIntoView({ behavior: prefersReducedMotionNow() ? 'auto' : 'smooth', block: 'start' })
      const section_ = document.getElementById(section)
      section_?.focus({ preventScroll: true })
    }
    scroll(0)
  }, [])

  const endBoot = useCallback(() => {
    writeSession(SEEN_KEY, 'true')
    setBooting(false)
  }, [])

  const openPalette = useCallback(() => setPaletteOpen(true), [])
  const closePalette = useCallback(() => setPaletteOpen(false), [])
  const [chatOpen, setChatOpen] = useState(false)
  const openChat = useCallback(() => setChatOpen(true), [])
  const closeChat = useCallback(() => {
    setChatOpen(false)
    window.setTimeout(() => document.getElementById('chat-launcher')?.focus(), 0)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const app = useMemo<AppValue>(
    () => ({ view, isDesktop, setView, navigate, openPalette, openChat, fleetNav }),
    [view, isDesktop, setView, navigate, openPalette, openChat],
  )

  return (
    <AppContext.Provider value={app}>
      {view === 'fleet' ? <FleetView /> : <ClassicView />}

      {view === 'classic' && (
        <button
          type="button"
          onClick={openPalette}
          aria-label={t.hud.openPalette}
          className="label fixed bottom-3 left-3 z-20 hidden min-h-[32px] border border-line bg-bg px-2 hover:text-path md:block"
        >
          {t.hud.paletteHint}
        </button>
      )}

      {chatOpen ? (
        <Suspense fallback={null}>
          <ChatBox onClose={closeChat} />
        </Suspense>
      ) : (
        <button
          id="chat-launcher"
          type="button"
          onClick={openChat}
          className="fixed bottom-3 right-3 z-20 flex min-h-[40px] items-center gap-2 border border-safety bg-bg px-3 font-mono text-xs font-bold uppercase tracking-wider text-safety shadow-lg hover:bg-safety hover:text-bg"
        >
          <span aria-hidden="true">{'>_'}</span>
          {t.chat.button}
        </button>
      )}

      <AnimatePresence>
        {paletteOpen && <CommandPalette key="palette" onClose={closePalette} />}
      </AnimatePresence>
      <AnimatePresence>{booting && <Boot key="boot" onDone={endBoot} />}</AnimatePresence>
    </AppContext.Provider>
  )
}
