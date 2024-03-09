import { transColor } from 'p5utils/src/render'
import { Conf } from '../../config'
import { getRenderGridFromCurrentState } from '../../domain/compose'
import { getRenderingSpeed } from '../../domain/stats'
import {
  compileRenderFnSequence,
  makeRenderFn,
  registerIntervalRenderSequence,
  reserveIntervalRender,
} from './base'
import { corridorToNextFloor } from './others/scenes'
import { RenderQueue } from './queue'
import { getVisionFromCurrentState } from './vision'
import { changePaletteColor, getPalette, setPalette } from './vision/color/palette'
import { translateFrame } from './vision/frame/altFrame'
import { DEFAULT_MAGNIFY_RATES } from './vision/frame/magnify'

export const renderCurrentView = (
  vision = getVisionFromCurrentState(),
  renderGrid = getRenderGridFromCurrentState()
) => {
  RenderQueue.push(() => makeRenderFn(renderGrid, vision)(vision.frames(1)))
  RenderQueue.consume()
}

const goMoveMagnifySeq = [1.05, 1.1, 1.24, 1.33, 1.5, 1.65, 1.8, 1.95]

export const renderGo = (
  vision = getVisionFromCurrentState(),
  renderGrid = getRenderGridFromCurrentState(),
  speed = getRenderingSpeed()
) => {
  vision.renewColors()
  const interval = speed * Conf.frameInterval
  const framesSequence = goMoveMagnifySeq.map(vision.frames)
  const renderFnMaker = makeRenderFn(renderGrid, vision)
  const renderFns = compileRenderFnSequence(framesSequence, renderFnMaker)
  registerIntervalRenderSequence(interval, renderFns)
}

/**
 * [magnify, transLR]
 */
const TURN_ADJUST_VALUES = [
  [0.85, 0.01],
  [0.9, 0.03],
  [0.95, 0.08],
  [1, 0.11],
] as const

export const makeRenderTurn =
  (d: 'r' | 'l') =>
  (
    vision = getVisionFromCurrentState(),
    renderGrid = getRenderGridFromCurrentState(),
    speed = getRenderingSpeed()
  ) => {
    const slide = (trans: number): [number, number] => [(d === 'r' ? -1 : 1) * trans * Conf.ww, 0]
    const interval = speed * Conf.frameInterval
    const renderFnMaker = makeRenderFn(renderGrid, vision)
    const framesSequence = TURN_ADJUST_VALUES.map(([mag, trans]) =>
      vision.frames(mag).map((f) => translateFrame(slide(trans))(f))
    )
    const renderFns = compileRenderFnSequence(framesSequence, renderFnMaker)
    registerIntervalRenderSequence(interval, renderFns)
  }

const secondMag = DEFAULT_MAGNIFY_RATES[1]
const magnifyDownStairs = Array(12)
  .fill(null)
  .map((_, i) => secondMag / i)
  .reverse()

export const renderGoDownstairs = (
  vision = getVisionFromCurrentState(),
  renderGrid = getRenderGridFromCurrentState(),
  speed = getRenderingSpeed()
) => {
  const wh = Conf.wh
  const ren = makeRenderFn(renderGrid, vision)
  const originalStroke = getPalette().stroke
  const interval = speed * Conf.frameInterval * 3
  const framesSequence = magnifyDownStairs.map((hd, i) => {
    const fixed = wh * 0.1
    const r: number = 1 + i * ((1 / secondMag - 1) / magnifyDownStairs.length)
    return vision
      .frames(r * 1.05)
      .map((f) =>
        translateFrame([
          0,
          i % 2 === 0 ? -wh * hd * r * 1.2 - fixed * 2 : -wh * hd * r * 1.2 - fixed * 1.8,
        ])(f)
      )
  })
  const renderFns = compileRenderFnSequence(framesSequence, (f, i) => {
    setPalette(changePaletteColor('stroke', transColor(originalStroke, -i * 25)))
    ren(f)
    if (i >= magnifyDownStairs.length - 1) {
      setPalette(changePaletteColor('stroke', originalStroke))
    }
  })
  reserveIntervalRender(interval, renderFns)
}

export const renderProceedToNextFloor = (
  vision = getVisionFromCurrentState(),
  speed = getRenderingSpeed()
) => {
  const interval = speed * Conf.frameInterval * 2
  const renderFn = makeRenderFn(corridorToNextFloor, vision)
  const framesSequence = goMoveMagnifySeq.slice(6).map(vision.frames)
  const renderFns = compileRenderFnSequence(framesSequence, renderFn)
  reserveIntervalRender(interval, renderFns)
}
