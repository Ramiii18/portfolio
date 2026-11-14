import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import type { Point } from '../../lib/astar'
import { dispatchNaive, dispatchOptimized, type Plan } from '../../lib/dispatch'
import { usePrefersReducedMotion } from '../../lib/hooks'
import { useLang } from '../../lib/lang-context'

const COLS = 20
const ROWS = 12
const CELL = 30
const W = COLS * CELL
const H = ROWS * CELL
const MAX_TASKS = 10
const MIN_TASKS = 2
/** One cell is one metre; robots drive at 1.5 m/s for the makespan figure. */
const SPEED_MPS = 1.5

const ROBOTS: Point[] = [
  { x: 2, y: 2 },
  { x: 17, y: 3 },
  { x: 9, y: 10 },
]

type Mode = 'naive' | 'optimized'

const centre = (p: Point): Point => ({ x: (p.x + 0.5) * CELL, y: (p.y + 0.5) * CELL })
const same = (a: Point, b: Point) => a.x === b.x && a.y === b.y

function randomTasks(): Point[] {
  const count = 6 + Math.floor(Math.random() * 4)
  const tasks: Point[] = []
  let guard = 0
  while (tasks.length < count && guard++ < 500) {
    const p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }
    if (ROBOTS.some((r) => same(r, p)) || tasks.some((t) => same(t, p))) continue
    tasks.push(p)
  }
  return tasks
}

/** Position and heading after travelling `distance` along a polyline. */
function along(points: Point[], distance: number): { pos: Point; heading: number } {
  let d = distance
  let heading = 0
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    const seg = Math.hypot(b.x - a.x, b.y - a.y)
    if (seg === 0) continue
    heading = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
    if (d <= seg) {
      const k = d / seg
      return { pos: { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k }, heading }
    }
    d -= seg
  }
  return { pos: points[points.length - 1], heading }
}

const pctChange = (from: number, to: number) => (from > 0 ? ((from - to) / from) * 100 : 0)

function Gain({ value }: { value: number }) {
  const rounded = Math.round(value)
  const cls = rounded > 0 ? 'text-ok' : rounded < 0 ? 'text-warn' : 'text-muted'
  const sign = rounded > 0 ? '−' : rounded < 0 ? '+' : ''
  return (
    <span className={`font-bold ${cls}`}>
      {sign}
      {Math.abs(rounded)}%
    </span>
  )
}

