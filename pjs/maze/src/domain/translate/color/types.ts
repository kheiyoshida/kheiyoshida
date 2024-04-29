import { ListenableState } from '../..'

export type ColorOperationPattern = 'default' | 'stay' | 'return' | 'gradation' | 'random' | 'fadeout'

export type ParameterizeState = (state: ListenableState) => ColorOperationParams
export type ColorOperationParams = [pattern: ColorOperationPattern, ...args: number[]]
