import {
  FloorLength,
  MaxDistortionRange,
  MaxDistortionSpeed,
  PathLength,
  WallHeight,
} from '../../../config'
import { ScaffoldParams } from '../../../domain/translate'
import { ScaffoldValues } from './types'

export const calcConcreteScaffoldValues = (params: ScaffoldParams): ScaffoldValues => {
  const lengths = {
    floor: FloorLength * params.corridorWidthLevel,
    path: PathLength * params.corridorLengthLevel,
    wall: WallHeight * params.wallHeightLevel,
  }
  return {
    ...lengths,
    distortionRange: params.distortionLevel * lengths.floor * MaxDistortionRange,
    distortionSpeed: params.distortionLevel * MaxDistortionSpeed,
  }
}
