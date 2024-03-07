import { ListenableState, Vision } from '.'
import { normalSceneProvider } from './color'
import { normalDraw } from './draw'
import * as finalizer from './drawSpec'
import { highWallFrameProvider, normalFrameProvider } from './frame'
import { VisionStrategy } from './strategy'

export type VisionProvider = (state: ListenableState) => Vision

const normalVision: VisionProvider = (state: ListenableState) => ({
  frames: normalFrameProvider(state),
  draw: normalDraw(state),
  finalize: finalizer.wall,
  renewColors: normalSceneProvider(state),
})

const floorlVision: VisionProvider = (state: ListenableState) => ({
  frames: normalFrameProvider(state),
  draw: normalDraw(state),
  finalize: finalizer.floor,
  renewColors: normalSceneProvider(state),
})

const highWallVision: VisionProvider = (state: ListenableState) => ({
  frames: highWallFrameProvider(state),
  draw: normalDraw(state),
  finalize: finalizer.highWall,
  renewColors: normalSceneProvider(state),
})

export const VisionProviderMap: { [s in VisionStrategy]: VisionProvider } = {
  normal: normalVision,
  floor: floorlVision,
  highWall: highWallVision,
}
