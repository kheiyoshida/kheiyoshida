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

const calcWidthLevel = makeDecreasingParameter(0.3, 1, 1200, 300)
const calcHeightLevel = makeIncreasingParameter(1, 1.5, 3000)
const calcCorridorLengthLevel = makeIncreasingParameter(1, 2, 1500)
const calcDistortion = makeIncreasingParameter(0.05, 2, 2000)

//
// speed
//
export const getWalkSpeedFromCurrentState = () => {
  return calcSpeed(statusStore.current.stamina)
}

const calcSpeed = makeDecreasingParameter(0, 1, (MAX_STATUS_VALUE * 3) / 4, MAX_STATUS_VALUE/4)

//
// music
//

export type MusicRange = IntRange<1, 10>

export type MusicCommand = {
  alignment: MusicRange
  aesthetics: MusicRange
}

export const getMusicCommands = (): MusicCommand => ({
  alignment: calcMusicAlignment(statusStore.current.sanity),
  aesthetics: store.current.aesthetics as MusicRange,
})

export const calcMusicAlignment = (sanity: number): MusicRange => {
  if (sanity >= 2700) return 9
  if (sanity >= 2400) return 8
  if (sanity >= 2100) return 7
  if (sanity >= 1800) return 6
  if (sanity >= 1500) return 5
  if (sanity >= 1200) return 4
  if (sanity >= 900) return 3
  if (sanity >= 600) return 2
  if (sanity >= 300) return 1
  return 1
}
