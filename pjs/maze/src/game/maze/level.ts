import { MazeGrid } from '../../core/level/grid.ts'
import { buildMazeGrid, BuildMazeGridParams } from '../../core/level/builder'
import { PhysicalMazeGrid } from './physical/grid.ts'
import { StructureContext } from '../world'
import { getPhysicalStairType } from './physical/stair.ts'

export class MazeLevel {
  public constructor(
    public readonly grid: MazeGrid,
    public readonly physicalGrid: PhysicalMazeGrid // TODO: consider moving this down to integration layer
  ) {}

  static build(params: BuildMazeGridParams, structureContext: StructureContext): MazeLevel {
    const grid = buildMazeGrid(params)

    const physicalStairType = getPhysicalStairType(structureContext.current, structureContext.next!)
    const physicalGrid = PhysicalMazeGrid.convert(grid, structureContext.current, physicalStairType)
    return new MazeLevel(grid, physicalGrid)
  }
}
