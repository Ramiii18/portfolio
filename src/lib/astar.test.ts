import { describe, expect, it } from 'vitest'
import {
  createGrid,
  findPath,
  hasLineOfSight,
  isBlocked,
  octile,
  pathLength,
  planPath,
  smoothPath,
} from './astar'
import { STATIONS, WAREHOUSE } from './grid'

describe('octile heuristic', () => {
  it('matches straight and diagonal distances', () => {
    expect(octile({ x: 0, y: 0 }, { x: 5, y: 0 })).toBeCloseTo(5)
    expect(octile({ x: 0, y: 0 }, { x: 3, y: 3 })).toBeCloseTo(3 * Math.SQRT2)
    expect(octile({ x: 0, y: 0 }, { x: 4, y: 1 })).toBeCloseTo(3 + Math.SQRT2)
  })
})

describe('findPath', () => {
  it('returns a single cell when start equals goal', () => {
    const grid = createGrid(5, 5)
    expect(findPath(grid, { x: 2, y: 2 }, { x: 2, y: 2 })).toEqual([{ x: 2, y: 2 }])
  })

  it('finds the optimal path on an empty grid', () => {
    const grid = createGrid(10, 10)
    const path = findPath(grid, { x: 0, y: 0 }, { x: 7, y: 3 })
    expect(path).not.toBeNull()
    expect(path![0]).toEqual({ x: 0, y: 0 })
    expect(path![path!.length - 1]).toEqual({ x: 7, y: 3 })
    expect(pathLength(path!)).toBeCloseTo(octile({ x: 0, y: 0 }, { x: 7, y: 3 }))
  })

  it('routes around a wall', () => {
    // vertical wall at x=3 with a gap at y=6
    const grid = createGrid(7, 7, [{ x: 3, y: 0, w: 1, h: 6 }])
    const path = findPath(grid, { x: 0, y: 0 }, { x: 6, y: 0 })
    expect(path).not.toBeNull()
    expect(path!.some((p) => p.x === 3 && p.y === 6)).toBe(true)
    expect(path!.every((p) => !isBlocked(grid, p.x, p.y))).toBe(true)
  })

  it('returns null when the goal is unreachable', () => {
    const grid = createGrid(7, 7, [{ x: 3, y: 0, w: 1, h: 7 }])
    expect(findPath(grid, { x: 0, y: 0 }, { x: 6, y: 0 })).toBeNull()
  })

  it('returns null when start or goal is blocked or out of bounds', () => {
    const grid = createGrid(5, 5, [{ x: 2, y: 2, w: 1, h: 1 }])
    expect(findPath(grid, { x: 2, y: 2 }, { x: 0, y: 0 })).toBeNull()
    expect(findPath(grid, { x: 0, y: 0 }, { x: 9, y: 9 })).toBeNull()
  })

  it('does not cut obstacle corners diagonally', () => {
    const grid = createGrid(3, 3, [{ x: 1, y: 0, w: 1, h: 1 }])
    const path = findPath(grid, { x: 0, y: 0 }, { x: 1, y: 1 })
    // (0,0) -> (1,1) directly would clip the corner of (1,0)
    expect(path).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ])
  })

  it('only makes unit steps between neighbouring cells', () => {
    const path = findPath(WAREHOUSE, STATIONS[0].cell, STATIONS[3].cell)!
    for (let i = 1; i < path.length; i++) {
      expect(Math.abs(path[i].x - path[i - 1].x)).toBeLessThanOrEqual(1)
      expect(Math.abs(path[i].y - path[i - 1].y)).toBeLessThanOrEqual(1)
    }
  })
})

describe('line of sight and smoothing', () => {
  it('detects obstacles between two points', () => {
    const grid = createGrid(7, 7, [{ x: 3, y: 2, w: 1, h: 3 }])
    expect(hasLineOfSight(grid, { x: 0, y: 3 }, { x: 6, y: 3 })).toBe(false)
    expect(hasLineOfSight(grid, { x: 0, y: 0 }, { x: 6, y: 0 })).toBe(true)
  })

  it('collapses a clear path to its two endpoints', () => {
    const grid = createGrid(12, 12)
    const raw = findPath(grid, { x: 0, y: 0 }, { x: 9, y: 4 })!
    expect(smoothPath(grid, raw)).toEqual([
      { x: 0, y: 0 },
      { x: 9, y: 4 },
    ])
  })

  it('never lengthens the path and keeps every segment collision free', () => {
    for (const a of STATIONS) {
      for (const b of STATIONS) {
        if (a.id === b.id) continue
        const raw = findPath(WAREHOUSE, a.cell, b.cell)!
        const smooth = smoothPath(WAREHOUSE, raw)
        expect(smooth[0]).toEqual(a.cell)
        expect(smooth[smooth.length - 1]).toEqual(b.cell)
        expect(pathLength(smooth)).toBeLessThanOrEqual(pathLength(raw) + 1e-9)
        expect(smooth.length).toBeLessThanOrEqual(raw.length)
        for (let i = 1; i < smooth.length; i++) {
          expect(hasLineOfSight(WAREHOUSE, smooth[i - 1], smooth[i])).toBe(true)
        }
      }
    }
  })
})

describe('warehouse map', () => {
  it('has every station on a free cell and reachable from every other', () => {
    for (const a of STATIONS) {
      expect(isBlocked(WAREHOUSE, a.cell.x, a.cell.y)).toBe(false)
      for (const b of STATIONS) {
        expect(planPath(WAREHOUSE, a.cell, b.cell)).not.toBeNull()
      }
    }
  })
})
