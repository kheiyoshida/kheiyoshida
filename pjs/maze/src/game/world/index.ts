import { RenderingStyle } from '../stage/style.ts'
import { IntRange } from 'utils'

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

export const determineModelingStyle = (style: RenderingStyle): Structure => {
  if (style <= 3) return 'poles'
  if (style >= 7) return 'tiles'
  return 'classic'
}
