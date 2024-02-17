import { FFTSize } from "p5utils/src/media/audio/types"

export const MOBILE_WIDTH = 800

export const fftSize: FFTSize = 32

export const MoveThreshold = 20

export const Config = {
  InitialMaxNodes: fftSize * 2,
  InitialGrowDimensions: 3,
  DefaultMoveAmount: 100,
  DefaultMovableDistance: 100 * 3,
  DecreaseSpeed: 10,
  CameraMoveSpeed: 100,
  CameraDefaultMoveSpeed: 10,
  CameraDecreaseSpeed: 2
} as const
