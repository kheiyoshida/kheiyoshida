import { LR } from 'src/utils/direction'
import { fireByRate } from 'utils'
import { eventBlockRequired, resurrectEvent, unblockEvents } from '../../domain/events'
import { corridorToNextFloor } from '../../domain/translate/renderGrid/scenes'
import { logger } from '../../utils/logger'
import { RenderHandler } from '../consumer'
import { cameraReset, moveCamera } from './camera'
import { triggerFadeOut } from './camera/light'
import { StairAnimationFrameValues, getGoDeltaArray, getTurnLRDeltaArray } from './camera/movement'
import { drawTerrain, updateAesthetics } from './draw'
import { eraseGeometriesInMemory, updateStaticModelLevels } from './draw/finalise'
import { ObjectSkinFactory } from './draw/finalise/geometry/texture'
import { Distortion } from './draw/scaffold/distortion'
import { RenderQueue } from './queue'
import { soundPack } from './sound'

export const renderCurrentView: RenderHandler = ({
  renderGrid,
  light,
  scaffoldValues,
  terrainStyle,
}) => {
  const drawFrame = () => {
    cameraReset(light)
    drawTerrain(renderGrid, scaffoldValues, terrainStyle)

    if (fireByRate(0.5) ){
      updateStaticModelLevels()
    }
    if (fireByRate(0.3)) {
      ObjectSkinFactory.renew()
    }
  }
  RenderQueue.push(drawFrame)
}

export const renderGo: RenderHandler = ({
  renderGrid,
  speed,
  scaffoldValues,
  light,
  terrainStyle,
}) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta, i) => () => {
    if (i === 0) {
      soundPack.playWalk()
    }
    moveCamera({ zDelta }, scaffoldValues, light)
    drawTerrain(renderGrid, scaffoldValues, terrainStyle)
    if (i === GoMoveMagValues.length - 1) {
      Distortion.slideGo()
    }
  })
  RenderQueue.update(drawFrameSequence)
}

export const renderTurn =
  (direction: LR): RenderHandler =>
  ({ renderGrid, speed, scaffoldValues, light, terrainStyle }) => {
    const LRDeltaValues = getTurnLRDeltaArray(speed)
    const drawFrameSequence = LRDeltaValues.map((turnDelta, i) => () => {
      moveCamera(
        { turnDelta: direction === 'right' ? turnDelta : -turnDelta },
        scaffoldValues,
        light
      )
      drawTerrain(renderGrid, scaffoldValues, terrainStyle)
      if (i === LRDeltaValues.length - 1) {
        Distortion.slideTurn(direction)
      }
    })
    RenderQueue.update(drawFrameSequence)
  }

export const renderGoDownstairs: RenderHandler = ({
  renderGrid,
  scaffoldValues,
  light,
  terrainStyle,
}) => {
  const drawFrameSequence = StairAnimationFrameValues.map((values, i) => () => {
    if (i === 0) {
      soundPack.playStairs()
      triggerFadeOut(StairAnimationFrameValues.length)
      eventBlockRequired()
    }
    moveCamera(values, scaffoldValues, light)
    ObjectSkinFactory.renew()
    drawTerrain(renderGrid, scaffoldValues, terrainStyle)
  })
  RenderQueue.push(...drawFrameSequence)
}

export const renderProceedToNextFloor: RenderHandler = ({
  speed,
  scaffoldValues,
  light,
  texture,
  terrainStyle,
}) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta, i) => () => {
    if (i === 0) {
      updateAesthetics(texture)
      eraseGeometriesInMemory()
      eventBlockRequired()
    }
    if (i % 8 === 0) {
      soundPack.playWalk()
    }
    moveCamera({ zDelta }, scaffoldValues, light)
    drawTerrain(corridorToNextFloor, scaffoldValues, terrainStyle)
    if (i === GoMoveMagValues.length - 1) {
      unblockEvents()
    }
  })
  RenderQueue.push(...drawFrameSequence)
}

const DieFrames = 48
export const renderDie: RenderHandler = ({ renderGrid, scaffoldValues, light, terrainStyle }) => {
  const dieSequence = [...Array(DieFrames)].map((_, i) => () => {
    if (i === 0) {
      triggerFadeOut(DieFrames)
      eventBlockRequired()
    }
    cameraReset(light)
    drawTerrain(renderGrid, scaffoldValues, terrainStyle)
    if (i === DieFrames - 1) {
      resurrectEvent()
    }
  })
  RenderQueue.update(dieSequence)
  logger.log(RenderQueue.length)
}

export const renderResurrect: RenderHandler = ({
  speed,
  scaffoldValues,
  light,
  texture,
  terrainStyle,
}) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta, i) => () => {
    if (i === 0) {
      updateAesthetics(texture)
      eventBlockRequired()
    }
    moveCamera({ zDelta }, scaffoldValues, light)
    drawTerrain(corridorToNextFloor, scaffoldValues, terrainStyle)
    if (i === GoMoveMagValues.length - 1) {
      unblockEvents()
    }
  })
  RenderQueue.update(drawFrameSequence)
}
