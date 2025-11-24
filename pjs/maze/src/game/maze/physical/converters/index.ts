import { MazeGrid } from '../../../../core/level/grid.ts'
import { PhysicalMazeGrid } from '../grid.ts'
import { classicGridConverter } from './classic.ts'
import { polesGridConverter } from './poles.ts'
import { tilesGridConverter } from './tiles.ts'
import { Structure } from '../../../world'
import { PhysicalStairType } from '../stair.ts'
import { floatingBoxConverter } from './floatingBox.ts'

export type GridConverter = (grid: MazeGrid, stairType: PhysicalStairType) => PhysicalMazeGrid

export const gridConverterMap: Record<Structure, GridConverter> = {
  classic: classicGridConverter,
  poles: polesGridConverter,
  tiles: tilesGridConverter,
  floatingBox: floatingBoxConverter,
}
