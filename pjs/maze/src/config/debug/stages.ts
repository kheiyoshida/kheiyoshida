import { Stage } from '../../game/stage'
import { Atmosphere } from '../../game/world'

export const fixedStages: Stage[] = [
  {
    number: 1,
    startFloor: 1,
    endFloor: 2,
    style: 5, // poles
    mode: Atmosphere.atmospheric,
  },
  {
    number: 2,
    startFloor: 3,
    endFloor: 5,
    style: 2, // default
    mode: Atmosphere.atmospheric,
  },
  {
    number: 3,
    startFloor: 6,
    endFloor: 7,
    style: 5, // tiles
    mode: Atmosphere.atmospheric,
  },
]
