import { MazeGrid } from '../../core/level/grid.ts'
import { buildMazeGrid, MazeGridParams } from '../../core/level/builder'
import { PhysicalMazeGrid } from './physical/grid.ts'
import { Structure } from '../world'

export class MazeLevel {
  public constructor(
    public readonly grid: MazeGrid,
    public readonly physicalGrid: PhysicalMazeGrid // TODO: consider moving this down to integration layer
  ) {}

  static build(params: MazeGridParams, style: Structure): MazeLevel {
    const grid = buildMazeGrid(params)
    const physicalGrid = PhysicalMazeGrid.convert(grid, style)
    return new MazeLevel(grid, physicalGrid)
  }
}
