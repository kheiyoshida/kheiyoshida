import { ListenableState } from '..'
import { floorToThreshold } from '../../stats'
import { effectSceneManipMap, normalSceneManipMap } from './manipMaps'
import { ColorPalette, applyPalette, getPalette, setPalette } from './palette'
import { ColorIntention, ManipMap, Scene, ScenePatternParams } from './scenes'
import { parameterizeNormalScene } from './scenes/default'
import { parameterizeEffectScene } from './scenes/effect'

export type ApplyColors = () => void

export const bundleScene =
  <S extends Scene>(
    map: ManipMap<S>,
    params: ScenePatternParams<S>,
    palette: ColorPalette = getPalette()
  ): ApplyColors =>
  () => {
    const newPalette = map[params[0]](palette, params)
    setPalette(newPalette)
    applyPalette(newPalette)
  }

export type ScneProvider = (state: ListenableState) => ApplyColors

export const normalSceneProvider: ScneProvider = (state) => {
  const intention = domainColorLogic(state)
  return resolveColorIntention(intention)
}

export const domainColorLogic = (state: ListenableState) => {
  const [mid, low] = floorToThreshold(state.floor)
  if (state.sanity >= mid)
    return [Scene.Normal, parameterizeNormalScene(state)] as ColorIntention<Scene.Normal>
  else if (state.sanity >= low)
    return [Scene.Effect, parameterizeEffectScene(state)] as ColorIntention<Scene.Effect>
  else return [Scene.Effect, parameterizeEffectScene(state)] as ColorIntention<Scene.Effect>
}

export const resolveColorIntention = <S extends Scene>([
  scene,
  params,
]: ColorIntention<S>): ApplyColors => {
  if (scene === Scene.Normal)
    return bundleScene(normalSceneManipMap, params as ScenePatternParams<Scene.Normal>)
  if (scene === Scene.Effect)
    return bundleScene(effectSceneManipMap, params as ScenePatternParams<Scene.Effect>)
  throw Error()
}
