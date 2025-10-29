import { FloorLength, MaxDistortionRange, MaxDistortionSpeed, PathLength, WallHeight } from '../../../config'
import { ScaffoldValues } from './types.ts'
import { ScaffoldParams } from '../../../integration/query/structure/scaffold.ts'

export const calcConcreteScaffoldValues = (params: ScaffoldParams): ScaffoldValues => {
  const lengths = getConcreteLengths(params)
  return {
    ...lengths,
    distortionRange:
      (MaxDistortionRange / 2) * lengths.floor +
      params.distortionLevel * (MaxDistortionRange / 2) * lengths.floor,
    distortionSpeed: params.distortionLevel * MaxDistortionSpeed,
  }
}

export const getConcreteLengths = (params: ScaffoldParams) => ({
  floor: FloorLength * params.corridorWidthLevel,
  path: PathLength * params.corridorLengthLevel,
  wall: WallHeight * params.wallHeightLevel,
})
