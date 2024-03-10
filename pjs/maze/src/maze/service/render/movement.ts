import { Conf } from '../../config'
import { translateFrame } from './vision/frame/altFrame'
import { MakeFrames } from './vision/frame/framesMaker'
import { DEFAULT_MAGNIFY_RATES } from './vision/frame/magnify'

export const GoMoveMagValues = [1.05, 1.1, 1.24, 1.33, 1.5, 1.65, 1.8, 1.95]

export const calcGoMovementFrames = (makeFrames: MakeFrames) => GoMoveMagValues.map(makeFrames)

/**
 * [magnify, transLR]
 */
const TURN_ADJUST_VALUES = [
  [0.85, 0.01],
  [0.9, 0.03],
  [0.95, 0.08],
  [1, 0.11],
] as const

export const calcTurnMovementFrames = (direction: 'r' | 'l', makeFrames: MakeFrames) => {
  const slide = (trans: number): number => (direction === 'r' ? -1 : 1) * trans * Conf.ww
  return TURN_ADJUST_VALUES.map(([mag, trans]) =>
    makeFrames(mag).map((f) => translateFrame([slide(trans), 0])(f))
  )
}

const secondMag = DEFAULT_MAGNIFY_RATES[1]
const magnifyDownStairs = Array(12)
  .fill(null)
  .map((_, i) => secondMag / i)
  .reverse()

export const calcDownStairsMovementFrames = (makeFrames: MakeFrames) => {
  const wh = Conf.wh
  const framesSequence = magnifyDownStairs.map((hd, i) => {
    const fixed = wh * 0.1
    const r: number = 1 + i * ((1 / secondMag - 1) / magnifyDownStairs.length)
    return makeFrames(r * 1.05).map((f) =>
      translateFrame([
        0,
        i % 2 === 0
          ? -wh * hd * r * 1.2 - fixed * 2 //
          : -wh * hd * r * 1.2 - fixed * 1.8, //
      ])(f)
    )
  })
  return framesSequence
}
