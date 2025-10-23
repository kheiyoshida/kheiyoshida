import { MazeGrid } from '../grid.ts'
import { distance, equals, getPositionInDirection, Position2D } from '../../utils/grid/position2d.ts'
import { NESW } from '../../utils/direction.ts'
import { fireByRate } from 'utils'

// todo: improve performance
class PositionSet {
  private positions: Position2D[]

  constructor(initialPositions: Position2D[] = []) {
    this.positions = initialPositions
  }

  add(pos: Position2D) {
    if (this.has(pos)) return
    this.positions.push(pos)
  }

  has(pos: Position2D) {
    return this.positions.find((p) => equals(p, pos))
  }

  iterator() {
    return this.positions[Symbol.iterator]()
  }
}

export const connectCells = (grid: MazeGrid, connRate: number): void => {
  const clusters = clusterizeCells(grid, connRate)
  connectClusters(grid, clusters)
}

/**
 * connect adjacent floor cells as clusters
 */
const clusterizeCells = (grid: MazeGrid, connRate: number): PositionSet[] => {
  const clusters: PositionSet[] = []
  grid.iterateItems((_, pos) => {
    const cluster = clusters.find((c) => c.has(pos))
    if (!cluster) {
      clusters.push(new PositionSet([pos]))
    }
    for (const adjPos of getAllAdjacentPositions(grid, pos)) {
      if (!fireByRate(connRate)) return

      grid.connect(pos, adjPos)

      if (cluster && !cluster.has(pos)) {
        cluster.add(adjPos)
      }
    }
  })
  return clusters

  function* getAllAdjacentPositions(grid: MazeGrid, pos: Position2D): Generator<Position2D> {
    for (const dir of NESW) {
      const adjacentPos = getPositionInDirection(pos, dir, 2) // floors are even numbered
      if (grid.get(adjacentPos)) yield adjacentPos
    }
  }
}

/**
 * connect clusters by connecting distant nodes in different clusters
 */
const connectClusters = (grid: MazeGrid, clusters: PositionSet[]): void => {
  if (!clusters.length) throw Error(`empty clusters`)
  const mainCluster = clusters.pop()!
  while (clusters.length > 0) {
    const anotherCluster = clusters.pop()!
    const [from, to] = shortestPathBetweenClusters(mainCluster, anotherCluster)
    const path = grid.connect(from, to)
    for (const pos of path) {
      mainCluster.add(pos)
    }
    for (const pos of anotherCluster.iterator()) {
      mainCluster.add(pos)
    }
  }
}

/**
 * find the shortest path from a cluster to another
 */
const shortestPathBetweenClusters = (
  mainCluster: PositionSet,
  anotherCluster: PositionSet
): [Position2D, Position2D] => {
  let shortestDistance = Number.POSITIVE_INFINITY
  let from: Position2D | undefined
  let to: Position2D | undefined
  for (const mcPos of mainCluster.iterator()) {
    for (const acPos of anotherCluster.iterator()) {
      // todo: avoid connecting odd numbered positions
      const dist = distance(mcPos, acPos)
      if (dist < shortestDistance) {
        shortestDistance = dist
        from = mcPos
        to = acPos
      }
    }
  }
  return [from!, to!]
}
