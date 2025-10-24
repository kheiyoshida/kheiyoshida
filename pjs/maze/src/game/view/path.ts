import { Direction, getTurnedDirection } from '../../core/grid/direction.ts'
import { Block } from '../../core/level/legacy/block.ts'
import { StairType } from '../maze/object.ts'

export type PathSpec = [b0: PathSpecItem, b1: PathSpecItem, b2: PathSpecItem]
export type PathSpecItem = BlockTerrainSpec | null
export type BlockTerrainSpec = {
  terrain: Terrain
  stair?: StairType | null
}

export type Terrain = { [k in TerrainPerspective]: TerrainPattern }
export type TerrainPerspective = 'left' | 'right' | 'front'
export type TerrainPattern = 'wall' | 'corridor'

export const toPathSpec = (path: Block[], direction: Direction): PathSpec =>
  [...Array(3)].map((_, i) => (path[i] ? toBlockTerrainSpec(path[i], direction) : null)) as PathSpec

const toBlockTerrainSpec = (node: Block, direction: Direction): BlockTerrainSpec => ({
  terrain: getTerrain(direction, node),
  stair: node.stair?.type || null,
})

const getTerrain = (direction: Direction, node: Block): Terrain => ({
  front: detectPathPattern(node.edges[direction]),
  left: detectPathPattern(node.edges[getTurnedDirection('left', direction)]),
  right: detectPathPattern(node.edges[getTurnedDirection('right', direction)]),
})

const detectPathPattern = (reachable: boolean): TerrainPattern => (reachable ? 'corridor' : 'wall')
