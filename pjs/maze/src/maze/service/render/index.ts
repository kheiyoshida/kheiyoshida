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
import {
  calcDownStairsMovementFrames,
  calcGoMovementFrames,
  calcTurnMovementFrames,
} from './movement'
import { corridorToNextFloor } from './others/scenes'
import { RenderQueue } from './queue'
import { getVisionFromCurrentState } from './vision'
import { changePaletteColor, getPalette, setPalette } from './vision/color/palette'

export const renderCurrentView = (
  vision = getVisionFromCurrentState(),
  renderGrid = getRenderGridFromCurrentState()
) => {
  const renderFn = makeRenderFn(renderGrid, vision)
  const framesSequence = vision.makeFrames()
  const [renderFns] = compileRenderFnSequence([framesSequence], renderFn)
  RenderQueue.push(renderFns)
  RenderQueue.consume()
}

export const renderGo = (
  vision = getVisionFromCurrentState(),
  renderGrid = getRenderGridFromCurrentState(),
  speed = getRenderingSpeed()
) => {
  vision.renewColors()
  const interval = speed * Conf.frameInterval
  const framesSequence = calcGoMovementFrames(vision.makeFrames)
  const renderFnMaker = makeRenderFn(renderGrid, vision)
  const renderFns = compileRenderFnSequence(framesSequence, renderFnMaker)
  registerIntervalRenderSequence(interval, renderFns)
}

export const renderTurn = (
  d: 'r' | 'l',
  vision = getVisionFromCurrentState(),
  renderGrid = getRenderGridFromCurrentState(),
  speed = getRenderingSpeed()
) => {
  const interval = speed * Conf.frameInterval
  const renderFnMaker = makeRenderFn(renderGrid, vision)
  const framesSequence = calcTurnMovementFrames(d, vision.makeFrames)
  const renderFns = compileRenderFnSequence(framesSequence, renderFnMaker)
  registerIntervalRenderSequence(interval, renderFns)
}

export const renderGoDownstairs = (
  vision = getVisionFromCurrentState(),
  renderGrid = getRenderGridFromCurrentState(),
  speed = getRenderingSpeed()
) => {
  const ren = makeRenderFn(renderGrid, vision)
  const originalStroke = getPalette().stroke
  const interval = speed * Conf.frameInterval * 3
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

export const renderProceedToNextFloor = (
  vision = getVisionFromCurrentState(),
  speed = getRenderingSpeed()
) => {
  const interval = speed * Conf.frameInterval * 2
  const renderFn = makeRenderFn(corridorToNextFloor, vision)
  const framesSequence = calcGoMovementFrames(vision.makeFrames).slice(6)
  const renderFns = compileRenderFnSequence(framesSequence, renderFn)
  reserveIntervalRender(interval, renderFns)
}
