/**
 * A* path planning on a grid, with string-pulling path smoothing.
 * Pure TypeScript, no DOM. Cell (x, y) is addressed by its integer coordinates;
 * continuous points use the same frame, so a cell's centre is exactly (x, y).
 */

export interface Point {
  x: number
  y: number
}

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export interface Grid {
  cols: number
  rows: number
  /** 1 = obstacle, 0 = free. Row-major. */
  blocked: Uint8Array
}

export function createGrid(cols: number, rows: number, obstacles: Rect[] = []): Grid {
  const blocked = new Uint8Array(cols * rows)
  for (const r of obstacles) {
    for (let y = r.y; y < r.y + r.h; y++) {
      for (let x = r.x; x < r.x + r.w; x++) {
        if (x >= 0 && y >= 0 && x < cols && y < rows) blocked[y * cols + x] = 1
      }
    }
  }
  return { cols, rows, blocked }
}

/** Out-of-bounds cells count as blocked. */
export function isBlocked(grid: Grid, x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= grid.cols || y >= grid.rows) return true
  return grid.blocked[y * grid.cols + x] === 1
}

const SQRT2 = Math.SQRT2

const DIRS: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
]

/** Octile distance: exact cost of the shortest 8-neighbour path on an empty grid. */
export function octile(a: Point, b: Point): number {
  const dx = Math.abs(a.x - b.x)
  const dy = Math.abs(a.y - b.y)
  return dx + dy + (SQRT2 - 2) * Math.min(dx, dy)
}

class MinHeap {
  private ids: number[] = []
  private keys: number[] = []

  get size(): number {
    return this.ids.length
  }

  push(id: number, key: number): void {
    const { ids, keys } = this
    let i = ids.length
    ids.push(id)
    keys.push(key)
    while (i > 0) {
      const p = (i - 1) >> 1
      if (keys[p] <= keys[i]) break
      this.swap(i, p)
      i = p
    }
  }

  pop(): number {
    const { ids, keys } = this
    const top = ids[0]
    const lastId = ids.pop() as number
    const lastKey = keys.pop() as number
    if (ids.length > 0) {
      ids[0] = lastId
      keys[0] = lastKey
      let i = 0
      for (;;) {
        const l = 2 * i + 1
        const r = l + 1
        let m = i
        if (l < ids.length && keys[l] < keys[m]) m = l
        if (r < ids.length && keys[r] < keys[m]) m = r
        if (m === i) break
        this.swap(i, m)
        i = m
      }
    }
    return top
  }

  private swap(a: number, b: number): void {
    const { ids, keys } = this
    const ti = ids[a]
    ids[a] = ids[b]
    ids[b] = ti
    const tk = keys[a]
    keys[a] = keys[b]
    keys[b] = tk
  }
}

/**
 * A* over an 8-connected grid with the octile heuristic.
 * Diagonal moves are only allowed when both adjacent orthogonal cells are free
 * (no cutting obstacle corners). Returns the cell path including start and goal,
 * or null when the goal is unreachable.
 */
export function findPath(grid: Grid, start: Point, goal: Point): Point[] | null {
  if (isBlocked(grid, start.x, start.y) || isBlocked(grid, goal.x, goal.y)) return null
  const { cols, rows } = grid
  const n = cols * rows
  const g = new Float64Array(n).fill(Infinity)
  const parent = new Int32Array(n).fill(-1)
  const closed = new Uint8Array(n)
  const startI = start.y * cols + start.x
  const goalI = goal.y * cols + goal.x

  const open = new MinHeap()
  g[startI] = 0
  open.push(startI, octile(start, goal))

  while (open.size > 0) {
    const cur = open.pop()
    if (closed[cur]) continue
    closed[cur] = 1

    if (cur === goalI) {
      const path: Point[] = []
      for (let i = cur; i !== -1; i = parent[i]) {
        path.push({ x: i % cols, y: Math.floor(i / cols) })
      }
      return path.reverse()
    }

    const cx = cur % cols
    const cy = Math.floor(cur / cols)
    for (const [dx, dy] of DIRS) {
      const nx = cx + dx
      const ny = cy + dy
      if (isBlocked(grid, nx, ny)) continue
      const diagonal = dx !== 0 && dy !== 0
      if (diagonal && (isBlocked(grid, cx + dx, cy) || isBlocked(grid, cx, cy + dy))) continue
      const ni = ny * cols + nx
      if (closed[ni]) continue
      const cost = g[cur] + (diagonal ? SQRT2 : 1)
      if (cost < g[ni]) {
        g[ni] = cost
        parent[ni] = cur
        open.push(ni, cost + octile({ x: nx, y: ny }, goal))
      }
    }
  }
  return null
}

/**
 * True when a body of half-width `clearance` (in cells) can travel in a straight
 * line from a to b without touching a blocked cell.
 */
export function hasLineOfSight(grid: Grid, a: Point, b: Point, clearance = 0.3): boolean {
  const dist = Math.hypot(b.x - a.x, b.y - a.y)
  const steps = Math.max(1, Math.ceil(dist / 0.05))
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const px = a.x + (b.x - a.x) * t
    const py = a.y + (b.y - a.y) * t
    const x0 = Math.round(px - clearance)
    const x1 = Math.round(px + clearance)
    const y0 = Math.round(py - clearance)
    const y1 = Math.round(py + clearance)
    if (
      isBlocked(grid, x0, y0) ||
      isBlocked(grid, x1, y0) ||
      isBlocked(grid, x0, y1) ||
      isBlocked(grid, x1, y1)
    ) {
      return false
    }
  }
  return true
}

/**
 * String-pulling: from each kept waypoint, jump to the farthest later waypoint
 * that is still in line of sight. Removes the zig-zag of a grid path.
 */
export function smoothPath(grid: Grid, path: Point[], clearance = 0.3): Point[] {
  if (path.length <= 2) return path.slice()
  const out: Point[] = [path[0]]
  let i = 0
  while (i < path.length - 1) {
    let j = path.length - 1
    while (j > i + 1 && !hasLineOfSight(grid, path[i], path[j], clearance)) j--
    out.push(path[j])
    i = j
  }
  return out
}

export function pathLength(path: Point[]): number {
  let total = 0
  for (let i = 1; i < path.length; i++) {
    total += Math.hypot(path[i].x - path[i - 1].x, path[i].y - path[i - 1].y)
  }
  return total
}

/** A* followed by smoothing. */
export function planPath(grid: Grid, start: Point, goal: Point): Point[] | null {
  const raw = findPath(grid, start, goal)
  return raw ? smoothPath(grid, raw) : null
}
