import { ScaffoldValues } from './types'
import { FloorLength, PathLength, WallHeight } from '../../../config'
import { ScaffoldParams } from '../../../domain/stats'

export const calcConcreteScaffoldValues = (params: ScaffoldParams): ScaffoldValues => ({
  floor: FloorLength * params.corridorWidthLevel,
  path: PathLength * params.corridorLengthLevel,
  wall: WallHeight * params.wallHeightLevel,
  distortionRange: params.distortionLevel,
})