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
import { Atmosphere } from '../../../../game/world'

export type ScreenEffectType = 'atmospheric' | 'smooth' | 'ambient' | 'digital' | 'abstract'

const ScreenEffectMap = new Map<ScreenEffectType, MazeScreenEffect>()

export const initScreenEffects = () => {
  ScreenEffectMap.set('atmospheric', new AtmosphericEffect())
  ScreenEffectMap.set('smooth', new SmoothEffect())
  ScreenEffectMap.set('ambient', new AmbientEffect())
  ScreenEffectMap.set('digital', new DigitalEffect())
  ScreenEffectMap.set('abstract', new AbstractEffect())
}

const modeEffectMap: Record<Atmosphere, ScreenEffectType> = {
  [Atmosphere.atmospheric]: 'atmospheric',
  [Atmosphere.smooth]: 'smooth',
  [Atmosphere.ambient]: 'ambient',
  [Atmosphere.digital]: 'digital',
  [Atmosphere.abstract]: 'abstract',
}

export const getScreenEffect = (mode: Atmosphere, params: ScreenEffectParams, baseColor: Color, fade?: number): MazeScreenEffect => {
  const type = modeEffectMap[mode]
  if (!ScreenEffectMap.has(type)) {
    throw Error(`screen effect map was not initialized`)
  }
  const effect = ScreenEffectMap.get(type)!
  effect.setParameters({ ...params, fadeoutPercentage: fade || 0, baseColor: baseColor.normalizedRGB })
  return effect
}
