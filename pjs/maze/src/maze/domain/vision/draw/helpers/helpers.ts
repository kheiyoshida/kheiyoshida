import { randomBetween, randomIntBetween } from 'p5utils/src/lib/random'
import { toFloatPercent } from 'src/maze/utils'
import { DrawPath, DrawPoint } from '../types'

const getDiff = (p1: DrawPoint, p2: DrawPoint): [number, number] => [
  p2[0] - p1[0],
  p2[1] - p1[1],
]

const getLen = (p1: DrawPoint, p2: DrawPoint): number => {
  const [d1, d2] = getDiff(p1, p2)
  return Math.hypot(d1, d2)
}

type ManyPointsGenerator = (p1: DrawPoint, p2: DrawPoint) => DrawPoint[]

export const movePoint =
  (m: number) =>
  (center: DrawPoint, point: DrawPoint): DrawPoint => {
    const [dx, dy] = getDiff(center, point)
    const len = getLen(center, point)
    return [point[0] + len * m, point[1] + len * m]
  }

export const moveLine =
  (moveRate: number, center: [number, number]) =>
  (p1: DrawPoint, p2: DrawPoint): [DrawPoint, DrawPoint] => {
    const move = Math.min(toFloatPercent(moveRate), 0.05)
    const m = randomBetween(-move, move)
    return [movePoint(m)(center, p1), movePoint(m)(center, p2)]
  }

export const movedPath =
  (moveRate: number, center: [number, number]) =>
  (path: DrawPath): DrawPath => {
    const move = Math.min(toFloatPercent(moveRate), 1) / 2
    const m = randomBetween(-move, move)
    return path.map(p => movePoint(m)(center, p))
  }

export const midPoints =
  (midPoints: number[]): ManyPointsGenerator =>
  (p1, p2) => {
    const [dx, dy] = getDiff(p1, p2)
    return midPoints.map((m) => [p1[0] + dx * m, p1[1] + dy * m])
  }

export const distortedMidPoints =
  (distortion: number) =>
  (midPoints: number[]): ManyPointsGenerator =>
  (p1, p2) => {
    const [dx, dy] = getDiff(p1, p2)
    const len = Math.hypot(dx, dy)
    const dist = toFloatPercent(distortion / 10 / 2)
    return midPoints.map((m) => [
      p1[0] + dx * m + len * randomBetween(-dist, dist),
      p1[1] + dy * m + len * randomBetween(-dist, dist),
    ])
  }

/**
 * distribute the percent of region as multiple range
 *
 * @param percentage the percentage that sum of the ranges should fill in 0 - 1 range
 * @returns array of ranges
 */
export const distribute = (percentage: number): [number, number][] => {
  if (percentage < 0 || percentage > 100) {
    throw Error(`distribution should be within 0% ~ 100%`)
  }
  const points = Array(100)
    .fill(null)
    .map((_, i) => i)
  const seeds = new Array(percentage)
    .fill(null)
    .map((_) => points.splice(randomIntBetween(0, points.length), 1)[0])
    .sort((a, b) => a - b)
    .map((s) => [s, s + 1])
    .reduce((p, c) => {
      if (!p.length) return [c]
      const [l0, l1] = p[p.length - 1]
      if (l1 === c[0]) return [...p.slice(0, p.length - 1), [l0, c[1]]]
      return [...p, c]
    }, [] as number[][])
  return seeds as [number, number][]
}

/**
 *
 * @param path original path
 * @param percentage distribution ratio
 * @returns
 */
export const distributedPath = (
  path: DrawPath,
  percentage: number,
  midFn = midPoints
): DrawPath[] => {
  return path.map((_, i, p) => {
    if (i < p.length - 1) {
      const [p1, p2] = [p[i], p[i + 1]]
      return [
        p1,
        ...distribute(percentage).flatMap(([m1, m2]) =>
          midFn([toFloatPercent(m1), toFloatPercent(m2)])(p1, p2)
        ),
        p2,
      ]
    } else {
      return []
    }
  })
}
