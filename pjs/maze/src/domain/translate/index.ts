import { IntRange } from 'utils'
import { statusStore, store } from '../../store'
import { ColorOperationParams } from './color/types'
import { createDecreasingParameter, createIncreasingParameter } from './utils/params'
import { MAX_STATUS_VALUE } from '../../config'

export type ScaffoldParams = {
  corridorWidthLevel: number
  wallHeightLevel: number
  corridorLengthLevel: number
  distortionLevel: number
}

export const getScaffoldParams = (): ScaffoldParams => {
  const { stamina, sanity } = statusStore.current
  const params = {
    corridorWidthLevel: calcWidthLevel(sanity),
    wallHeightLevel: calcHeightLevel(sanity / 2 + stamina),
    corridorLengthLevel: calcCorridorLengthLevel(stamina),
    distortionLevel: calcDistortion(sanity),
  }
  return params
}

const calcWidthLevel = createDecreasingParameter(0.2, 1, 1000)
const calcHeightLevel = createIncreasingParameter(1, 5, 1000)
const calcCorridorLengthLevel = createIncreasingParameter(1, 2, 1000)
const calcDistortion = createIncreasingParameter(0.05, 1, 1500)

export const getWalkSpeedFromCurrentState = () => {
  return calcSpeed(statusStore.current.stamina)
}

const calcSpeed = createDecreasingParameter(0.3, 1, MAX_STATUS_VALUE / 3)

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

export type MusicRange = IntRange<1, 10>

export type MusicCommand = {
  alignment: MusicRange
  aesthetics: MusicRange
}
export type MusicAlignment = 'law' | 'chaos' | null
export type MusicAesthetics = 'dark' | 'bright' | null

export const getMusicCommands = (): MusicCommand => ({
  alignment: Math.ceil(9 * statusStore.current.sanity / MAX_STATUS_VALUE) as MusicRange,
  aesthetics: store.current.aesthetics as MusicRange,
})

export type TerrainRenderStyle = 'normal' | 'poles' | 'tiles'

export const getTerrainRenderStyle = (): TerrainRenderStyle => {
  if (store.current.aesthetics <= 3) return 'poles'
  if (store.current.aesthetics >= 7) return 'tiles'
  return 'normal'
}
