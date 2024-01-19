import { pointLine } from 'p5utils/src/lib/p5utils'
import { distortedMidPoints, distributedPath } from '../helpers/helpers'
import { PathDrawer, SpecDrawer } from '../types'
import { pathDrawerFactory, specDrawerFactory } from './factory'

export const distortedPath =
  (rate: number): PathDrawer =>
  (path) =>
    distributedPath(path, rate, distortedMidPoints(rate)).forEach(
      pathDrawerFactory(pointLine)
    )

export const distortedSpec = (rate: number): SpecDrawer =>
  specDrawerFactory(distortedPath(rate))
