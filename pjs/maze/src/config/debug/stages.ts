import { Stage } from '../../game/stage'
import { Atmosphere } from '../../game/world'

export const fixedStages: Stage[] = [
  {
    number: 1,
    startLevel: 1,
    endLevel: 2,
    style: 5, // poles
    mode: Atmosphere.atmospheric,
  },
  {
    number: 2,
    startLevel: 3,
    endLevel: 5,
    style: 2, // default
    mode: Atmosphere.atmospheric,
  },
  {
    number: 3,
    startLevel: 6,
    endLevel: 7,
    style: 5, // tiles
    mode: Atmosphere.atmospheric,
  },
]
