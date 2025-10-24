export * from './frame'
export * from '../game/status/constants.ts'

export const ww = window.innerWidth
export const wh = window.innerHeight

export const logicalWidth = Math.floor(Math.max(480, window.innerWidth / 2.5))
export const logicalHeight = Math.floor(logicalWidth * (window.innerHeight / window.innerWidth))

export const logicalCenterX = logicalWidth / 2
export const logicalCenterY = logicalHeight / 2

export const MobileWidth = 800
export const IsMobile = window.innerWidth < MobileWidth

export const mapSizing = IsMobile ? 0.88 : 0.6

export const FOV = IsMobile ? 120 : 80

export const FloorLength = 400
export const PathLength = 600
export const WallHeight = 400
export const FloorPathAvgLength = (FloorLength + PathLength) / 2

export const CameraZ = IsMobile ? FloorLength / 12 : FloorLength / 8

export const MaxDistortionSpeed = 10
export const MaxDistortionRange = 0.4

const ModelGridLength = 6
export const MaxVisibleLength = FloorPathAvgLength * (ModelGridLength)

export const DefaultGoFrames = 8
export const DefaultTurnFrames = 4
export const GoDownstairsFramesLength = 32

/**
 * the maximum rooms in a row/col in a floor
 */
export const MaxFloorSize = 13
