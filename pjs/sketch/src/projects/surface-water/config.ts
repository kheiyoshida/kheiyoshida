import { FFTSize } from 'p5utils/src/media/audio/types'
import { MediaSize } from 'p5utils/src/media/pixel/types'

export const CanvasSize = 900 *3
export const CanvasMediaSize: MediaSize = { width: CanvasSize, height: CanvasSize }

export const DefaultGrayValue = 40
export const DrawIndicateValue = 0
export const DrawGrayValue = 255

export const ShiftRange = CanvasSize / 7
export const ShiftChangeRate = 0.00001

export const NoiseLevel = 10
export const NoiseSwitchRate = 0.00003

export const fftSize: FFTSize = 256
export const MaximumSnapshots = 30
export const BaseRadius = CanvasSize / 4 / MaximumSnapshots