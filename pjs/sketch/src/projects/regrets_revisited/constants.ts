import { FFTSize } from 'p5utils/src/media/audio/types'

export const TotalScaffoldLayers = 32
export const TotalScaffoldLayerX = 6
export const TotalScaffoldLayerY = 6

export const ScaffoldLayerDistance = 100
export const InitialShrinkLevel = 500

export const fftSize: FFTSize = 64

export const BackgroundGray = 230

export const CameraDefaultMoveSpeed = 10
const MOBILE_WIDTH = 800
export const CameraDistance =
  window.innerWidth > MOBILE_WIDTH ? [2000, 6000, 3000] : [4000, 8000, 6000]
