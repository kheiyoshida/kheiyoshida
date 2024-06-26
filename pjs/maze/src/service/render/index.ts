import { LR } from 'src/utils/direction'
import { eventBlockRequired, resurrectEvent, unblockEvents } from '../../domain/events'
import { corridorToNextFloor } from '../../domain/translate/renderGrid/scenes'
import { logger } from '../../utils/logger'
import { RenderHandler } from '../consumer'
import { cameraReset, moveCamera } from './camera'
import { triggerFadeOut } from './camera/light'
import { DownstairsValues, getGoDeltaArray, getTurnLRDeltaArray } from './camera/movement'
import { drawTerrain, updateAesthetics } from './draw'
import { RenderQueue } from './queue'
import { Distortion } from './scaffold/distortion'

export const renderCurrentView: RenderHandler = ({ renderGrid, light, scaffoldValues }) => {
  const drawFrame = () => {
    cameraReset(light)
    drawTerrain(renderGrid, scaffoldValues)
  }
  RenderQueue.push(drawFrame)
}

export const renderGo: RenderHandler = ({ renderGrid, speed, scaffoldValues, light }) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta, i) => () => {
    moveCamera({ zDelta }, scaffoldValues, light)
    drawTerrain(renderGrid, scaffoldValues)
    if (i === GoMoveMagValues.length - 1) {
      Distortion.slideGo()
    }
  })
  RenderQueue.update(drawFrameSequence)
}

export const renderTurn =
  (direction: LR): RenderHandler =>
  ({ renderGrid, speed, scaffoldValues, light }) => {
    const LRDeltaValues = getTurnLRDeltaArray(speed)
    const drawFrameSequence = LRDeltaValues.map((turnDelta, i) => () => {
      moveCamera(
        { turnDelta: direction === 'right' ? turnDelta : -turnDelta },
        scaffoldValues,
        light
      )
      drawTerrain(renderGrid, scaffoldValues)
      if (i === LRDeltaValues.length - 1) {
        Distortion.slideTurn(direction)
      }
    })
    RenderQueue.update(drawFrameSequence)
  }

export const renderGoDownstairs: RenderHandler = ({ renderGrid, scaffoldValues, light }) => {
  const drawFrameSequence = DownstairsValues.map((values, i) => () => {
    if (i === 0) {
      triggerFadeOut(DownstairsValues.length)
      eventBlockRequired()
    }
    moveCamera(values, scaffoldValues, light)
    drawTerrain(renderGrid, scaffoldValues)
  })
  RenderQueue.push(...drawFrameSequence)
}

export const renderProceedToNextFloor: RenderHandler = ({
  speed,
  scaffoldValues,
  light,
  texture,
}) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta, i) => () => {
    if (i === 0) {
      updateAesthetics(texture)
      eventBlockRequired()
    }
    moveCamera({ zDelta }, scaffoldValues, light)
    drawTerrain(corridorToNextFloor, scaffoldValues)
    if (i === GoMoveMagValues.length - 1) {
      unblockEvents()
    }
  })
  RenderQueue.push(...drawFrameSequence)
}

const DieFrames = 48
export const renderDie: RenderHandler = ({ renderGrid, scaffoldValues, light }) => {
  const dieSequence = [...Array(DieFrames)].map((_, i) => () => {
    if (i === 0) {
      triggerFadeOut(DieFrames)
      eventBlockRequired()
    }
    cameraReset(light)
    drawTerrain(renderGrid, scaffoldValues)
    if (i === DieFrames - 1) {
      resurrectEvent()
    }
  })
  RenderQueue.update(dieSequence)
  logger.log(RenderQueue.length)
}

export const renderResurrect: RenderHandler = ({ speed, scaffoldValues, light, texture }) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta, i) => () => {
    if (i === 0) {
      updateAesthetics(texture)
      eventBlockRequired()
    }
    moveCamera({ zDelta }, scaffoldValues, light)
    drawTerrain(corridorToNextFloor, scaffoldValues)
    if (i === GoMoveMagValues.length - 1) {
      unblockEvents()
    }
  })
  RenderQueue.update(drawFrameSequence)
}
