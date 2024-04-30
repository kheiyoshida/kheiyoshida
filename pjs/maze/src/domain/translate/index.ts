import { statusStore, store } from '../../store'
import { ColorOperationParams } from './color/types'
import { createDecreasingParameter, createIncreasingParameter } from './utils/params'

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

const calcWidthLevel = createDecreasingParameter(0.2, 1, 75)
const calcHeightLevel = createIncreasingParameter(1, 5, 100)
const calcCorridorLengthLevel = createIncreasingParameter(1, 2, 75)
const calcDistortion = createIncreasingParameter(0.05, 1, 125)

export const getWalkSpeedFromCurrentState = () => {
  return calcSpeed(statusStore.current.stamina)
}

const calcSpeed = createDecreasingParameter(0, 1, 80)

export type SkinStrategy = 'simple' | 'random'
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
