import { RenderingStyle } from './style.ts'
import { Atmosphere } from '../world'

export type Stage = {
  number: number

  startFloor: number
  endFloor: number

  style: RenderingStyle
  mode: Atmosphere
}

export type StageContext = {
  prev: FloorStage | null
  current: FloorStage
  next: FloorStage | null
}

export type FloorStage = {
  style: RenderingStyle
  mode: Atmosphere
}
