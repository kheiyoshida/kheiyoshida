import { ListenableState } from '../..'
import { ColorPalette } from '../palette'

export enum Scene {
  Normal = 'normal',
  Effect = 'effect' 
}

type DefaultPatterns = 'default' | 'stay' | 'return' | 'gradation'
type EffectPatterns = 'default' | 'stay' | 'return' | 'gradation' | 'reverse' | 'random' | 'trans'

export type ScenePattern<S extends Scene> = S extends Scene.Normal ? DefaultPatterns : EffectPatterns

export type DefaultSceneColorPatterns = ScenePattern<Scene.Normal>
export type EffectSceneColorPatterns = ScenePattern<Scene.Effect>

export type ScenePatternParams<S extends Scene> = [pattern: ScenePattern<S>, ...args: any[]]

export type ParameterizeState<S extends Scene> = (
  state: ListenableState
) => ScenePatternParams<S>

export type ManipFn<S extends Scene> = (
  palette: ColorPalette,
  params: ScenePatternParams<S>
) => ColorPalette

export type ManipMap<S extends Scene> = { [k in ScenePattern<S>]: ManipFn<S> }

export type ColorIntention<S extends Scene = Scene> = [scene: S, params: ScenePatternParams<S>]