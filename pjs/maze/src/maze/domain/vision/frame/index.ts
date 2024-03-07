import { ListenableState } from '..'
import { DrawPoint } from '../draw/types'
import { VisionStrategy } from '../strategy'
import { FramesMaker, highDistortedNarrow, highRoofDistortedNarrow } from './framesMaker'

export type Frame = {
  tl: DrawPoint
  tr: DrawPoint
  bl: DrawPoint
  br: DrawPoint
}

export type FrameProvider = (state: ListenableState) => FramesMaker

const dist = (sanity: number) => (100 - sanity) * 0.0005

const narrow = (sanity: number, stamina: number) => (200 - sanity - stamina) * 0.005

const up = (stamina: number) => (100 - stamina) * 0.01

const long = (stamina: number) => (100 - stamina) * 0.01

export type FrameMakerParams = {
  dist: number
  narrow: number
  up: number
  long: number
}

export const calcFrameProviderParams = ({ sanity, stamina }: ListenableState) => {
  return {
    dist: dist(sanity),
    up: up(stamina),
    long: long(stamina),
    narrow: narrow(sanity, stamina),
  }
}

export const consumeFrameMakerParams = (strategy: VisionStrategy ,params: FrameMakerParams) => {
  if (strategy === VisionStrategy.normal) return highDistortedNarrow(params)
  if (strategy === VisionStrategy.floor) return highDistortedNarrow(params)
  if (strategy === VisionStrategy.highWall) return highRoofDistortedNarrow(params)
  throw Error()
}
