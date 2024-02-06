import { FFTSize } from "p5utils/src/media/audio/types"

export const fftSize: FFTSize = 32

export const MoveThreshold = 20

export const Config = {
  InitialMaxNodes: fftSize * 3,
  DefaultMoveAmount: 200,
  DefaultMovableDistance: 600,
  DecreaseSpeed: 10,
  CameraMoveSpeed: 100,
  CameraDefaultMoveSpeed: 1,
  CameraDecreaseSpeed: 2
} as const
