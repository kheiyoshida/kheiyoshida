import { LR } from 'src/utils/direction'
import {
  blockControlRequired,
  blockStatusChangeRequired,
  resurrectEvent,
  unblockControlRequired,
  unblockStatusChangeRequired,
} from '../../domain/events'
import { corridorToNextFloor } from '../../domain/translate/renderGrid/scenes'
import { RenderHandler } from '../consumer'
import { getDefaultEye, getMovementEye } from './camera'
import { triggerFadeOut } from './camera/light'
import { getGoDeltaArray, getTurnLRDeltaArray, StairAnimationFrameValues } from './camera/movement'
import { drawTerrain } from './draw'
import { Distortion } from './scaffold/distortion'
import { RenderQueue } from './queue'
import { soundPack } from './sound'

export const renderCurrentView: RenderHandler = ({ renderGrid, scaffoldValues }) => {
  const drawFrame = () => {
    const eye = getDefaultEye()
    drawTerrain(renderGrid, scaffoldValues, eye)
  }
  RenderQueue.push(drawFrame)
}

export const renderGo: RenderHandler = ({ renderGrid, speed, scaffoldValues }) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta, i) => () => {
    if (i === 0) {
      soundPack.playWalk()
      blockControlRequired()
    }
    const eye = getMovementEye({ move: zDelta }, scaffoldValues)
    drawTerrain(renderGrid, scaffoldValues, eye)
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
  ({ renderGrid, speed, scaffoldValues, }) => {
    const LRDeltaValues = getTurnLRDeltaArray(speed)
    const drawFrameSequence = LRDeltaValues.map((turnDelta, i) => () => {
      if (i === 0) {
        blockControlRequired()
      }
      const eye = getMovementEye(
        { turn: direction === 'right' ? turnDelta : -turnDelta },
        scaffoldValues,
      )
      drawTerrain(renderGrid, scaffoldValues, eye)
      if (i === Math.floor((LRDeltaValues.length * 3) / 4)) {
        unblockControlRequired()
      }
      if (i === LRDeltaValues.length - 1) {
        Distortion.slideTurn(direction)
      }
    })
    RenderQueue.update(drawFrameSequence)
  }

export const renderGoDownstairs: RenderHandler = ({ renderGrid, scaffoldValues, light }) => {
  const drawFrameSequence = StairAnimationFrameValues.map((values, i) => () => {
    if (i === 0) {
      soundPack.playStairs()
      triggerFadeOut(StairAnimationFrameValues.length)
      blockControlRequired()
      blockStatusChangeRequired()
    }
    const eye = getMovementEye(values, scaffoldValues)
    drawTerrain(renderGrid, scaffoldValues, eye)
    if (i === StairAnimationFrameValues.length - 1) {
      unblockControlRequired()
      unblockStatusChangeRequired()
    }
  })
  RenderQueue.push(...drawFrameSequence)
}

export const renderProceedToNextFloor: RenderHandler = ({ speed, scaffoldValues, light }) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta, i) => () => {
    if (i === 0) {
      blockControlRequired()
      blockStatusChangeRequired()
    }
    if (i % 8 === 0) {
      soundPack.playWalk()
    }
    const eye = getMovementEye({ move: zDelta }, scaffoldValues)
    drawTerrain(corridorToNextFloor, scaffoldValues, eye)
    if (i === GoMoveMagValues.length - 1) {
      unblockControlRequired()
      unblockStatusChangeRequired()
    }
  })
  RenderQueue.push(...drawFrameSequence)
}

const DieFrames = 48
export const renderDie: RenderHandler = ({ renderGrid, scaffoldValues, light }) => {
  const dieSequence = [...Array(DieFrames)].map((_, i) => () => {
    if (i === 0) {
      triggerFadeOut(DieFrames)
      blockControlRequired()
      blockStatusChangeRequired()
    }
    drawTerrain(renderGrid, scaffoldValues, getDefaultEye())
    if (i === DieFrames - 1) {
      resurrectEvent()
    }
  })
  RenderQueue.update(dieSequence)
}

export const renderResurrect: RenderHandler = ({ speed, scaffoldValues, light }) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta, i) => () => {
    if (i === 0) {
      blockControlRequired()
      blockStatusChangeRequired()
    }
    const eye = getMovementEye({ move: zDelta }, scaffoldValues, )
    drawTerrain(corridorToNextFloor, scaffoldValues, eye)
    if (i === GoMoveMagValues.length - 1) {
      unblockControlRequired()
      unblockStatusChangeRequired()
    }
  })
  RenderQueue.update(drawFrameSequence)
}
