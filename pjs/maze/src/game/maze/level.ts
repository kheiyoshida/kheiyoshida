import { MazeGrid } from '../../core/level/grid.ts'
import { buildMazeGrid, MazeGridParams } from '../../core/level/builder'
import { ModelingStyle } from './physical/modelingStyle.ts'
import { PhysicalMazeGrid } from './physical/grid.ts'

export class MazeLevel {
  public constructor(
    public readonly grid: MazeGrid,
    public readonly physicalGrid: PhysicalMazeGrid
  ) {}

  static build(params: MazeGridParams, style: ModelingStyle): MazeLevel {
    const grid = buildMazeGrid(params)
    const physicalGrid = PhysicalMazeGrid.convert(grid, style)
    return new MazeLevel(buildMazeGrid(params), physicalGrid)
  }
}
