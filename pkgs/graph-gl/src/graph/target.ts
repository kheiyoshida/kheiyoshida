import { FrameBuffer } from '../gl'

export interface RenderTarget {}

export interface DrawTarget extends RenderTarget {
  frameBuffer: FrameBuffer
}

export class DrawRTHandle implements DrawTarget {
  constructor(public readonly frameBuffer: FrameBuffer) {}
}
