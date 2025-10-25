import { ModelingStyle } from '../modelingStyle.ts'
import { MazeGrid } from '../../../../core/level/grid.ts'
import { PhysicalMazeGrid } from '../grid.ts'
import { classicGridConverter } from './classic.ts'

export type GridConverter = (grid: MazeGrid) => PhysicalMazeGrid

export const gridConverterMap: Record<ModelingStyle, GridConverter> = {
  classic: classicGridConverter,
  poles: function(grid: MazeGrid): PhysicalMazeGrid {
    throw new Error('Function not implemented.')
  },
  tiles: function(grid: MazeGrid): PhysicalMazeGrid {
    throw new Error('Function not implemented.')
  },
}
