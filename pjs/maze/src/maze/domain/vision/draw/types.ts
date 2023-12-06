export type DrawPoint = [number, number]

export type DrawPath = DrawPoint[]

/**
 * actual draw points that drawer consume
 */
export type DrawSpec = DrawPath[]

export type DrawSpecLayer = DrawSpec[]

export type DrawSpecGrid = DrawSpecLayer[]

export type LineDrawer = (p1: DrawPoint, p2: DrawPoint) => void
export type PathDrawer = (path: DrawPath) => void
export type SpecDrawer = (spec: DrawSpec, specIndex: number) => void
export type LayerDrawer = (layer: DrawSpecLayer, layerIndex: number) => void
export type GridDrawer = (grid: DrawSpecGrid) => void

export type PathDrawerFactory = (lineDrawer?: LineDrawer) => PathDrawer

export type SpecDrawerFactory = (pathDrawer?: PathDrawer) => SpecDrawer

export type LayerDrawerFactory = (specDrawer?: SpecDrawer) => LayerDrawer

export type GridDrawerFactory = (layerDrawer?: LayerDrawer) => GridDrawer

export type DrawParams = {
  visibility: number,
  omitPercent: number,
  farAlpha: number,
  blurRate: number,
  distortion: number
}