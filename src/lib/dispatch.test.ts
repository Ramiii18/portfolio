import { describe, expect, it } from 'vitest'
import type { Point } from './astar'
import { dispatchNaive, dispatchOptimized, evaluate, planCost, routeLength } from './dispatch'

const robots: Point[] = [
  { x: 2, y: 2 },
  { x: 17, y: 3 },
  { x: 9, y: 10 },
]

/** Small deterministic PRNG so the tests are reproducible. */
function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

function randomTasks(seed: number, n: number): Point[] {
  const next = rng(seed)
  return Array.from({ length: n }, () => ({
    x: Math.floor(next() * 20),
    y: Math.floor(next() * 12),
  }))
}

function assignedOnce(routes: number[][], n: number): boolean {
  const seen = routes.flat().sort((a, b) => a - b)
  return seen.length === n && seen.every((t, i) => t === i)
}

describe('routeLength / evaluate', () => {
  it('sums the legs of an open route', () => {
    const tasks = [
      { x: 3, y: 0 },
      { x: 3, y: 4 },
    ]
    expect(routeLength({ x: 0, y: 0 }, tasks, [0, 1])).toBeCloseTo(7)
    expect(routeLength({ x: 0, y: 0 }, tasks, [])).toBe(0)
  })

  it('computes total and makespan', () => {
    const tasks = [
      { x: 3, y: 0 },
      { x: 0, y: 5 },
    ]
    const plan = evaluate(
      [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ],
      tasks,
      [[0], [1]],
    )
    expect(plan.total).toBeCloseTo(8)
    expect(plan.makespan).toBeCloseTo(5)
  })
})

describe('dispatchNaive', () => {
  it('assigns tasks round robin in arrival order', () => {
    const plan = dispatchNaive(robots, randomTasks(1, 7))
    expect(plan.routes).toEqual([[0, 3, 6], [1, 4], [2, 5]])
  })
})

describe('dispatchOptimized', () => {
  it('assigns every task exactly once', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const n = 5 + (seed % 6)
      const plan = dispatchOptimized(robots, randomTasks(seed, n))
      expect(assignedOnce(plan.routes, n)).toBe(true)
    }
  })

  it('is never worse than the naive plan on the objective', () => {
    for (let seed = 1; seed <= 40; seed++) {
      const tasks = randomTasks(seed, 5 + (seed % 6))
      const naive = dispatchNaive(robots, tasks)
      const optimized = dispatchOptimized(robots, tasks)
      expect(planCost(optimized)).toBeLessThanOrEqual(planCost(naive) + 1e-9)
    }
  })

  it('gives each robot the task next to it', () => {
    const tasks = [
      { x: 9, y: 9 },
      { x: 3, y: 2 },
      { x: 17, y: 4 },
    ]
    const plan = dispatchOptimized(robots, tasks)
    expect(plan.routes).toEqual([[1], [2], [0]])
    expect(plan.total).toBeCloseTo(3)
  })

  it('handles an empty task list', () => {
    const plan = dispatchOptimized(robots, [])
    expect(plan.total).toBe(0)
    expect(plan.makespan).toBe(0)
  })
})
