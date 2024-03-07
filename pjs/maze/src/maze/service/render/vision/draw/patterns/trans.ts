import { pushPop } from 'p5utils/src/render'
import { transColor } from 'p5utils/src/render'
import { getPalette } from '../../color/palette'
import { LayerDrawerFactory } from '../types'
import { specDrawerFactory } from './factory'

/**
 * make layer translucent. gets unvisible as it goes further
 */
export const transLayer =
  (transBaseAlpha: number): LayerDrawerFactory =>
  (specDrawer = specDrawerFactory()) =>
  (layer, li) => {
    pushPop(() => {
      const newColor = transColor(getPalette().stroke, -transBaseAlpha * (li || 1))
      p.stroke(newColor)
      layer.forEach(specDrawer)
    })
  }

