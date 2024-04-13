import { ScaffoldValues } from './types'
import { FloorLength, PathLength, WallHeight } from '../../../config'
import { ScaffoldParams } from '../../../domain/translate'

export const calcConcreteScaffoldValues = (params: ScaffoldParams): ScaffoldValues => {
  const lengths = {
    floor: FloorLength * params.corridorWidthLevel,
    path: PathLength * params.corridorLengthLevel,
    wall: WallHeight * params.wallHeightLevel,
  }
  return {
    ...lengths,
    distortionRange: params.distortionLevel * (lengths.floor / 4),
    distortionSpeed: params.distortionLevel * 10
  }
}
