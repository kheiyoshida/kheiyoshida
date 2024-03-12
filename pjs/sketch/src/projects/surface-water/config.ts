import { FFTSize } from 'p5utils/src/media/audio/types'
import { MediaSize } from 'p5utils/src/media/pixel/types'

export const CanvasSize = 900
export const CanvasMediaSize: MediaSize = { width: CanvasSize, height: CanvasSize }

export const DefaultGrayValue = 20
export const DrawIndicateValue = 0
export const DrawGrayValue = 120

export const ShiftRange = 10
export const ShiftChangeRate = 0.000001 * 1

export const NoiseLevel = 20
export const NoiseSwitchRate = 0.03

export const fftSize: FFTSize = 128
export const MaximumSnapshots = 50
export const BaseRadius = CanvasSize / 1 / MaximumSnapshots
