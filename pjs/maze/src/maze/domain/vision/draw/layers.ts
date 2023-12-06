import { withBlurred } from './patterns/blur'
import { layerDrawerFactory } from './patterns/factory'
import { omittedSpec } from './patterns/omit'
import { transLayer } from './patterns/trans'
import { LayerDrawer, LayerDrawerFactory } from './types'

export const defaultLayerFactory =
  (visible: number, fog: number) =>
  (specDrawer = omittedSpec(fog)): LayerDrawer =>
  (layer, li) => {
    if (li <= visible) {
      if (li >= visible - 4) {
        transLayer(fog)(specDrawer)(layer, li)
      } else {
        layerDrawerFactory(specDrawer)(layer, li)
      }
    }
  }

export const blurredLayerFactory =
  (visible: number, fog: number, blurRate: number): LayerDrawerFactory =>
  (specDrawer = omittedSpec(fog)) =>
    withBlurred(blurRate)(defaultLayerFactory(visible, fog))
