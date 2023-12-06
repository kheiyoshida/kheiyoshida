import { pointLine } from 'src/lib/p5utils'
import { distortedMidPoints, distributedPath } from '../helpers/helpers'
import { LayerDrawer, LineDrawer, PathDrawer, SpecDrawer } from '../types'
import { layerDrawerFactory, specDrawerFactory } from './factory'

export const alternatePath: PathDrawer = (path) =>
  path.forEach((m, i, a) => {
    if (i % 2 === 0) {
      pointLine(m, a[i + 1])
    }
  })

export const alternatePathDrawFactory =
  (line: LineDrawer): PathDrawer =>
  (path) => {
    path.forEach((m, i, a) => {
      if (i % 2 === 0) {
        line(m, a[i + 1])
      }
    })
  }

/**
 * randomly omit some bits of line by the amount of defined percent
 */
export const omittedPath =
  (percent: number): PathDrawer =>
  (path) =>
    distributedPath(path, percent).forEach(alternatePath)

export const omittedDistortedPath =
  (percent: number, distortion: number): PathDrawer =>
  (path) =>
    distributedPath(path, percent, distortedMidPoints(distortion)).forEach(
      alternatePath
    )

export const omittedSpec = (percent: number): SpecDrawer =>
  specDrawerFactory(omittedPath(percent))

export const omittedLayer = (percent: number): LayerDrawer =>
  layerDrawerFactory(specDrawerFactory(omittedPath(percent)))
