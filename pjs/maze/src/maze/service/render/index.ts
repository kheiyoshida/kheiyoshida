import { transColor } from 'p5utils/src/render'
import { Conf } from '../../config'
import {
  compileRenderFnSequence,
  makeRenderFn,
  registerIntervalRenderSequence,
  reserveIntervalRender,
} from './base'
import {
  calcDownStairsMovementFrames,
  calcGoMovementFrames,
  calcTurnMovementFrames,
} from './movement'
import { corridorToNextFloor } from './others/scenes'
import { RenderQueue } from './queue'
import { Vision } from './vision'
import { changePaletteColor, getPalette, setPalette } from './vision/color/palette'

export type MakeRender = (vision: Vision) => () => void

export const renderCurrentView = (vision: Vision) => () => {
  const renderFn = makeRenderFn(vision.renderGrid, vision)
  const framesSequence = vision.makeFrames()
  const [renderFns] = compileRenderFnSequence([framesSequence], renderFn)
  RenderQueue.push(renderFns)
  RenderQueue.consume()
}

export const renderGo = (vision: Vision) => () => {
  vision.renewColors()
  const interval = vision.speed * Conf.frameInterval
  const framesSequence = calcGoMovementFrames(vision.makeFrames)
  const renderFnMaker = makeRenderFn(vision.renderGrid, vision)
  const renderFns = compileRenderFnSequence(framesSequence, renderFnMaker)
  registerIntervalRenderSequence(interval, renderFns)
}

export const renderTurn = (d: 'r' | 'l') => (vision: Vision) => () => {
  const interval = vision.speed * Conf.frameInterval
  const renderFnMaker = makeRenderFn(vision.renderGrid, vision)
  const framesSequence = calcTurnMovementFrames(d, vision.makeFrames)
  const renderFns = compileRenderFnSequence(framesSequence, renderFnMaker)
  registerIntervalRenderSequence(interval, renderFns)
}

export const renderTurnRight = renderTurn('r')
export const renderTurnLeft = renderTurn('l')

export const renderGoDownstairs = (vision: Vision) => () => {
  const ren = makeRenderFn(vision.renderGrid, vision)
  const originalStroke = getPalette().stroke
  const interval = vision.speed * Conf.frameInterval * 3
  const framesSequence = calcDownStairsMovementFrames(vision.makeFrames)
  const renderFns = compileRenderFnSequence(framesSequence, (frames, framesIndex) => {
    setPalette(changePaletteColor('stroke', transColor(originalStroke, -framesIndex * 25)))
    ren(frames)
    if (framesIndex >= framesSequence.length - 1) {
      setPalette(changePaletteColor('stroke', originalStroke))
    }
  })
  reserveIntervalRender(interval, renderFns)
}

export const renderProceedToNextFloor = (vision: Vision) => () => {
  const interval = vision.speed * Conf.frameInterval * 2
  const renderFn = makeRenderFn(corridorToNextFloor, vision)
  const framesSequence = calcGoMovementFrames(vision.makeFrames).slice(6)
  const renderFns = compileRenderFnSequence(framesSequence, renderFn)
  reserveIntervalRender(interval, renderFns)
}
