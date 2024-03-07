import { ListenableState } from '..'
import { floorToThreshold } from '../../stats'
import { effectSceneManipMap, normalSceneManipMap } from './manipMaps'
import { applyPalette, getPalette, setPalette } from './palette'
import { ManipMap, ParameterizeState, Scene, ScenePattern } from './scenes'
import { parameterizeNormalScene } from './scenes/default'
import { parameterizeEffectScene } from './scenes/effect'

export type ApplyColors = () => void

const makeApplySceneColors =
  (scene: Scene, state: ListenableState): ApplyColors =>
  () => {
    const palette = getPalette()
    const newPalette = scene(palette, state)
    setPalette(newPalette)
    applyPalette(newPalette)
  }

export const bundleScene =
  <P extends ScenePattern>(parameterize: ParameterizeState<P>, map: ManipMap<P>): Scene =>
  (palette, state) => {
    const params = parameterize(state)
    return map[params[0]](palette, params)
  }

export type ScneProvider = (state: ListenableState) => ApplyColors

export const normalSceneProvider: ScneProvider = (state): ApplyColors => {
  const [mid, low] = floorToThreshold(state.floor)
  if (state.sanity >= mid)
    return makeApplySceneColors(bundleScene(parameterizeNormalScene, normalSceneManipMap), state)
  else if (state.sanity >= low)
    return makeApplySceneColors(bundleScene(parameterizeEffectScene, effectSceneManipMap), state)
  else return makeApplySceneColors(bundleScene(parameterizeEffectScene, effectSceneManipMap), state)
}
