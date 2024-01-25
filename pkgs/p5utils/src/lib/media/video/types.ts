import { MediaElement } from 'p5'

export type p5VideoElement = MediaElement & {
  loadPixels: () => void
  pixels: Uint8ClampedArray
}

export type VideoSource = string
export type GetVideoSource = () => VideoSource
export type VideoSourceList = VideoSource[]

export interface SupplyVideoOption {
  speed: number
}

export interface ParseVideoOption {
  resolution: number
}
