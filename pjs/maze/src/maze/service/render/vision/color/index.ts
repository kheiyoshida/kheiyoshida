import { ListenableState } from '../../../../domain'
import { ColorIntention, Scene, ScenePatternParams } from '../../../../domain/color/types'
import { effectSceneManipMap, normalSceneManipMap } from './manipMaps'
import { ColorPalette, applyPalette, getPalette, setPalette } from './palette'
import { ColorManipFnMap } from './types'

export type ApplyColors = () => void

export const bundleScene =
  <S extends Scene>(
    map: ColorManipFnMap<S>,
    params: ScenePatternParams<S>,
    palette: ColorPalette = getPalette()
  ): ApplyColors =>
  () => {
    const newPalette = map[params[0]](palette, params)
    setPalette(newPalette)
    applyPalette(newPalette)
  }

export type ScneProvider = (state: ListenableState) => ApplyColors

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
