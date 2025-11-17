import { MazeGrid } from '../../core/level/grid.ts'
import { buildMazeGrid, MazeGridParams } from '../../core/level/builder'
import { PhysicalMazeGrid } from './physical/grid.ts'
import { Structure, World } from '../world'
import { getPhysicalStairType } from './physical/stair.ts'

export class MazeLevel {
  public constructor(
    public readonly grid: MazeGrid,
    public readonly physicalGrid: PhysicalMazeGrid // TODO: consider moving this down to integration layer
  ) {}

  static build(params: MazeGridParams, structure: Structure, nextStructure: Structure): MazeLevel {
    const grid = buildMazeGrid(params)

    const physicalStairType = getPhysicalStairType(structure, nextStructure)
    const physicalGrid = PhysicalMazeGrid.convert(grid, structure, physicalStairType)
    return new MazeLevel(grid, physicalGrid)
  }
}

export type LevelDefinition = {
  params: MazeGridParams
  world: World
}
