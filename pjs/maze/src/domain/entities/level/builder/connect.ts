import { MazeGrid } from '../grid.ts'
import { distance, Position2D } from '../../utils/grid/position2d.ts'
import { PositionSet } from './set.ts'

/**
 * connect cells so that each cell has at least one path to every other cell
 * based on Kruskal's algorithm
 * @param grid
 * @param connRate
 */
export const connectCells = (grid: MazeGrid, connRate: number): void => {
  const clusters: PositionSet[] = []
  grid.iterateItems((_, pos) => clusters.push(new PositionSet([pos])))
  connectClusters(grid, clusters)
}

/**
 * connect clusters by connecting distant nodes in different clusters
 */
const connectClusters = (grid: MazeGrid, clusters: PositionSet[]): void => {
  if (!clusters.length) throw Error(`empty clusters`)
  const mainCluster = clusters.pop()!
  while (clusters.length > 0) {
    const anotherCluster = clusters.pop()!
    const { from, to } = shortestPathBetweenClusters(mainCluster, anotherCluster)
    grid.connect(from, to)
    for (const pos of anotherCluster.iterator()) {
      mainCluster.add(pos)
    }
  }
}

type PathData = {
  from: Position2D
  to: Position2D
  distance: number
}

/**
 * find the shortest path from a cluster to another
 */
const shortestPathBetweenClusters = (
  mainCluster: PositionSet,
  anotherCluster: PositionSet
): PathData => {
  let shortestDistance = Number.POSITIVE_INFINITY
  let from: Position2D | undefined
  let to: Position2D | undefined
  for (const mcPos of mainCluster.iterator()) {
    for (const acPos of anotherCluster.iterator()) {
      const dist = distance(mcPos, acPos)
      if (dist < shortestDistance) {
        shortestDistance = dist
        from = mcPos
        to = acPos
      }
    }
  }
  return { from: from!, to: to!, distance: shortestDistance }
}
