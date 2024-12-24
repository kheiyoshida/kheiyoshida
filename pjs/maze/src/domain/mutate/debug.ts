import { RenderingMode, Stage } from '../entities/stage.ts'

export const fixedStages: Stage[] = [
  {
    number: 1,
    startFloor: 1,
    endFloor: 2,
    style: 5, // poles
    mode: RenderingMode.atmospheric,
  },
  {
    number: 2,
    startFloor: 3,
    endFloor: 5,
    style: 2, // default
    mode: RenderingMode.atmospheric,
  },
  {
    number: 3,
    startFloor: 6,
    endFloor: 7,
    style: 5, // tiles
    mode: RenderingMode.atmospheric,
  },
]
