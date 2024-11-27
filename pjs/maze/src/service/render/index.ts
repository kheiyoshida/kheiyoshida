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
import { getDefaultEye, getMovementEye } from './scene/eye.ts'
import { getLights, triggerFadeOut } from './scene/light.ts'
import { getGoDeltaArray, getTurnLRDeltaArray, StairAnimationFrameValues } from './scene/movement.ts'
import { Distortion } from './scaffold/distortion'
import { RenderQueue } from './queue'
import { soundPack } from './sound'
import { getUnits } from './scene'
import { renderScene as rs, Scene } from 'maze-gl'
import { updateRandomValues } from './mesh/material'

const renderScene = (scene: Scene) => {
  updateRandomValues()
  rs(scene)
}

export const renderCurrentView: RenderHandler = ({ renderGrid, scaffoldValues, light, terrainStyle }) => {
  const drawFrame = () => {
    const eye = getDefaultEye()
    const units = getUnits(renderGrid, scaffoldValues, terrainStyle)
    const lights = getLights(eye, light)
    renderScene({ units, eye, lights })
  }
  RenderQueue.push(drawFrame)
}

export const renderGo: RenderHandler = ({ renderGrid, speed, scaffoldValues, light, terrainStyle }) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta, i) => () => {
    if (i === 0) {
      soundPack.playWalk()
      blockControlRequired()
    }
    const eye = getMovementEye({ move: zDelta }, scaffoldValues)
    const units = getUnits(renderGrid, scaffoldValues, terrainStyle)
    const lights = getLights(eye, light)
    renderScene({ units, eye, lights })
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
  ({ renderGrid, speed, scaffoldValues, light, terrainStyle }) => {
    const LRDeltaValues = getTurnLRDeltaArray(speed)
    const drawFrameSequence = LRDeltaValues.map((turnDelta, i) => () => {
      if (i === 0) {
        blockControlRequired()
      }
      const eye = getMovementEye({ turn: direction === 'right' ? turnDelta : -turnDelta }, scaffoldValues)
      const units = getUnits(renderGrid, scaffoldValues, terrainStyle)
      const lights = getLights(eye, light)
      renderScene({ units, eye, lights })
      if (i === Math.floor((LRDeltaValues.length * 3) / 4)) {
        unblockControlRequired()
      }
      if (i === LRDeltaValues.length - 1) {
        Distortion.slideTurn(direction)
      }
    })
    RenderQueue.update(drawFrameSequence)
  }

export const renderGoDownstairs: RenderHandler = ({ renderGrid, scaffoldValues, light, terrainStyle }) => {
  const drawFrameSequence = StairAnimationFrameValues.map((values, i) => () => {
    if (i === 0) {
      soundPack.playStairs()
      triggerFadeOut(StairAnimationFrameValues.length)
      blockControlRequired()
      blockStatusChangeRequired()
    }
    const eye = getMovementEye(values, scaffoldValues)
    const units = getUnits(renderGrid, scaffoldValues, terrainStyle)
    const lights = getLights(eye, light)
    renderScene({ units, eye, lights })
    if (i === StairAnimationFrameValues.length - 1) {
      unblockControlRequired()
      unblockStatusChangeRequired()
    }
  })
  RenderQueue.push(...drawFrameSequence)
}

export const renderProceedToNextFloor: RenderHandler = ({ speed, scaffoldValues, light, terrainStyle }) => {
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
    const units = getUnits(corridorToNextFloor, scaffoldValues, terrainStyle)
    const lights = getLights(eye, light)
    renderScene({ units, eye, lights })
    if (i === GoMoveMagValues.length - 1) {
      unblockControlRequired()
      unblockStatusChangeRequired()
    }
  })
  RenderQueue.push(...drawFrameSequence)
}

const DieFrames = 48
export const renderDie: RenderHandler = ({ renderGrid, scaffoldValues, light, terrainStyle }) => {
  const dieSequence = [...Array(DieFrames)].map((_, i) => () => {
    if (i === 0) {
      triggerFadeOut(DieFrames)
      blockControlRequired()
      blockStatusChangeRequired()
    }
    const eye = getDefaultEye()
    const units = getUnits(renderGrid, scaffoldValues, terrainStyle)
    const lights = getLights(eye, light)
    renderScene({ units, eye, lights })

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
  renderGrid,
  terrainStyle,
}) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta, i) => () => {
    if (i === 0) {
      blockControlRequired()
      blockStatusChangeRequired()
    }
    // const eye = getMovementEye({ move: zDelta }, scaffoldValues)
    const eye = getDefaultEye()
    const units = getUnits(renderGrid, scaffoldValues, terrainStyle)
    const lights = getLights(eye, light)
    renderScene({ units, eye, lights })
    if (i === GoMoveMagValues.length - 1) {
      unblockControlRequired()
      unblockStatusChangeRequired()
    }
  })
  RenderQueue.update(drawFrameSequence)
}
