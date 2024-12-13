import { IntRange } from 'utils'

export type RenderingStyle = IntRange<1, 10>
export type RenderingMode = 'atmospheric' | 'smooth' | 'ambient' | 'digital' | 'abstract'

export type Stage = {
  number: number

  startFloor: number
  endFloor: number

  style: RenderingStyle
  mode: RenderingMode
}
