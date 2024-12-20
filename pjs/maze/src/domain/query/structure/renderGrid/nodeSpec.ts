import { Direction, getTurnedDirection } from '../../../../utils/direction.ts'
import { Node } from '../../../../store/entities/matrix/node.ts'
import { getStairAnimation } from '../../movement/stairs.ts'

export type PathSpec = [n0: PathNode, n1: PathNode, n2: PathNode]
export type PathNode = NodeSpec | null
export type NodeSpec = {
  terrain: Terrain
  stair?: StairType | null
}

type StairType = 'stair' | 'warp'

export type Terrain = { [k in TerrainPerspective]: TerrainPattern }
export type TerrainPerspective = 'left' | 'right' | 'front'
export type TerrainPattern = 'wall' | 'corridor'

const detectPathPattern = (reachable: boolean): TerrainPattern => (reachable ? 'corridor' : 'wall')

const getTerrain = (direction: Direction, node: Node): Terrain => ({
  front: detectPathPattern(node.edges[direction]),
  left: detectPathPattern(node.edges[getTurnedDirection('left', direction)]),
  right: detectPathPattern(node.edges[getTurnedDirection('right', direction)]),
})

export const toPathSpec =
  (direction: Direction) =>
  (nodes: Node[]): PathSpec =>
    Array(3)
      .fill(null)
      .map((n, i) => (nodes[i] ? toNodeSpec(direction)(nodes[i]) : n)) as PathSpec

export const toNodeSpec =
  (direction: Direction) =>
  (node: Node): NodeSpec => ({
    terrain: getTerrain(direction, node),
    stair: node.stair ? getStairType() : null,
  })

const getStairType = (): StairType => {
  return getStairAnimation().goDownstairs === 'warp' ? 'warp' : 'stair'
}
