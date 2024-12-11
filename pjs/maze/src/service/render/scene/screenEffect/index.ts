import { ScreenEffect, ScreenShader } from 'maze-gl'
import vert from './shaders/screen.vert?raw'
import frag from './shaders/screen.frag?raw'

export type ScreenEffectType = 'edge'

const ScreenEffectMap = new Map<ScreenEffectType, ScreenEffect>()

export const initScreenEffects = () => {
  ScreenEffectMap.set('edge', new ScreenEffect(new ScreenShader(vert, frag)))
}

export const getScreenEffect = (type: ScreenEffectType): ScreenEffect => {
  if (!ScreenEffectMap.has(type)) {
    throw Error(`screen effect map was not initialized`)
  }
  return ScreenEffectMap.get(type) as ScreenEffect
}
