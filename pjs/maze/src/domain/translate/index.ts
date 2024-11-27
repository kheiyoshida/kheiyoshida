import { IntRange } from 'utils'
import { statusStore, store } from '../../store'
import { ColorOperationParams } from './color/types'
import { createDecreasingParameter, createIncreasingParameter } from './utils/params'
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

const calcWidthLevel = createDecreasingParameter(0.3, 1, 1000)
const calcHeightLevel = createIncreasingParameter(1, 8, 1000)
const calcCorridorLengthLevel = createIncreasingParameter(1, 2, 1000)

//
// distortion
//
const calcDistortion = createIncreasingParameter(0.05, 2, 2000)

//
// speed
//
export const getWalkSpeedFromCurrentState = () => {
  return calcSpeed(statusStore.current.stamina)
}

const calcSpeed = createDecreasingParameter(0, 1, MAX_STATUS_VALUE / 2)

//
// skin
//

export type SkinStrategy = 'simple' | 'random' | 'none'

export type TextureParams = {
  skin: [SkinStrategy, ...number[]]
  color: ColorOperationParams
}

export const getTextureParams = () => ({
  skin: getTextureSkinStrategy(store.current.floor),
  color: getTextureColor(store.current.floor),
})

const getTextureSkinStrategy = (floor: number): TextureParams['skin'] => {
  if (floor < 3 || floor % 10 === 0) return ['simple']
  return ['random', floor - 2]
}

const getTextureColor = (floor: number): ColorOperationParams => {
  if (floor < 5) return ['default']
  return ['gradation', -20, 20]
}

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
