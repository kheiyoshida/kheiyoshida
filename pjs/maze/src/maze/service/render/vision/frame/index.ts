import { ListenableState } from '../../../../domain/vision'
import { DrawPoint } from '../draw/types'
import { FrameMakerParams } from '../../../../domain/vision/frameMake'
import { VisionStrategy } from '../../../../domain/vision/strategy'
import { FramesMaker, highDistortedNarrow, highRoofDistortedNarrow } from './framesMaker'

export type Frame = {
  tl: DrawPoint
  tr: DrawPoint
  bl: DrawPoint
  br: DrawPoint
}

export type FrameProvider = (state: ListenableState) => FramesMaker

export const consumeFrameMakerParams = (strategy: VisionStrategy, params: FrameMakerParams) => {
  if (strategy === VisionStrategy.normal) return highDistortedNarrow(params)
  if (strategy === VisionStrategy.floor) return highDistortedNarrow(params)
  if (strategy === VisionStrategy.highWall) return highRoofDistortedNarrow(params)
  throw Error()
}
