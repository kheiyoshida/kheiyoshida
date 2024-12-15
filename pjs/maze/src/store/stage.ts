import { IntRange } from 'utils'

export type RenderingStyle = IntRange<1, 10>

export enum RenderingMode {
  'atmospheric',
  'smooth',
  'ambient',
  'digital',
  'abstract',
}

export type Stage = {
  number: number

  startFloor: number
  endFloor: number

  style: RenderingStyle
  mode: RenderingMode
}

export type StageContext = {
  prev: FloorStage | null
  current: FloorStage
  next: FloorStage | null
}

export type FloorStage = {
  style: RenderingStyle
  mode: RenderingMode
}
