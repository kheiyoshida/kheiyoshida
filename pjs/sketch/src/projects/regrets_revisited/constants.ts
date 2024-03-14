import { FFTSize } from 'p5utils/src/media/audio/types'
import { clamp } from 'utils'

export const MOBILE_WIDTH = 800
export const SightLength = 8000

export const fftSize: FFTSize = 64
export const TotalScaffoldLayers = fftSize / 2
export const TotalScaffoldLayerX = 8
export const TotalScaffoldLayerY = 12

const MaxScaffoldRadius = SightLength / 2
export const ScaffoldLayerDistance = MaxScaffoldRadius / TotalScaffoldLayers
export const VisibleAngle = clamp(60 * (MOBILE_WIDTH / window.innerWidth), 70, 90)

export const DataCutoff = 0.4

export const BackgroundGray = 230

export const CameraDefaultMoveSpeed = 10

const CameraDistanceDesktop = [MaxScaffoldRadius / 4, MaxScaffoldRadius * 1.5, MaxScaffoldRadius]
const CameraDistanceMobile = CameraDistanceDesktop.map((val) => val)

export const CameraDistance =
  window.innerWidth > MOBILE_WIDTH ? CameraDistanceDesktop : CameraDistanceMobile
