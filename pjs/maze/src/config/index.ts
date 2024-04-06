export * from './frame'

export const ww = window.innerWidth
export const wh = window.innerHeight

export const MobileWidth = 800
export const IsMobile = window.innerWidth < MobileWidth

export const mapSizing = IsMobile ? 0.88 : 0.6

export const FovyValue = IsMobile ? 120 : 60

export const FloorLength = 400
export const PathLength = 800
export const WallHeight = 400
export const FloorPathAvgLength = (FloorLength + PathLength) / 2

export const CameraZ = IsMobile ? FloorLength / 6 : FloorLength / 2
export const CameraLookAhead = FloorLength