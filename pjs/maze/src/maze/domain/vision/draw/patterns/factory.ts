import { pointLine } from 'p5utils/src/lib/p5utils'
import {
  GridDrawerFactory,
  LayerDrawerFactory,
  LineDrawer,
  PathDrawer,
  PathDrawerFactory,
  SpecDrawer,
  SpecDrawerFactory,
} from '../types'

export const pathDrawerFactory: PathDrawerFactory =
  (fn: LineDrawer = pointLine): PathDrawer =>
  (path) => {
    path.forEach((_, i, p) => {
      if (i < p.length - 1) {
        fn(p[i], p[i + 1])
      }
    })
  }

export const specDrawerFactory: SpecDrawerFactory =
  (pathDrawer = pathDrawerFactory()): SpecDrawer =>
  (spec, _si) =>
    spec.forEach(pathDrawer)

export const layerDrawerFactory: LayerDrawerFactory =
  (specDrawer = specDrawerFactory()) =>
  (layer, _li) =>
    layer.forEach((spec, si) => specDrawer(spec, si))

export const gridDrawerFactory: GridDrawerFactory =
  (layerDrawer = layerDrawerFactory()) =>
  (grid) =>
    grid.reverse().forEach(layerDrawer)
