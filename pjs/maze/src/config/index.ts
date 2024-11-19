export * from './frame'
export * from './status'

export const ww = window.innerWidth
export const wh = window.innerHeight

export const MobileWidth = 800
export const IsMobile = window.innerWidth < MobileWidth

export const mapSizing = IsMobile ? 0.88 : 0.6

export const FOV = IsMobile ? 120 : 60

export const FloorLength = 400
export const PathLength = 600
export const WallHeight = 400
export const FloorPathAvgLength = (FloorLength + PathLength) / 2

export const CameraZ = IsMobile ? FloorLength / 6 : FloorLength / 2
export const CameraLookAhead = FloorLength

export const MaxDistortionSpeed = 10
export const MaxDistortionRange = 0.4

const ModelGridLength = 6
export const MaxVisibleLength = FloorPathAvgLength * ModelGridLength

export const DefaultGoFrames = 8
export const DefaultTurnFrames = 4
export const DownFramesLength = 32
