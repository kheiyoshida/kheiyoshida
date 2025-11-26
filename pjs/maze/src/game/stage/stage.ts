import { Stage } from './index.ts'
import {
  clamp,
  fireByRate,
  IntRange,
  makeConstrainedRandomEmitter,
  makeRangeMap,
  randomIntInclusiveBetween,
} from 'utils'
import { InitialStyle } from '../../config/debug.ts'
import { Ambience, Atmosphere, Structure } from '../world'

export const InitialNumOfStages = 20

export type Pivot = IntRange<1, 10>

export const classifyPivot = (p: Pivot) => {
  if (p >= 1 && p <= 3) return 0
  if (p >= 4 && p <= 6) return 1
  if (p >= 7 && p <= 9) return 2
}

export const buildStages = (): Stage[] => {
  const stages: Stage[] = []
  let currentFloor = 1

  let currentStyle: Pivot = 5
  const pickPivot = makeConstrainedRandomEmitter(
    () => {
      if (currentFloor === 1) return InitialStyle // initial style
      return clamp(currentStyle + randomIntInclusiveBetween(-3, 3), 1, 9) as Pivot
    },
    (val, prev) => classifyPivot(val) === classifyPivot(prev),
    2 // can stay in the same rendering style for 2 stages in a row, but not more than that
  )

  let atmosphere = Atmosphere.atmospheric

  for (let stg = 0; stg < InitialNumOfStages; stg++) {
    const floors = fireByRate(0.8) ? 1 : 0
    const pivot = pickPivot()

    // update atmosphere every 2 stages
    if (stg !== 0 && stg % 2 === 0) {
      const [min, max] = stageModeMap.get(stg)
      atmosphere = clamp(atmosphere + (fireByRate(0.5) ? 1 : -1), min, max)
    }

    stages.push({
      number: stg,
      startLevel: currentFloor,
      endLevel: currentFloor + floors,
      world: {
        atmosphere,
        structure: getStructure(pivot),
        ambience: pivot as Ambience,
      },
    })
    currentFloor += floors + 1
    currentStyle = pivot
  }

  return stages
}

type ModeRange = [min: Atmosphere, max: Atmosphere]

// prettier-ignore
export const stageModeMap = makeRangeMap<ModeRange>([
  [[0, 1], [Atmosphere.atmospheric, Atmosphere.atmospheric]],
  [[2, 3], [Atmosphere.smooth, Atmosphere.smooth]],
  [[4, 5], [Atmosphere.smooth, Atmosphere.ambient]],
  [[6, 7], [Atmosphere.ambient, Atmosphere.digital]],
  [[8, 9], [Atmosphere.digital, Atmosphere.abstract]],
  [[10, 11], [Atmosphere.abstract, Atmosphere.abstract]],
  [[12, 13], [Atmosphere.digital, Atmosphere.abstract]],
  [[14, 15], [Atmosphere.atmospheric, Atmosphere.digital]], // full range
])

export const getStructure = (p: Pivot): Structure => {
  return 'poles'
  if (p <= 2) return 'poles'
  if (p <= 4) return 'stackableBox'
  if (p === 5) return 'classic'
  if (p <= 7) return 'floatingBox'
  if (p >= 9) return 'tiles'
  return 'classic'
}
