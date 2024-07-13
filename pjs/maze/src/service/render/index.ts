import { LR } from 'src/utils/direction'
import { fireByRate } from 'utils'
import {
  blockControlRequired,
  blockStatusChangeRequired,
  resurrectEvent,
  unblockControlRequired,
  unblockStatusChangeRequired,
} from '../../domain/events'
import { corridorToNextFloor } from '../../domain/translate/renderGrid/scenes'
import { RenderHandler } from '../consumer'
import { cameraReset, moveCamera } from './camera'
import { triggerFadeOut } from './camera/light'
import { StairAnimationFrameValues, getGoDeltaArray, getTurnLRDeltaArray } from './camera/movement'
import { drawTerrain, updateAesthetics } from './draw'
import { eraseGeometriesInMemory } from './draw/finalise'
import { ObjectSkinFactory } from './draw/finalise/geometry/texture'
import { Distortion } from './draw/scaffold/distortion'
import { RenderQueue } from './queue'
import { soundPack } from './sound'

export const renderCurrentView: RenderHandler = ({
  renderGrid,
  light,
  scaffoldValues,
  terrainStyle,
  objectParams,
}) => {
  const drawFrame = () => {
    cameraReset(light)
    drawTerrain(renderGrid, scaffoldValues, terrainStyle, objectParams)

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
  objectParams,
}) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta, i) => () => {
    if (i === 0) {
      soundPack.playWalk()
      blockControlRequired()
    }
    moveCamera({ zDelta }, scaffoldValues, light)
    drawTerrain(renderGrid, scaffoldValues, terrainStyle, objectParams)
    if (i === Math.floor((GoMoveMagValues.length * 3) / 4)) {
      unblockControlRequired()
    }
    if (i === GoMoveMagValues.length - 1) {
      Distortion.slideGo()
    }
  })
  RenderQueue.update(drawFrameSequence)
}

export const renderTurn =
  (direction: LR): RenderHandler =>
  ({ renderGrid, speed, scaffoldValues, light, terrainStyle, objectParams }) => {
    const LRDeltaValues = getTurnLRDeltaArray(speed)
    const drawFrameSequence = LRDeltaValues.map((turnDelta, i) => () => {
      if (i === 0) {
        blockControlRequired()
      }
      moveCamera(
        { turnDelta: direction === 'right' ? turnDelta : -turnDelta },
        scaffoldValues,
        light
      )
      drawTerrain(renderGrid, scaffoldValues, terrainStyle, objectParams)
      if (i === Math.floor((LRDeltaValues.length * 3) / 4)) {
        unblockControlRequired()
      }
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
  objectParams,
}) => {
  const drawFrameSequence = StairAnimationFrameValues.map((values, i) => () => {
    if (i === 0) {
      soundPack.playStairs()
      triggerFadeOut(StairAnimationFrameValues.length)
      blockControlRequired()
      blockStatusChangeRequired()
    }
    moveCamera(values, scaffoldValues, light)
    ObjectSkinFactory.renew()
    drawTerrain(renderGrid, scaffoldValues, terrainStyle, objectParams)
    if (i === StairAnimationFrameValues.length - 1) {
      unblockControlRequired()
      unblockStatusChangeRequired()
    }
  })
  RenderQueue.push(...drawFrameSequence)
}

export const renderProceedToNextFloor: RenderHandler = ({
  speed,
  scaffoldValues,
  light,
  texture,
  terrainStyle,
  objectParams,
}) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta, i) => () => {
    if (i === 0) {
      updateAesthetics(texture)
      eraseGeometriesInMemory()
      blockControlRequired()
      blockStatusChangeRequired()
    }
    if (i % 8 === 0) {
      soundPack.playWalk()
    }
    moveCamera({ zDelta }, scaffoldValues, light)
    drawTerrain(corridorToNextFloor, scaffoldValues, terrainStyle, objectParams)
    if (i === GoMoveMagValues.length - 1) {
      unblockControlRequired()
      unblockStatusChangeRequired()
    }
  })
  RenderQueue.push(...drawFrameSequence)
}

const DieFrames = 48
export const renderDie: RenderHandler = ({
  renderGrid,
  scaffoldValues,
  light,
  terrainStyle,
  objectParams,
}) => {
  const dieSequence = [...Array(DieFrames)].map((_, i) => () => {
    if (i === 0) {
      triggerFadeOut(DieFrames)
      blockControlRequired()
      blockStatusChangeRequired()
    }
    cameraReset(light)
    drawTerrain(renderGrid, scaffoldValues, terrainStyle, objectParams)
    if (i === DieFrames - 1) {
      resurrectEvent()
    }
  })
  RenderQueue.update(dieSequence)
}

export const renderResurrect: RenderHandler = ({
  speed,
  scaffoldValues,
  light,
  texture,
  terrainStyle,
  objectParams,
}) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta, i) => () => {
    if (i === 0) {
      updateAesthetics(texture)
      blockControlRequired()
      blockStatusChangeRequired()
    }
    moveCamera({ zDelta }, scaffoldValues, light)
    drawTerrain(corridorToNextFloor, scaffoldValues, terrainStyle, objectParams)
    if (i === GoMoveMagValues.length - 1) {
      unblockControlRequired()
      unblockStatusChangeRequired()
    }
  })
  RenderQueue.update(drawFrameSequence)
}
