import {
  FloorLength,
  MaxDistortionRange,
  MaxDistortionSpeed,
  PathLength,
  WallHeight,
} from '../../../config'
import { ScaffoldParams } from '../../../domain/query'
import { ScaffoldValues } from './types.ts'

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
