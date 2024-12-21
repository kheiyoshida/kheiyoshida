import { ColorParams, FloorColorParams, FrameColorParams } from './types.ts'
import { statusStore, store } from '../../../../store'
import { fireByRate, makeConstrainedRandomEmitter, randomFloatBetween, randomFloatInAsymmetricRange } from 'utils'
import { StatusState } from '../../../../store/status.ts'
import { makeDecreasingParameter, makeIncreasingParameter } from '../../utils/params.ts'

export const getColorParams = (): ColorParams => {
  const floor = store.current.floor
  const status = statusStore.current
  return {
    floor: getFloorColorParams(floor),
    frame: getFrameColorParams(status),
  }
}

const MaxSaturationLevel = 0.33

/**
 * the direction of lightness change lightness range should follow:
 * - true: increase overall lightness
 * - false: decrease overall lightness
 */
export const lightnessMoveDirection = (() => {
  let val: boolean = true
  const updateSign = makeConstrainedRandomEmitter(() => fireByRate(0.5), (v, p) => v === p, 3)
  return {
    get currentSign(): 1 | -1 {
      return val ? 1 : -1
    },
    update() {
      val = updateSign()
    },
  }
})()

const getFloorColorParams = (floor: number): FloorColorParams => {
  return {
    maxSaturation: MaxSaturationLevel * Math.min(floor / 20, 1),
    saturationDelta: randomFloatInAsymmetricRange(0.01),
    lightnessMoveDelta: lightnessMoveDirection.currentSign * randomFloatBetween(0.0, 0.01),
  }
}

// darken when stamina is low
const litLevelParameter = makeDecreasingParameter(-0.5, 1.0, 1500)

// change drastically when sanity is low
const hueDeltaParameter = makeIncreasingParameter(0.0, 1, 2000)

const getFrameColorParams = ({stamina, sanity}: StatusState): FrameColorParams => {
  return {
    litLevel: litLevelParameter(stamina),
    hueDelta: hueDeltaParameter(sanity) * randomFloatInAsymmetricRange(0.1),
  }
}
