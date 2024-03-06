import { Direction, compass } from '../../../domain/maze/direction'
import { Node } from '../../../domain/matrix/node'

/**
 * player's perspective
 */
export type TerrainPerspective = 'left' | 'right' | 'front'

/**
 * Left or Right perspective
 */
export type LeftRight = Exclude<TerrainPerspective, 'front'>

/**
 * if the next node is reachable it's wall
 * else wall
 */
export type TerrainPattern = 'wall' | 'corridor'

/**
 * terrain from the player's perspective
 */
export type Terrain = { [k in TerrainPerspective]: TerrainPattern }

/**
 * extracted data object to describe how the node look like from the player's view
 */
export type NodeSpec = {
  terrain: Terrain
  stair?: boolean
}

/**
 * representation for the available position in path.
 * it can be null if the node doesn't exist or not approachable
 */
export type PathNode = NodeSpec | null

/**
 * 3 nodes in front of the player
 * it should start from the furthest however long the path is
 */
export type PathSpec = [PathNode, PathNode, PathNode]

/**
 * detect path pattern
 */
const detectPattern = (reachable: boolean): TerrainPattern => (reachable ? 'corridor' : 'wall')

/**
 * get terrain
 */
const getTerrain = (d: Direction, node: Node): Terrain => ({
  front: detectPattern(node.edges[d]),
  left: detectPattern(node.edges[compass('l', d)]),
  right: detectPattern(node.edges[compass('r', d)]),
})

/**
 * convert matrix's nodes data into perspective
 */
export const toNodeSpec =
  (direction: Direction) =>
  (nodes: Node[]): PathSpec =>
    Array(3)
      .fill(null)
      .map((n, i) => (nodes[i] ? _toNodeSpec(direction)(nodes[i]) : n))
      .reverse() as PathSpec

export const _toNodeSpec =
  (direction: Direction) =>
  (node: Node): NodeSpec => ({
    terrain: getTerrain(direction, node),
    stair: node.stair,
  })
