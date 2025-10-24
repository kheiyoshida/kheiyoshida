import { RenderingStyle } from './style.ts'

export type Stage = {
  number: number

  startFloor: number
  endFloor: number

  style: RenderingStyle
  mode: RenderingMode
}

export enum RenderingMode {
  'atmospheric',
  'smooth',
  'ambient',
  'digital',
  'abstract',
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
