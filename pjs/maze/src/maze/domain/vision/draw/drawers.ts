import { pointLine } from 'src/lib/p5utils'
import { defaultLayerFactory } from './layers'
import { withBlurred } from './patterns/blur'
import { distortedPath, distortedSpec } from './patterns/distorted'
import {
  gridDrawerFactory,
  layerDrawerFactory,
  pathDrawerFactory,
  specDrawerFactory,
} from './patterns/factory'
import { omittedLayer, omittedSpec } from './patterns/omit'
import { transLayer } from './patterns/trans'
import {
  blurredDistortedSpec,
  omittedBlurredDistortedSpec,
  omittedDistortedSpec,
} from './specs'
import {
  DrawParams,
  GridDrawer,
  LayerDrawer,
  LayerDrawerFactory,
  LineDrawer,
  PathDrawerFactory,
  SpecDrawerFactory,
} from './types'
import { toFloatPercent } from 'src/maze/utils'

/**
 * compose draw components.
 */
export const compose =
  (
    layerFac: LayerDrawerFactory = layerDrawerFactory,
    specFac: SpecDrawerFactory = specDrawerFactory,
    pathFac: PathDrawerFactory = pathDrawerFactory,
    line: LineDrawer = pointLine
  ): GridDrawer =>
  (grid) =>
    grid
      .reverse()
      .forEach(
        (layer, li) => li <= 3 && layerFac(specFac(pathFac(line)))(layer, li)
      )

/**
 * drawer without any effects.
 * for debugging use
 */
export const plainDrawer: GridDrawer = compose()

export const blurredTransLayer = (
  visible: number,
  fog: number,
  blurRate: number
): LayerDrawer => withBlurred(blurRate)(defaultLayerFactory(visible, fog))

export const calcOmit = (percent: number, layerIndex: number) =>
  percent === 0
    ? 0
    : Math.min(90, Math.floor(percent + (percent / 10) * (layerIndex || 1)))

const foggyLayer =
  (visible: number, fog: number): LayerDrawer =>
  (layer, li) => {
    if (li <= visible) {
      const foggyPercent = calcOmit(fog, li)
      if (li >= visible - 4) {
        transLayer(fog)(omittedSpec(foggyPercent))(layer, li)
      } else {
        omittedLayer(foggyPercent)(layer, li)
      }
    }
  }

const LowAlphaLayer = 4

export const allInOneDrawer = ({
  visibility,
  omitPercent,
  farAlpha,
  blurRate,
  distortion,
}: DrawParams): GridDrawer =>
  gridDrawerFactory((layer, li) => {
    if (li <= visibility) {
      const omit = calcOmit(omitPercent, li)
      const blurAlpha = farAlpha * toFloatPercent(200 - blurRate)
      if (omit === 0) {
        transLayer(farAlpha)(distortedSpec(distortion))(layer, li)
        transLayer(blurAlpha)(blurredDistortedSpec(blurRate, distortion))(
          layer,
          li
        )
      } else {
        transLayer(farAlpha)(omittedDistortedSpec(omit, distortion))(layer, li)
        transLayer(blurAlpha)(
          omittedBlurredDistortedSpec(omit, blurRate, distortion)
        )(layer, li)
      }
    }
  })

export const blurredDrawer = (visible: number, fog: number, blurRate: number) =>
  gridDrawerFactory(blurredTransLayer(visible, fog, blurRate))

export const distorted = (rate: number): GridDrawer =>
  gridDrawerFactory(layerDrawerFactory(specDrawerFactory(distortedPath(rate))))

export const blurred = (rate: number): GridDrawer =>
  gridDrawerFactory(withBlurred(rate)(layerDrawerFactory))
