import { ListenableState } from '../../../../domain/vision'
import { ColorIntention, ManipMap, Scene, ScenePatternParams } from '../../../../domain/vision/colorLogic/scenes/types'
import { effectSceneManipMap, normalSceneManipMap } from './manipMaps'
import { ColorPalette, applyPalette, getPalette, setPalette } from './palette'

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
