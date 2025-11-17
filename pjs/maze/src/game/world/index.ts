import { IntRange } from 'utils'
import { Pivot } from '../stage/stage.ts'

export type Ambience = IntRange<1, 10>

export type World = {
  atmosphere: Atmosphere
  structure: Structure
  ambience: Ambience
}

export enum Atmosphere {
  'atmospheric',
  'smooth',
  'ambient',
  'digital',
  'abstract',
}

export type Structure = 'classic' | 'poles' | 'tiles'

export type StructureContext = {
  prev: Structure | undefined
  current: Structure
  next: Structure | undefined
}

export const determineModelingStyle = (style: Pivot): Structure => {
  if (style <= 3) return 'poles'
  if (style >= 7) return 'tiles'
  return 'classic'
}
