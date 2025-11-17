import { MazeGrid } from '../../../../core/level/grid.ts'
import { PhysicalMazeGrid } from '../grid.ts'
import { classicGridConverter } from './classic.ts'
import { polesGridConverter } from './poles.ts'
import { tilesGridConverter } from './tiles.ts'
import { Structure } from '../../../world'

export type GridConverter = (grid: MazeGrid) => PhysicalMazeGrid

export const gridConverterMap: Record<Structure, GridConverter> = {
  classic: classicGridConverter,
  poles: polesGridConverter,
  tiles: tilesGridConverter,
}
