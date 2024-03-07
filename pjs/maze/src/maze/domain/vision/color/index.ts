import { ListenableState } from '..'
import { floorToThreshold } from '../../stats'
import { effectSceneManipMap, normalSceneManipMap } from './manipMaps'
import { ColorPalette, applyPalette, getPalette, setPalette } from './palette'
import { ManipMap, SceneParams, ScenePattern } from './scenes'
import { parameterizeNormalScene } from './scenes/default'
import { parameterizeEffectScene } from './scenes/effect'

export type ApplyColors = () => void

export const bundleScene =
  <P extends ScenePattern>(
    params: SceneParams<P>,
    map: ManipMap<P>,
    palette: ColorPalette = getPalette()
  ): ApplyColors =>
  () => {
    const newPalette = map[params[0]](palette, params)
    setPalette(newPalette)
    applyPalette(newPalette)
  }

export type ScneProvider = (state: ListenableState) => ApplyColors

export const normalSceneProvider: ScneProvider = (state) => {
  const [mid, low] = floorToThreshold(state.floor)
  if (state.sanity >= mid) return bundleScene(parameterizeNormalScene(state), normalSceneManipMap)
  else if (state.sanity >= low)
    return bundleScene(parameterizeEffectScene(state), effectSceneManipMap)
  else return bundleScene(parameterizeEffectScene(state), effectSceneManipMap)
}
