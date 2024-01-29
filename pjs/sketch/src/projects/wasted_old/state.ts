import p5 from 'p5'
import { makePingpongNumberStore, makeStoreV2, randomFloatBetween } from 'utils'

const MinSpin = 0.5
const MaxSpin = 2
const InitialSpin = 1

export const spinNumber = makePingpongNumberStore(
  () => randomFloatBetween(0, 0.01),
  MinSpin,
  MaxSpin,
  InitialSpin
)

export type WastedState = {
  centerPosition: p5.Vector
}

export const wastedStore = makeStoreV2<WastedState>(() => ({
  centerPosition: new p5.Vector(),
}))({
  updateCenter:
    (s) =>
    (wobbleAmount: number = 3) => {
      s.centerPosition = s.centerPosition.add(p5.Vector.random3D().mult(wobbleAmount))
    },
})
