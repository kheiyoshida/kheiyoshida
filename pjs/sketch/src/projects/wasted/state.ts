import { make3DPositionWobbler } from 'p5utils/src/lib/utils/3d'
import { makePingpongNumberStore, randomFloatBetween } from 'utils'

const MinSpin = 0.5
const MaxSpin = 2
const InitialSpin = 1

export const spinNumber = makePingpongNumberStore(
  () => randomFloatBetween(0, 0.01),
  MinSpin,
  MaxSpin,
  InitialSpin
)

export const centerPosition = make3DPositionWobbler(3)
