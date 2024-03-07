import { Conf } from '../../../../config'
import { distortedMidPoints, distributedPath, movedPath } from './helpers/helpers'
import { pathDrawerFactory, specDrawerFactory } from './patterns/factory'
import { alternatePath, omittedDistortedPath } from './patterns/omit'
import { SpecDrawer } from './types'

export const omittedBlurredSpec =
  (omitPercent: number, blurRate: number): SpecDrawer =>
  (spec) => {
    spec.forEach((path) => {
      const center: [number, number] = [Conf.ww / 2, Conf.wh / 2]
      distributedPath(movedPath(blurRate, center)(path), omitPercent).forEach(alternatePath)
    })
  }

export const omittedBlurredDistortedSpec =
  (omitPercent: number, blurRate: number, dist: number): SpecDrawer =>
  (spec) => {
    spec.forEach((path) => {
      const center: [number, number] = [Conf.ww / 2, Conf.wh / 2]
      distributedPath(
        movedPath(blurRate, center)(path),
        omitPercent,
        distortedMidPoints(dist)
      ).forEach(alternatePath)
    })
  }

export const blurredDistortedSpec =
  (blurRate: number, distortion: number): SpecDrawer =>
  (spec) => {
    spec.forEach((path) => {
      const center: [number, number] = [Conf.ww / 2, Conf.wh / 2]
      distributedPath(
        movedPath(blurRate, center)(path),
        distortion,
        distortedMidPoints(distortion)
      ).forEach(pathDrawerFactory())
    })
  }

export const omittedDistortedSpec = (omitPercent: number, distortion: number): SpecDrawer =>
  specDrawerFactory(omittedDistortedPath(omitPercent, distortion))