export default function OptimizerPlayground() {
  const { t } = useLang()
  const p = t.playground
  const reduced = usePrefersReducedMotion()

  const [tasks, setTasks] = useState<Point[]>([])
  const [dropMode, setDropMode] = useState(true)
  const [results, setResults] = useState<Partial<Record<Mode, Plan>>>({})
  const [run, setRun] = useState<{ mode: Mode; plan: Plan } | null>(null)
  /** distance travelled by every robot in the current run, in cells */
  const [progress, setProgress] = useState(0)

  const updateTasks = (next: Point[]) => {
    setTasks(next)
    setResults({})
    setRun(null)
    setProgress(0)
  }

  const dispatch = (mode: Mode) => {
    const plan = mode === 'naive' ? dispatchNaive(ROBOTS, tasks) : dispatchOptimized(ROBOTS, tasks)
    setResults((r) => ({ ...r, [mode]: plan }))
    setProgress(0)
    setRun({ mode, plan })
  }

  useEffect(() => {
    if (!run) return
    const end = run.plan.makespan
    if (reduced || end === 0) {
      setProgress(end)
      return
    }
    const speed = Math.max(6, end / 3)
    let raf = 0
    let start: number | null = null
    const tick = (now: number) => {
      if (start === null) start = now
      const d = Math.min(end, ((now - start) / 1000) * speed)
      setProgress(d)
      if (d < end) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, reduced])

  const onFloorClick = (e: MouseEvent<SVGSVGElement>) => {
    if (!dropMode) return
    const rect = e.currentTarget.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    const cell = {
      x: Math.min(COLS - 1, Math.max(0, Math.floor(((e.clientX - rect.left) / rect.width) * COLS))),
      y: Math.min(ROWS - 1, Math.max(0, Math.floor(((e.clientY - rect.top) / rect.height) * ROWS))),
    }
    if (ROBOTS.some((r) => same(r, cell))) return
    const existing = tasks.findIndex((task) => same(task, cell))
    if (existing >= 0) updateTasks(tasks.filter((_, i) => i !== existing))
    else if (tasks.length < MAX_TASKS) updateTasks([...tasks, cell])
  }

  /** per-robot polyline (SVG units) and the distance at which each task is reached */
  const routes = useMemo(() => {
    if (!run) return null
    const reachedAt = new Map<number, number>()
    const lines = run.plan.routes.map((route, r) => {
      let d = 0
      let prev = ROBOTS[r]
      for (const task of route) {
        d += Math.hypot(tasks[task].x - prev.x, tasks[task].y - prev.y)
        prev = tasks[task]
        reachedAt.set(task, d)
      }
      return [ROBOTS[r], ...route.map((task) => tasks[task])]
    })
    return { lines, reachedAt }
  }, [run, tasks])

  const canDispatch = tasks.length >= MIN_TASKS
  const naive = results.naive
  const optimized = results.optimized
  const fmtM = (v: number) => `${v.toFixed(1)} m`
  const fmtS = (v: number) => `${(v / SPEED_MPS).toFixed(1)} s`

  return (
    <section aria-labelledby="playground-title" className="brackets border border-line bg-panel p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id="playground-title" className="font-wide text-lg font-bold uppercase text-safety">
          {p.title}
        </h3>
        <span className="label">
          {tasks.length}/{MAX_TASKS} {p.tasks}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">{p.intro}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className={`btn ${dropMode ? 'border-path text-path' : ''}`}
          aria-pressed={dropMode}
          onClick={() => setDropMode((v) => !v)}
        >
          {p.dropTasks}
        </button>
        <button type="button" className="btn" onClick={() => updateTasks(randomTasks())}>
          {p.randomize}
        </button>
        <button
          type="button"
          className="btn"
          disabled={tasks.length === 0}
          onClick={() => updateTasks([])}
        >
          {p.clear}
        </button>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={`mt-3 block h-auto w-full touch-manipulation select-none border border-line bg-bg ${
          dropMode ? 'cursor-crosshair' : ''
        }`}
        role="img"
        aria-label={p.floorLabel}
        onClick={onFloorClick}
      >
        <defs>
          <pattern id="pg-grid" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
            <path d={`M ${CELL} 0 H 0 V ${CELL}`} fill="none" stroke="var(--grid)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#pg-grid)" />

        {/* robot home positions */}
        {ROBOTS.map((r, i) => {
          const c = centre(r)
          return (
            <rect
              key={i}
              x={c.x - 13}
              y={c.y - 13}
              width="26"
              height="26"
              fill="none"
              stroke="var(--safety)"
              strokeWidth="1.5"
              strokeDasharray="5 4"
              opacity="0.6"
            />
          )
        })}

        {/* planned routes */}
        {routes?.lines.map((line, i) => (
          <polyline
            key={i}
            points={line
              .map((pt) => {
                const c = centre(pt)
                return `${c.x},${c.y}`
              })
              .join(' ')}
            fill="none"
            stroke="var(--path)"
            strokeWidth="2"
            strokeDasharray="6 5"
            strokeLinejoin="round"
            opacity="0.9"
          />
        ))}

        {/* tasks */}
        {tasks.map((task, i) => {
          const c = centre(task)
          const reached = routes?.reachedAt.get(i)
          const done = reached !== undefined && progress >= reached - 1e-6
          return (
            <g key={`${task.x}-${task.y}`}>
              <rect
                x={c.x - 9}
                y={c.y - 9}
                width="18"
                height="18"
                fill={done ? 'var(--ok)' : 'var(--bg)'}
                stroke={done ? 'var(--ok)' : 'var(--safety)'}
                strokeWidth="2"
              />
              <text
                x={c.x}
                y={c.y + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fontFamily="'JetBrains Mono Variable', monospace"
                fill={done ? 'var(--bg)' : 'var(--safety)'}
              >
                {i + 1}
              </text>
            </g>
          )
        })}

        {/* robots */}
        {ROBOTS.map((r, i) => {
          const line = routes?.lines[i]
          const state = line ? along(line, progress) : { pos: r, heading: 0 }
          const c = centre(state.pos)
          return (
            <g key={i} transform={`translate(${c.x.toFixed(2)} ${c.y.toFixed(2)})`}>
              <g transform={`rotate(${state.heading.toFixed(1)})`}>
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
                <path d="M 3 -4 L 8 0 L 3 4 Z" fill="var(--safety)" />
              </g>
              <text
                y="-13"
                textAnchor="middle"
                fontSize="10"
                fontFamily="'JetBrains Mono Variable', monospace"
                fill="var(--text)"
              >
                R{i + 1}
              </text>
            </g>
          )
        })}
      </svg>
      <p className="mt-2 text-xs text-muted">{canDispatch ? p.dropHint : p.needTasks}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn"
          disabled={!canDispatch}
          onClick={() => dispatch('naive')}
        >
          {p.naive}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!canDispatch}
          onClick={() => dispatch('optimized')}
        >
          {p.optimized}
        </button>
      </div>

      <div className="mt-4 border border-line bg-bg p-3" aria-live="polite">
        <p className="label mb-2 text-text">{p.results}</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-mono text-xs">
            <thead>
              <tr className="text-muted">
                <td className="py-1 pr-3" />
                <th scope="col" className="py-1 pr-3 font-normal">
                  {p.distance}
                </th>
                <th scope="col" className="py-1 font-normal">
                  {p.makespan}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-line">
                <th scope="row" className="py-1.5 pr-3 font-normal text-muted">
                  {p.naiveShort}
                </th>
                <td className="py-1.5 pr-3">{naive ? fmtM(naive.total) : '—'}</td>
                <td className="py-1.5">{naive ? fmtS(naive.makespan) : '—'}</td>
              </tr>
              <tr className="border-t border-line">
                <th scope="row" className="py-1.5 pr-3 font-normal text-muted">
                  {p.optimizedShort}
                </th>
                <td className="py-1.5 pr-3">{optimized ? fmtM(optimized.total) : '—'}</td>
                <td className="py-1.5">{optimized ? fmtS(optimized.makespan) : '—'}</td>
              </tr>
              <tr className="border-t border-line">
                <th scope="row" className="py-1.5 pr-3 font-normal text-text">
                  {p.improvement}
                </th>
                <td className="py-1.5 pr-3 text-sm">
                  {naive && optimized ? <Gain value={pctChange(naive.total, optimized.total)} /> : '—'}
                </td>
                <td className="py-1.5 text-sm">
                  {naive && optimized ? (
                    <Gain value={pctChange(naive.makespan, optimized.makespan)} />
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {!(naive && optimized) && <p className="mt-2 text-xs text-muted">{p.runBoth}</p>}
      </div>
    </section>
  )
}
