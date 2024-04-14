import { eventBlockRequired, resurrectEvent, unblockEvents } from '../../domain/events'
import { logger } from '../../utils/logger'
import { RenderHandler } from '../consumer'
import {
  DownstairsValues,
  cameraReset,
  getGoDeltaArray,
  getTurnLRDeltaArray,
  moveCamera,
} from './camera'
import { drawTerrain, triggerFadeOut } from './draw'
import { corridorToNextFloor } from '../../domain/translate/renderGrid/scenes'
import { RenderQueue } from './queue'
import { Distortion } from './scaffold/distortion'

export const renderCurrentView: RenderHandler = ({
  renderGrid,
  visibility,
  scaffoldValues,
  color,
}) => {
  const drawFrame = () => {
    cameraReset(visibility)
    drawTerrain(renderGrid, scaffoldValues, color)
  }
  RenderQueue.push(drawFrame)
}

export const renderGo: RenderHandler = ({ renderGrid, speed, scaffoldValues, color }) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta, i) => () => {
    moveCamera(zDelta)(scaffoldValues)
    drawTerrain(renderGrid, scaffoldValues, color)
    if (i === GoMoveMagValues.length - 1) {
      Distortion.slideGo()
    }
  })
  RenderQueue.update(drawFrameSequence)
}

export const renderTurn =
  (d: 'r' | 'l'): RenderHandler =>
  ({ renderGrid, speed, scaffoldValues, color }) => {
    const LRDeltaValues = getTurnLRDeltaArray(speed)
    const drawFrameSequence = LRDeltaValues.map((turnDelta) => () => {
      moveCamera(0, d === 'r' ? turnDelta : -turnDelta)(scaffoldValues)
      drawTerrain(renderGrid, scaffoldValues, color)
    })
    RenderQueue.update(drawFrameSequence)
  }

export const renderGoDownstairs: RenderHandler = ({ renderGrid, scaffoldValues, color }) => {
  const drawFrameSequence = DownstairsValues.map((values, i) => () => {
    if (i === 0) {
      triggerFadeOut(DownstairsValues.length)
      eventBlockRequired()
    }
    moveCamera(...values)(scaffoldValues)
    drawTerrain(renderGrid, scaffoldValues, color)
  })
  RenderQueue.push(...drawFrameSequence)
}

export const renderProceedToNextFloor: RenderHandler = ({ speed, scaffoldValues, color }) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta, i) => () => {
    moveCamera(zDelta)(scaffoldValues)
    drawTerrain(corridorToNextFloor, scaffoldValues, color)
    if (i === GoMoveMagValues.length - 1) {
      unblockEvents()
    }
  })
  RenderQueue.push(...drawFrameSequence)
}

const DieFrames = 48
export const renderDie: RenderHandler = ({ renderGrid, scaffoldValues, color }) => {
  const dieSequence = [...Array(DieFrames)].map((_, i) => () => {
    if (i === 0) {
      triggerFadeOut(DieFrames)
      eventBlockRequired()
    }
    drawTerrain(renderGrid, scaffoldValues, color)
    if (i === DieFrames - 1) {
      resurrectEvent()
    }
  })
  RenderQueue.update(dieSequence)
  logger.log(RenderQueue.length)
}

export const renderResurrect: RenderHandler = ({ speed, scaffoldValues, color }) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta) => () => {
    moveCamera(zDelta)(scaffoldValues)
    drawTerrain(corridorToNextFloor, scaffoldValues, color)
  })
  RenderQueue.update(drawFrameSequence)
}
