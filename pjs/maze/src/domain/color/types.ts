import { ListenableState } from '..'

export type ColorEffectPattern = 'default' | 'stay' | 'return' | 'gradation' | 'reverse' | 'random' | 'trans'

export type ParameterizeState = (state: ListenableState) => ColorIntention
export type ColorIntention = [pattern: ColorEffectPattern, ...args: number[]]
