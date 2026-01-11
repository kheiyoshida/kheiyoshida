import { makeDecreasingParameter, makeIncreasingParameter } from '../utils/params.ts'
import { game } from '../../../game'

export type ScaffoldParams = {
  corridorWidthLevel: number
  wallHeightLevel: number
  corridorLengthLevel: number
  distortionLevel: number
}

export const getScaffoldParams = (): ScaffoldParams => {
  const { stamina, sanity } = game.player.status
  return {
    corridorWidthLevel: calcWidthLevel(sanity),
    wallHeightLevel: calcHeightLevel(sanity / 2 + stamina),
    corridorLengthLevel: calcCorridorLengthLevel(stamina),
    distortionLevel: calcDistortion(sanity),
  }
}

const calcWidthLevel = makeDecreasingParameter(0.3, 1, 1200, 300)
const calcHeightLevel = makeIncreasingParameter(1, 1.5, 3000)
const calcCorridorLengthLevel = makeIncreasingParameter(1, 2, 1500)

const calc = makeIncreasingParameter(0.01, 2.0, 2500)
const calcDistortion = (sanity: number) => {
  const dist = calc(sanity)
  return dist > 1 ? dist * dist : dist
}
