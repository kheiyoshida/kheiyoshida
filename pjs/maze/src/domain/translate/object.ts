import { statusStore, store } from '../../store'
import { clamp, fireByRate, randomIntInAsymmetricRange } from 'utils'
import { MAX_STATUS_VALUE } from '../../config'

export const getTerrainRenderStyle = (): TerrainRenderStyle => {
  if (store.current.aesthetics <= 3) return 'poles'
  if (store.current.aesthetics >= 7) return 'tiles'
  return 'classic'
}

export type TerrainRenderStyle = 'classic' | 'poles' | 'tiles'

export const ObjectAlignmentValues = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const

const MaxAlignmentValue = 9

/**
 * affects the feel of alignment of drawn objects
 */
export type ObjectAlignmentValue = (typeof ObjectAlignmentValues)[number]

/**
 * adjust drawn objects' configurations
 * min: 0, max: 1
 */
export type ObjectAdjustValue = number

export type ObjectDrawParams = {
  alignment: ObjectAlignmentValue
  adjust: ObjectAdjustValue
}

const AdjustValuePatterns = 10

const AdjustValueTable: ObjectAdjustValue[] = [...new Array(AdjustValuePatterns)].map((_, i) => {
  return clamp((i + 1) / AdjustValuePatterns + randomIntInAsymmetricRange(0.3), 0, 1)
})

const getAlignment = (): ObjectAlignmentValue => {
  const sanity = statusStore.current.sanity
  if (sanity === 0) return 1
  const base = Math.ceil(MaxAlignmentValue * (sanity / MAX_STATUS_VALUE))
  const wobble = fireByRate(1 / base) ? randomIntInAsymmetricRange(1) : 0
  return clamp(base + wobble, 1, 9) as ObjectAlignmentValue
}

export const getObjectParams = (): ObjectDrawParams => {
  const adjust = AdjustValueTable[store.current.floor % AdjustValuePatterns]
  if (adjust === undefined) {
    throw Error(`failed to retrieve adjust value`)
  }
  return {
    alignment: getAlignment(),
    adjust,
  }
}
