import { MazeGrid } from '../../../../core/level/grid.ts'
import { PhysicalMazeGrid } from '../grid.ts'
import { classicGridConverter } from './classic.ts'
import { polesGridConverter } from './poles.ts'
import { tilesGridConverter } from './tiles.ts'
import { Structure } from '../../../world/types.ts'
import { PhysicalStairType } from '../stair.ts'
import { floatingBoxConverter } from './floatingBox.ts'
import { stackableBoxConverter } from './stackableBox.ts'

export type GridConverter = (
  grid: MazeGrid,
  params: PhysicalGridParams
) => PhysicalMazeGrid

export type PhysicalGridParams = {
  stairType: PhysicalStairType
  gravity: number
  density: number
}

export const gridConverterMap: Record<Structure, GridConverter> = {
  classic: classicGridConverter,
  poles: polesGridConverter,
  tiles: tilesGridConverter,
  floatingBoxes: floatingBoxConverter,
  stackedBoxes: stackableBoxConverter
}
