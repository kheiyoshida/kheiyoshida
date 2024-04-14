import { Direction, compass } from '../../interface/maze/direction'
import { Node } from '../../../store/entities/matrix/node'

export type PathSpec = [PathNode, PathNode, PathNode]
export type PathNode = NodeSpec | null
export type NodeSpec = {
  terrain: Terrain
  stair?: boolean
}

export type Terrain = { [k in TerrainPerspective]: TerrainPattern }
export type TerrainPerspective = 'left' | 'right' | 'front'
export type TerrainPattern = 'wall' | 'corridor'

const detectPathPattern = (reachable: boolean): TerrainPattern => (reachable ? 'corridor' : 'wall')

const getTerrain = (direction: Direction, node: Node): Terrain => ({
  front: detectPathPattern(node.edges[direction]),
  left: detectPathPattern(node.edges[compass('l', direction)]),
  right: detectPathPattern(node.edges[compass('r', direction)]),
})

export const toPathSpec =
  (direction: Direction) =>
  (nodes: Node[]): PathSpec =>
    Array(3)
      .fill(null)
      .map((n, i) => (nodes[i] ? toNodeSpec(direction)(nodes[i]) : n))
      .reverse() as PathSpec

export const toNodeSpec =
  (direction: Direction) =>
  (node: Node): NodeSpec => ({
    terrain: getTerrain(direction, node),
    stair: node.stair,
  })
