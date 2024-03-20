import { ListenableState } from '..'

export enum Scene {
  Normal = 'normal',
  Effect = 'effect',
}

type DefaultPatterns = 'default' | 'stay' | 'return' | 'gradation'
type EffectPatterns = 'default' | 'stay' | 'return' | 'gradation' | 'reverse' | 'random' | 'trans'

export type ScenePattern<S extends Scene> = S extends Scene.Normal
  ? DefaultPatterns
  : EffectPatterns

export type ScenePatternParams<S extends Scene> = [pattern: ScenePattern<S>, ...args: number[]]

export type ParameterizeState<S extends Scene> = (state: ListenableState) => ScenePatternParams<S>

export type ColorIntention<S extends Scene = Scene> = [scene: S, params: ScenePatternParams<S>]
