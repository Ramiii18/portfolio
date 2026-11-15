import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { SECTION_IDS, type SectionId } from '../../data/content'
import { pathLength, planPath, type Point } from '../../lib/astar'
import { useApp, type NavOptions } from '../../lib/app-context'
import {
  CHARGING_STATION,
  DOCK,
  METERS_PER_CELL,
  stationById,
  WAREHOUSE,
} from '../../lib/grid'
import { usePrefersReducedMotion } from '../../lib/hooks'
import { useLang } from '../../lib/lang-context'
import Hud from './Hud'
import StationPanel from './StationPanel'
import WarehouseMap from './WarehouseMap'

type RobotState = 'idle' | 'moving' | 'charging'

interface Sim {
  x: number
  y: number
  heading: number
  state: RobotState
  battery: number
  /** length of the current / last path, metres */
  pathM: number
  /** remaining travel time, seconds */
  eta: number
  missions: number
}

interface Motion {
  pts: Point[]
  total: number
  travelled: number
  target: SectionId
  playground: boolean
}

/** cells per second */
const SPEED = 11
/** battery % per cell travelled */
const DRAIN = 0.12

const INITIAL: Sim = {
  x: DOCK.x,
  y: DOCK.y,
  heading: 0,
  state: 'idle',
  battery: 87,
  pathM: 0,
  eta: 0,
  missions: 0,
}

