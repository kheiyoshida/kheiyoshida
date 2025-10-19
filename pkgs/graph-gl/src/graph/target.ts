import { FrameBuffer } from '../gl'

export interface RenderTarget {}

export interface DrawTarget extends RenderTarget {
  frameBuffer: FrameBuffer
}
