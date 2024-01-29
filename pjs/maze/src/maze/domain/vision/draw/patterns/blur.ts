import { pointLine, pushPop } from 'p5utils/src/p5utils'
import { transColor } from 'p5utils/src/p5utils/color'
import { Conf } from 'src/maze/config'
import { getPalette } from '../../color/palette'
import { moveLine, movedPath } from '../helpers/helpers'
import {
  LayerDrawer,
  LayerDrawerFactory,
  LineDrawer,
  PathDrawer,
  SpecDrawer
} from '../types'
import { specDrawerFactory } from './factory'

export const blurredLine =
  (rate: number): LineDrawer =>
  (p1, p2) => {
    const center: [number, number] = [Conf.ww / 2, Conf.wh / 2]
    pointLine(...moveLine(rate, center)(p1, p2))
  }

export const blurredPath =
  (rate: number) =>
  (line = pointLine): PathDrawer =>
  (path) => {
    const center: [number, number] = [Conf.ww / 2, Conf.wh / 2]
    movedPath(
      rate,
      center
    )(path).forEach((_, i, p) => {
      if (i < p.length - 1) {
        line(p[i], p[i + 1])
      }
    })
  }

export const blurredSpec = (rate: number): SpecDrawer =>
  specDrawerFactory(blurredPath(rate)())

export const withBlurred =
  (rate: number) =>
  (layerDrawerFactory: LayerDrawerFactory): LayerDrawer =>
  (layer, li) => {
    pushPop(() => {
      const newColor = transColor(getPalette().stroke, -120)
      p.stroke(newColor)
      layerDrawerFactory(specDrawerFactory(blurredPath(rate)()))(layer, li)
    })
    layerDrawerFactory()(layer, li)
  }
