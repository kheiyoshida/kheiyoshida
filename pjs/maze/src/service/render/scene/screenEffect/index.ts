import { RenderingMode } from '../../../../game/stage'
import {
  AbstractEffect,
  AmbientEffect,
  AtmosphericEffect,
  DigitalEffect,
  MazeScreenEffect,
  SmoothEffect,
} from './effects.ts'
import { ScreenEffectParams } from '../../../../integration/query'
import { Color } from 'maze-gl'

export type ScreenEffectType = 'atmospheric' | 'smooth' | 'ambient' | 'digital' | 'abstract'

const ScreenEffectMap = new Map<ScreenEffectType, MazeScreenEffect>()

export const initScreenEffects = () => {
  ScreenEffectMap.set('atmospheric', new AtmosphericEffect())
  ScreenEffectMap.set('smooth', new SmoothEffect())
  ScreenEffectMap.set('ambient', new AmbientEffect())
  ScreenEffectMap.set('digital', new DigitalEffect())
  ScreenEffectMap.set('abstract', new AbstractEffect())
}

const modeEffectMap: Record<RenderingMode, ScreenEffectType> = {
  [RenderingMode.atmospheric]: 'atmospheric',
  [RenderingMode.smooth]: 'smooth',
  [RenderingMode.ambient]: 'ambient',
  [RenderingMode.digital]: 'digital',
  [RenderingMode.abstract]: 'abstract',
}

export const getScreenEffect = (mode: RenderingMode, params: ScreenEffectParams, baseColor: Color, fade?: number): MazeScreenEffect => {
  const type = modeEffectMap[mode]
  if (!ScreenEffectMap.has(type)) {
    throw Error(`screen effect map was not initialized`)
  }
  const effect = ScreenEffectMap.get(type)!
  effect.setParameters({ ...params, fadeoutPercentage: fade || 0, baseColor: baseColor.normalizedRGB })
  return effect
}
