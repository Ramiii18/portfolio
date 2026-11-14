/**
 * Warehouse map definition: grid size, racks (obstacles) and stations.
 * Station names and labels live in src/data/content.ts.
 */
import type { SectionId } from '../data/content'
import { createGrid, type Grid, type Point, type Rect } from './astar'

export const COLS = 32
export const ROWS = 20
/** SVG units per cell. The map viewBox is COLS*CELL x ROWS*CELL. */
export const CELL = 40
/** Real-world size of one cell, used for telemetry. */
export const METERS_PER_CELL = 0.5

export const MAP_W = COLS * CELL
export const MAP_H = ROWS * CELL

export interface Station {
  id: SectionId
  code: string
  cell: Point
  /** Where the label sits relative to the station zone. */
  labelSide: 'top' | 'bottom'
  align: 'left' | 'center' | 'right'
}

export const RACKS: Rect[] = [
  { x: 6, y: 6, w: 7, h: 2 },
  { x: 6, y: 10, w: 7, h: 2 },
  { x: 15, y: 7, w: 2, h: 6 },
  { x: 19, y: 6, w: 7, h: 2 },
  { x: 19, y: 10, w: 7, h: 2 },
  { x: 8, y: 14, w: 4, h: 2 },
  { x: 20, y: 14, w: 4, h: 2 },
]

const WALLS: Rect[] = [
  { x: 0, y: 0, w: COLS, h: 1 },
  { x: 0, y: ROWS - 1, w: COLS, h: 1 },
  { x: 0, y: 0, w: 1, h: ROWS },
  { x: COLS - 1, y: 0, w: 1, h: ROWS },
]

export const STATIONS: Station[] = [
  { id: 'about', code: 'ST-01', cell: { x: 3, y: 16 }, labelSide: 'bottom', align: 'left' },
  { id: 'experience', code: 'ST-02', cell: { x: 3, y: 3 }, labelSide: 'top', align: 'left' },
  { id: 'projects', code: 'ST-03', cell: { x: 15, y: 3 }, labelSide: 'top', align: 'center' },
  { id: 'skills', code: 'ST-04', cell: { x: 28, y: 3 }, labelSide: 'top', align: 'right' },
  { id: 'education', code: 'ST-05', cell: { x: 28, y: 16 }, labelSide: 'bottom', align: 'right' },
  { id: 'contact', code: 'ST-06', cell: { x: 16, y: 16 }, labelSide: 'bottom', align: 'center' },
]

export const DOCK: Point = STATIONS[0].cell
export const CHARGING_STATION: SectionId = 'education'

export const WAREHOUSE: Grid = createGrid(COLS, ROWS, [...WALLS, ...RACKS])

export function stationById(id: SectionId): Station {
  const s = STATIONS.find((st) => st.id === id)
  if (!s) throw new Error(`Unknown station: ${id}`)
  return s
}

/** Centre of a cell in SVG units. */
export function toSvg(p: Point): Point {
  return { x: (p.x + 0.5) * CELL, y: (p.y + 0.5) * CELL }
}
