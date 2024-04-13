import { ListenableState } from '../..'

export type ColorOperationPattern = 'default' | 'stay' | 'return' | 'gradation' | 'reverse' | 'random' | 'trans' | 'fadeout'

export type ParameterizeState = (state: ListenableState) => ColorOperationParams
export type ColorOperationParams = [pattern: ColorOperationPattern, ...args: number[]]
