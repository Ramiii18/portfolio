/**
 * Task dispatch for the Optimizer Playground.
 * Naive: first-come, first-served round robin.
 * Optimized: cheapest insertion, then local search (2-opt inside each route,
 * relocate and swap between routes) on cost = total distance + makespan.
 * Routes are open: a robot stops at its last task.
 */
import type { Point } from './astar'

export interface Plan {
  /** routes[r] = task indices visited by robot r, in order */
  routes: number[][]
  /** travel distance of each robot */
  lengths: number[]
  /** sum of all robot distances */
  total: number
  /** longest single-robot distance (divide by speed to get time) */
  makespan: number
}

const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y)

export function routeLength(start: Point, tasks: Point[], route: number[]): number {
  let total = 0
  let prev = start
  for (const t of route) {
    total += dist(prev, tasks[t])
    prev = tasks[t]
  }
  return total
}

export function evaluate(robots: Point[], tasks: Point[], routes: number[][]): Plan {
  const lengths = routes.map((route, r) => routeLength(robots[r], tasks, route))
  return {
    routes: routes.map((r) => r.slice()),
    lengths,
    total: lengths.reduce((a, b) => a + b, 0),
    makespan: lengths.reduce((a, b) => Math.max(a, b), 0),
  }
}

/** Objective minimised by the optimizer. */
export function planCost(plan: Plan): number {
  return plan.total + plan.makespan
}

function cost(robots: Point[], tasks: Point[], routes: number[][]): number {
  let total = 0
  let makespan = 0
  for (let r = 0; r < routes.length; r++) {
    const len = routeLength(robots[r], tasks, routes[r])
    total += len
    if (len > makespan) makespan = len
  }
  return total + makespan
}

/** First-come, first-served: task i goes to robot i mod n, in arrival order. */
export function dispatchNaive(robots: Point[], tasks: Point[]): Plan {
  const routes: number[][] = robots.map(() => [])
  if (robots.length > 0) {
    tasks.forEach((_, i) => routes[i % robots.length].push(i))
  }
  return evaluate(robots, tasks, routes)
}

const clone = (routes: number[][]) => routes.map((r) => r.slice())
const EPS = 1e-9

/** Returns the first neighbouring solution that is strictly better, or null. */
function improvingMove(robots: Point[], tasks: Point[], routes: number[][]): number[][] | null {
  const base = cost(robots, tasks, routes)

  // 2-opt: reverse a segment inside one route
  for (let r = 0; r < routes.length; r++) {
    const route = routes[r]
    for (let i = 0; i < route.length - 1; i++) {
      for (let j = i + 1; j < route.length; j++) {
        const cand = clone(routes)
        cand[r] = [...route.slice(0, i), ...route.slice(i, j + 1).reverse(), ...route.slice(j + 1)]
        if (cost(robots, tasks, cand) < base - EPS) return cand
      }
    }
  }

  // relocate: move one task to any position of any route
  for (let a = 0; a < routes.length; a++) {
    for (let i = 0; i < routes[a].length; i++) {
      const task = routes[a][i]
      for (let b = 0; b < routes.length; b++) {
        const removed = clone(routes)
        removed[a].splice(i, 1)
        for (let pos = 0; pos <= removed[b].length; pos++) {
          if (a === b && pos === i) continue
          const cand = clone(removed)
          cand[b].splice(pos, 0, task)
          if (cost(robots, tasks, cand) < base - EPS) return cand
        }
      }
    }
  }

  // swap: exchange two tasks between different routes
  for (let a = 0; a < routes.length; a++) {
    for (let b = a + 1; b < routes.length; b++) {
      for (let i = 0; i < routes[a].length; i++) {
        for (let j = 0; j < routes[b].length; j++) {
          const cand = clone(routes)
          const tmp = cand[a][i]
          cand[a][i] = cand[b][j]
          cand[b][j] = tmp
          if (cost(robots, tasks, cand) < base - EPS) return cand
        }
      }
    }
  }

  return null
}

function localSearch(robots: Point[], tasks: Point[], seed: number[][]): number[][] {
  let routes = clone(seed)
  for (let guard = 0; guard < 10_000; guard++) {
    const next = improvingMove(robots, tasks, routes)
    if (!next) break
    routes = next
  }
  return routes
}

function cheapestInsertion(robots: Point[], tasks: Point[]): number[][] {
  let routes: number[][] = robots.map(() => [])
  for (let t = 0; t < tasks.length; t++) {
    let best: number[][] | null = null
    let bestCost = Infinity
    for (let r = 0; r < routes.length; r++) {
      for (let pos = 0; pos <= routes[r].length; pos++) {
        const cand = clone(routes)
        cand[r].splice(pos, 0, t)
        const c = cost(robots, tasks, cand)
        if (c < bestCost) {
          bestCost = c
          best = cand
        }
      }
    }
    if (best) routes = best
  }
  return routes
}

/**
 * Optimized dispatch. Local search runs from two seeds (cheapest insertion and
 * the naive plan), so the result is never worse than the naive plan.
 */
export function dispatchOptimized(robots: Point[], tasks: Point[]): Plan {
  if (robots.length === 0) return evaluate(robots, tasks, [])
  const fromInsertion = localSearch(robots, tasks, cheapestInsertion(robots, tasks))
  const fromNaive = localSearch(robots, tasks, dispatchNaive(robots, tasks).routes)
  const best =
    cost(robots, tasks, fromInsertion) <= cost(robots, tasks, fromNaive) ? fromInsertion : fromNaive
  return evaluate(robots, tasks, best)
}
