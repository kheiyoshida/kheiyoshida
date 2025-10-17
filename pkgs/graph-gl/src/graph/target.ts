import { FrameBuffer } from '../gl/frameBuffer'

export interface RenderTarget {}

export interface DrawTarget extends RenderTarget {
  frameBuffer: FrameBuffer
}

export interface DrawPixelTarget extends DrawTarget {
  pixelDataArray: Uint8Array
}
