import { memo } from 'react'
import { SECTION_IDS, type SectionId } from '../../data/content'
import type { Point } from '../../lib/astar'
import { CELL, COLS, MAP_H, MAP_W, RACKS, ROWS, STATIONS, toSvg } from '../../lib/grid'
import { useLang } from '../../lib/lang-context'
import Robot from './Robot'

const pct = (value: number, total: number) => `${(value / total) * 100}%`

/** Floor, grid, lane markings, racks and station zones. Never changes, so it is memoized. */
const Floor = memo(function Floor() {
  const lane = { stroke: 'var(--safety)', strokeWidth: 3, strokeDasharray: '18 14', opacity: 0.4 }
  return (
    <g>
      <defs>
        <pattern id="floor-grid" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
          <path d={`M ${CELL} 0 H 0 V ${CELL}`} fill="none" stroke="var(--grid)" strokeWidth="1" />
        </pattern>
        <pattern
          id="rack-hatch"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="10" stroke="var(--line)" strokeWidth="2" />
        </pattern>
      </defs>
      <rect width={MAP_W} height={MAP_H} fill="var(--bg)" />
      <rect width={MAP_W} height={MAP_H} fill="url(#floor-grid)" />
      {/* outer wall */}
      <rect
        x={CELL}
        y={CELL}
        width={MAP_W - 2 * CELL}
        height={MAP_H - 2 * CELL}
        fill="none"
        stroke="var(--line)"
        strokeWidth="3"
      />

      {/* yellow safety lanes */}
      <rect x={180} y={180} width={920} height={500} rx={24} fill="none" {...lane} />
      <line x1={180} y1={360} x2={1100} y2={360} {...lane} />
      <line x1={180} y1={520} x2={1100} y2={520} {...lane} />
      <line x1={560} y1={180} x2={560} y2={680} {...lane} />
      <line x1={720} y1={180} x2={720} y2={680} {...lane} />

      {/* racks */}
      {RACKS.map((r, i) => {
        const x = r.x * CELL + 4
        const y = r.y * CELL + 4
        const w = r.w * CELL - 8
        const h = r.h * CELL - 8
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} fill="var(--panel)" />
            <rect x={x} y={y} width={w} height={h} fill="url(#rack-hatch)" opacity="0.5" />
            <rect x={x} y={y} width={w} height={h} fill="none" stroke="var(--line)" strokeWidth="2" />
            <text
              x={x + 8}
              y={y + 18}
              fill="var(--muted)"
              fontSize="13"
              fontFamily="'JetBrains Mono Variable', monospace"
            >
              {`R-${String(i + 1).padStart(2, '0')}`}
            </text>
          </g>
        )
      })}

      {/* station zones */}
      {STATIONS.map((s) => {
        const x = (s.cell.x - 0.5) * CELL
        const y = (s.cell.y - 0.5) * CELL
        return (
          <g key={s.id}>
            <rect x={x} y={y} width={2 * CELL} height={2 * CELL} fill="var(--panel)" opacity="0.6" />
            <rect
              x={x}
              y={y}
              width={2 * CELL}
              height={2 * CELL}
              fill="none"
              stroke="var(--safety)"
              strokeWidth="2"
              strokeDasharray="10 6"
            />
          </g>
        )
      })}
    </g>
  )
})

export default function WarehouseMap({
  robot,
  planned,
  target,
  active,
  charging,
  onStation,
}: {
  robot: { x: number; y: number; heading: number }
  planned: Point[] | null
  /** Station the robot is driving to */
  target: SectionId | null
  /** Station whose panel is open */
  active: SectionId | null
  charging: boolean
  onStation: (id: SectionId) => void
}) {
  const { t } = useLang()
  const pos = toSvg(robot)
  const goal = planned ? toSvg(planned[planned.length - 1]) : null

  return (
    <div
      className="relative mx-auto w-full border border-line"
      style={{
        aspectRatio: `${COLS} / ${ROWS}`,
        maxWidth: `calc((100vh - 9.5rem) * ${COLS / ROWS})`,
      }}
    >
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label={t.map.title}
      >
        <Floor />
        {planned && goal && (
          <g>
            <polyline
              points={planned
                .map((p) => {
                  const s = toSvg(p)
                  return `${s.x},${s.y}`
                })
                .join(' ')}
              fill="none"
              stroke="var(--path)"
              strokeWidth="3"
              strokeDasharray="10 8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx={goal.x} cy={goal.y} r="9" fill="none" stroke="var(--path)" strokeWidth="2" />
            <circle cx={goal.x} cy={goal.y} r="3" fill="var(--path)" />
          </g>
        )}
        <Robot x={pos.x} y={pos.y} heading={robot.heading} label={t.map.robotAria} />
      </svg>

      {STATIONS.map((s) => {
        const copy = t.stations[s.id]
        const key = SECTION_IDS.indexOf(s.id) + 1
        const led =
          target === s.id
            ? 'led led-busy'
            : s.id === 'education' && charging
              ? 'led led-busy'
              : 'led'
        const sideClass = s.labelSide === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
        const alignClass =
          s.align === 'left'
            ? 'left-0 items-start text-left'
            : s.align === 'right'
              ? 'right-0 items-end text-right'
              : 'left-1/2 -translate-x-1/2 items-center text-center'
        return (
          <button
            key={s.id}
            id={`station-${s.id}`}
            type="button"
            onClick={() => onStation(s.id)}
            aria-label={t.map.stationAria.replace('{name}', copy.name).replace('{label}', copy.label)}
            aria-current={active === s.id ? 'true' : undefined}
            className="group absolute"
            style={{
              left: pct(s.cell.x - 0.5, COLS),
              top: pct(s.cell.y - 0.5, ROWS),
              width: pct(2, COLS),
              height: pct(2, ROWS),
            }}
          >
            <span
              className={`pointer-events-none absolute flex flex-col whitespace-nowrap font-mono leading-tight ${sideClass} ${alignClass}`}
            >
              <span className="flex items-center gap-1.5 bg-bg px-1 text-[11px] tracking-wider text-muted">
                <span className={led} aria-hidden="true" />
                <span>{s.code}</span>
                <span className="font-bold text-text group-hover:text-safety">{copy.name}</span>
                <kbd className="border border-line px-1 text-[10px] text-muted">{key}</kbd>
              </span>
              <span className="bg-bg px-1 text-[12px] text-path">{copy.label}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
