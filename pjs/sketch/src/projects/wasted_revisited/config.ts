import { FFTSize } from "p5utils/src/media/audio/types"

export const fftSize: FFTSize = 32

export const Config = {
  InitialMaxNodes: fftSize * 3,
  DefaultMoveAmount: 200,
  DefaultMovableDistance: 600,
  DecreaseSpeed: 10
} as const
