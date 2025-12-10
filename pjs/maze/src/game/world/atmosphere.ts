import { Atmosphere } from './types.ts'
import { clamp, makeRangeMap } from 'utils'

type ModeRange = [min: Atmosphere, max: Atmosphere]

// prettier-ignore
export const atmosphereRangeMap = makeRangeMap<ModeRange>([
  [[0, 1], [Atmosphere.atmospheric, Atmosphere.atmospheric]],
  [[2, 3], [Atmosphere.smooth, Atmosphere.smooth]],
  [[4, 5], [Atmosphere.smooth, Atmosphere.ambient]],
  [[6, 7], [Atmosphere.ambient, Atmosphere.digital]],
  [[8, 9], [Atmosphere.digital, Atmosphere.abstract]],
  [[10, 11], [Atmosphere.abstract, Atmosphere.abstract]],
  [[12, 13], [Atmosphere.digital, Atmosphere.abstract]],
  [[14, 15], [Atmosphere.atmospheric, Atmosphere.digital]], // full range
])

let atmosphere = Atmosphere.atmospheric
export const getAtmosphere = (level: number) => {
  const [min, max] = atmosphereRangeMap.get(level - 1)
  atmosphere = clamp(atmosphere + (Math.random() > 0.5 ? 1 : -1), min, max)
  return atmosphere
}
