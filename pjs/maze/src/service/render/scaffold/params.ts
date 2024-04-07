import { ScaffoldLengths } from '.'
import { FloorLength, PathLength, WallHeight } from '../../../config'
import { ScaffoldParams } from '../../../domain/stats'

export const calcAdjustedLength = (params: ScaffoldParams): ScaffoldLengths => ({
  floor: FloorLength * params.corridorWidthLevel,
  path: PathLength * params.corridorLengthLevel,
  wall: WallHeight * params.wallHeightLevel,
})