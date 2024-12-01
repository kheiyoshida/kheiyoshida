import { IntRange } from 'utils'
import { statusStore, store } from '../../store'
import { makeDecreasingParameter, makeIncreasingParameter } from './utils/params'
import { MAX_STATUS_VALUE } from '../../config'

//
// Scaffold
//

export type ScaffoldParams = {
  corridorWidthLevel: number
  wallHeightLevel: number
  corridorLengthLevel: number
  distortionLevel: number
}

export const getScaffoldParams = (): ScaffoldParams => {
  const { stamina, sanity } = statusStore.current
  return {
    corridorWidthLevel: calcWidthLevel(sanity),
    wallHeightLevel: calcHeightLevel(sanity / 2 + stamina),
    corridorLengthLevel: calcCorridorLengthLevel(stamina),
    distortionLevel: calcDistortion(sanity),
  }
}

const calcWidthLevel = makeDecreasingParameter(0.3, 1, 1000)
const calcHeightLevel = makeIncreasingParameter(1, 8, 1000)
const calcCorridorLengthLevel = makeIncreasingParameter(1, 2, 1000)

//
// distortion
//
const calcDistortion = makeIncreasingParameter(0.05, 2, 2000)

//
// speed
//
export const getWalkSpeedFromCurrentState = () => {
  return calcSpeed(statusStore.current.stamina)
}

const calcSpeed = makeDecreasingParameter(0, 1, MAX_STATUS_VALUE / 2)


//
// music
//

export type MusicRange = IntRange<1, 10>

export type MusicCommand = {
  alignment: MusicRange
  aesthetics: MusicRange
}

export const getMusicCommands = (): MusicCommand => ({
  alignment: Math.ceil((9 * statusStore.current.sanity) / MAX_STATUS_VALUE) as MusicRange,
  aesthetics: store.current.aesthetics as MusicRange,
})
