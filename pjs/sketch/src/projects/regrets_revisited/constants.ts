import { FFTSize } from 'p5utils/src/media/audio/types'

const MOBILE_WIDTH = 800
const SightLength = 8000

export const fftSize: FFTSize = 64
export const TotalScaffoldLayers = fftSize / 2
export const TotalScaffoldLayerX = 8
export const TotalScaffoldLayerY = 12

const MaxScaffoldRadius = SightLength / 2
export const ScaffoldLayerDistance = MaxScaffoldRadius / TotalScaffoldLayers

export const DataCutoff = 0.4

export const BackgroundGray = 230

export const CameraDefaultMoveSpeed = 10

const CameraDistanceDesktop = [MaxScaffoldRadius / 2, MaxScaffoldRadius * 2, MaxScaffoldRadius]
const CameraDistanceMobile = CameraDistanceDesktop.map((val) => val + 2000)

export const CameraDistance =
  window.innerWidth > MOBILE_WIDTH ? CameraDistanceDesktop : CameraDistanceMobile
