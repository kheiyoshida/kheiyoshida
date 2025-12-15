import { MazeGrid } from '../../core/level/grid.ts'
import { buildMazeGrid, BuildMazeGridParams } from '../../core/level/builder'
import { PhysicalMazeGrid } from './physical/grid.ts'
import { StructureContext } from '../world/types.ts'
import { getPhysicalStairType } from './physical/stair.ts'
import { IWorldState } from '../world/state.ts'

export class MazeLevel {
  public constructor(
    public readonly grid: MazeGrid,
    public readonly physicalGrid: PhysicalMazeGrid // TODO: consider moving this down to integration layer
  ) {}

  static build(
    params: BuildMazeGridParams,
    structureContext: StructureContext,
    worldState: IWorldState
  ): MazeLevel {
    const grid = buildMazeGrid(params)

    const physicalStairType = getPhysicalStairType(structureContext.current, structureContext.next!)
    const physicalGrid = PhysicalMazeGrid.convert(grid, structureContext.current, physicalStairType, worldState)
    return new MazeLevel(grid, physicalGrid)
  }
}
