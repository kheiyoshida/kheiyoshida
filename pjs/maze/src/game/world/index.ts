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

export type StructureContext = {
  prev: Structure | undefined
  current: Structure
  next: Structure | undefined
}