export default function FleetView() {
  const { t } = useLang()
  const { fleetNav, openPalette } = useApp()
  const reduced = usePrefersReducedMotion()

  const [sim, setSim] = useState<Sim>(INITIAL)
  const simRef = useRef<Sim>(INITIAL)
  const [planned, setPlanned] = useState<Point[] | null>(null)
  const [target, setTarget] = useState<SectionId | null>(null)
  const [panel, setPanel] = useState<{ id: SectionId; playground: boolean } | null>(null)

  const motionRef = useRef<Motion | null>(null)
  const rafRef = useRef(0)
  const lastRef = useRef(0)

  const commit = useCallback((next: Sim) => {
    simRef.current = next
    setSim(next)
  }, [])

  const tick = useCallback(
    (now: number) => {
      const motion = motionRef.current
      if (!motion) {
        rafRef.current = 0
        return
      }
      const dt = Math.min(0.05, Math.max(0, (now - lastRef.current) / 1000))
      lastRef.current = now
      const before = motion.travelled
      motion.travelled = Math.min(motion.total, before + SPEED * dt)

      // locate the current segment
      const { pts } = motion
      let d = motion.travelled
      let i = 1
      for (; i < pts.length - 1; i++) {
        const seg = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)
        if (d <= seg) break
        d -= seg
      }
      const a = pts[i - 1]
      const b = pts[i]
      const segLen = Math.hypot(b.x - a.x, b.y - a.y) || 1
      const k = Math.min(1, d / segLen)

      const s = simRef.current
      const wanted = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
      const delta = ((((wanted - s.heading) % 360) + 540) % 360) - 180
      const heading = s.heading + delta * Math.min(1, dt * 16)
      const battery = Math.max(5, s.battery - (motion.travelled - before) * DRAIN)
      const done = motion.travelled >= motion.total - 1e-6

      commit({
        ...s,
        x: a.x + (b.x - a.x) * k,
        y: a.y + (b.y - a.y) * k,
        heading,
        battery,
        state: done ? 'idle' : 'moving',
        eta: done ? 0 : (motion.total - motion.travelled) / SPEED,
        missions: done ? s.missions + 1 : s.missions,
      })

      if (done) {
        motionRef.current = null
        rafRef.current = 0
        setPlanned(null)
        setTarget(null)
        setPanel({ id: motion.target, playground: motion.playground })
      } else {
        rafRef.current = requestAnimationFrame(tick)
      }
    },
    [commit],
  )

  const goTo = useCallback(
    (id: SectionId, options?: NavOptions & { direct?: boolean }) => {
      const playground = Boolean(options?.playground)
      const station = stationById(id)
      const s = simRef.current
      const here = { x: Math.round(s.x), y: Math.round(s.y) }
      const route = planPath(WAREHOUSE, here, station.cell)
      setPanel(null)

      // teleport: reduced motion, screen-reader jump list, or no route
      if (reduced || options?.direct || !route) {
        const length = route ? pathLength(route) : 0
        motionRef.current = null
        setPlanned(null)
        setTarget(null)
        commit({
          ...s,
          x: station.cell.x,
          y: station.cell.y,
          state: 'idle',
          battery: Math.max(5, s.battery - length * DRAIN),
          pathM: length > 0 ? length * METERS_PER_CELL : s.pathM,
          eta: 0,
          missions: length > 0 ? s.missions + 1 : s.missions,
        })
        setPanel({ id, playground })
        return
      }

      const pts: Point[] = [{ x: s.x, y: s.y }]
      for (const p of route) {
        const last = pts[pts.length - 1]
        if (Math.hypot(p.x - last.x, p.y - last.y) > 1e-6) pts.push(p)
      }
      const total = pathLength(pts)
      if (pts.length < 2 || total < 0.01) {
        setPanel({ id, playground })
        return
      }

      motionRef.current = { pts, total, travelled: 0, target: id, playground }
      setPlanned(pts)
      setTarget(id)
      commit({ ...s, state: 'moving', pathM: total * METERS_PER_CELL, eta: total / SPEED })
      if (!rafRef.current) {
        lastRef.current = performance.now()
        rafRef.current = requestAnimationFrame(tick)
      }
    },
    [commit, reduced, tick],
  )

  // stop the animation loop on unmount
  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      motionRef.current = null
    },
    [],
  )

  // let the command palette and hero buttons drive the robot
  useEffect(() => {
    fleetNav.current = goTo
    return () => {
      fleetNav.current = null
    }
  }, [fleetNav, goTo])

  // keys 1-6 send the robot to a station
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const el = e.target as HTMLElement | null
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return
      const index = Number(e.key) - 1
      if (Number.isInteger(index) && index >= 0 && index < SECTION_IDS.length) {
        e.preventDefault()
        goTo(SECTION_IDS[index])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goTo])

  // easter egg: the battery recharges while AMR-01 is parked at the charging bay
  const charger = stationById(CHARGING_STATION).cell
  const atCharger =
    sim.state !== 'moving' && Math.round(sim.x) === charger.x && Math.round(sim.y) === charger.y
  useEffect(() => {
    if (!atCharger) return
    const id = window.setInterval(() => {
      const s = simRef.current
      if (s.state === 'moving') return
      if (s.battery >= 100) {
        if (s.state !== 'idle') commit({ ...s, battery: 100, state: 'idle' })
        window.clearInterval(id)
        return
      }
      commit({ ...s, battery: Math.min(100, s.battery + 1), state: 'charging' })
    }, 160)
    return () => {
      window.clearInterval(id)
      const s = simRef.current
      if (s.state === 'charging') commit({ ...s, state: 'idle' })
    }
  }, [atCharger, commit])

  const closePanel = () => {
    if (panel) {
      const id = panel.id
      // return focus to the station that opened the panel
      window.setTimeout(() => document.getElementById(`station-${id}`)?.focus(), 0)
    }
    setPanel(null)
  }

  const stateLabel =
    sim.state === 'moving' ? t.hud.moving : sim.state === 'charging' ? t.hud.charging : t.hud.idle
  const stateColor =
    sim.state === 'moving' ? 'text-path' : sim.state === 'charging' ? 'text-safety' : 'text-ok'
  const item = 'border-l border-line pl-2 xl:pl-3'

  const telemetry = (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 whitespace-nowrap font-mono text-[11px] tracking-wider text-muted xl:gap-x-3 xl:text-xs">
      <span className="font-bold text-text">AMR-01</span>
      <span className={item}>
        {t.hud.state}: <span className={stateColor}>{stateLabel}</span>
      </span>
      <span className={item}>
        {t.hud.battery}{' '}
        <span className={sim.battery < 20 ? 'text-warn' : 'text-text'}>
          {Math.round(sim.battery)}%
        </span>
      </span>
      <span className={item}>
        {t.hud.path} <span className="text-text">{sim.pathM.toFixed(1)} m</span>
      </span>
      <span className={item}>
        {t.hud.eta} <span className="text-text">{sim.eta.toFixed(1)} s</span>
      </span>
      <span className={item}>
        {t.hud.missions} <span className="text-text">{sim.missions}</span>
      </span>
    </p>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Hud telemetry={telemetry} />
      <main className="flex flex-1 flex-col justify-center px-4 py-3 lg:px-6">
        <h1 className="sr-only">
          {t.meta.name} — {t.meta.role}. {t.meta.tagline}
        </h1>
        <nav aria-label={t.map.jumpTo} className="sr-only">
          <ul>
            {SECTION_IDS.map((id) => (
              <li key={id}>
                <button type="button" onClick={() => goTo(id, { direct: true })}>
                  {t.stations[id].label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <WarehouseMap
          robot={sim}
          planned={planned}
          target={target}
          active={panel?.id ?? null}
          charging={sim.state === 'charging'}
          onStation={goTo}
        />

        {/* right padding keeps the hints clear of the floating assistant button */}
        <div className="mx-auto mt-2 flex w-full max-w-[1600px] flex-wrap items-center gap-x-6 gap-y-1 pr-56">
          <p className="label">
            <span className="text-text">{t.meta.name}</span> · {t.meta.role} · {t.hud.mapHint}
          </p>
          <button
            type="button"
            onClick={openPalette}
            aria-label={t.hud.openPalette}
            className="label min-h-[32px] hover:text-path"
          >
            {t.hud.paletteHint}
          </button>
        </div>
      </main>

      <AnimatePresence>
        {panel && (
          <StationPanel
            key={panel.id}
            section={panel.id}
            scrollToPlayground={panel.playground}
            onClose={closePanel}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
