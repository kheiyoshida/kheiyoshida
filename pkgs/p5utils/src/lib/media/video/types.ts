import { MediaElement } from 'p5'

export type p5VideoElement = MediaElement & {
  loadPixels: () => void
  pixels: Uint8ClampedArray
}

export type VideoSize = { width: number, height: number }

export type VideoSource = string
export type GetVideoSource = () => VideoSource
export type VideoSourceList = VideoSource[]

export type SupplyVideo = () => p5VideoElement

export interface SupplyVideoOption {
  speed: number
}

export interface ParseVideoOption {
  resolution: number
}

export type ParseVideo = (
  video: p5VideoElement,

  resolution: number
) => VideoSnapshot

export type MediaSize = {
  width: number
  height: number
}

export type PixelPosition = {
  x: number,
  y: number
}

export type VideoSnapshot = {
  matrix: RGBAMatrix
  size: MediaSize
}
