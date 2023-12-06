import { pushPop } from 'src/lib/p5utils'
import { transColor } from 'src/lib/p5utils/color'
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

