import { FFTSize } from 'p5utils/src/media/audio/types'
import { MediaSize } from 'p5utils/src/media/pixel/types'

export const CanvasSize = 900 *3
export const CanvasMediaSize: MediaSize = { width: CanvasSize, height: CanvasSize }

export const DefaultGrayValue = 20
export const DrawIndicateValue = 0
export const DrawGrayValue = 255

export const ShiftRange = 3
export const ShiftChangeRate = 0.000001 * 5

export const NoiseLevel = 30
export const NoiseSwitchRate = 0.000003

export const fftSize: FFTSize = 256
export const MaximumSnapshots = 30
export const BaseRadius = CanvasSize / 4.5 / MaximumSnapshots