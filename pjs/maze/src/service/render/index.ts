import { LR } from 'src/utils/direction'
import {
  blockControlRequired,
  blockStatusChangeRequired,
  resurrectEvent,
  unblockControlRequired,
  unblockStatusChangeRequired,
} from '../../domain/events'
import { RenderHandler } from '../consumer'
import { getDefaultEye, getMovementEye } from './scene/eye.ts'
import { getLights } from './scene/light.ts'
import { getGoDeltaArray, getTurnLRDeltaArray, StairAnimationFrameValues } from './scene/movement.ts'
import { Distortion } from './scaffold/distortion'
import { RenderQueue } from './queue'
import { soundPack } from './sound'
import { getUnits } from './scene'
import { renderScene as rs, Scene } from 'maze-gl'
import { updateRandomValues } from './mesh/material'
import { resetColors, resolveFloorColor, resolveFrameColor } from './color'
import { DownFramesLength } from '../../config'

const renderScene = (scene: Scene) => {
  updateRandomValues()
  rs(scene)
}

export const renderCurrentView: RenderHandler = ({
  renderGrid,
  scaffoldValues,
  light,
  terrainStyle,
  color,
}) => {
  const drawFrame = () => {
    const { lightColor, unlitColor } = resolveFrameColor(color.frame)
    const eye = getDefaultEye()
    const units = getUnits(renderGrid, scaffoldValues, terrainStyle)
    const lights = getLights(eye, lightColor, light)
    renderScene({ units, eye, lights, unlitColor })
  }
  RenderQueue.push(drawFrame)
}

export const renderGo: RenderHandler = ({
  renderGrid,
  speed,
  scaffoldValues,
  light,
  terrainStyle,
  color,
}) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta, i) => () => {
    if (i === 0) {
      soundPack.playWalk()
      blockControlRequired()
    }
    const { lightColor, unlitColor } = resolveFrameColor(color.frame)
    const eye = getMovementEye({ move: zDelta }, scaffoldValues)
    const units = getUnits(renderGrid, scaffoldValues, terrainStyle)
    const lights = getLights(eye, lightColor, light)
    renderScene({ units, eye, lights, unlitColor })
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
  ({ renderGrid, speed, scaffoldValues, light, terrainStyle, color }) => {
    const LRDeltaValues = getTurnLRDeltaArray(speed)
    const drawFrameSequence = LRDeltaValues.map((turnDelta, i) => () => {
      if (i === 0) {
        blockControlRequired()
      }
      const { lightColor, unlitColor } = resolveFrameColor(color.frame)
      const eye = getMovementEye({ turn: direction === 'right' ? turnDelta : -turnDelta }, scaffoldValues)
      const units = getUnits(renderGrid, scaffoldValues, terrainStyle)
      const lights = getLights(eye, lightColor, light)
      renderScene({ units, eye, lights, unlitColor })
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
  color,
}) => {
  const drawFrameSequence = [...Array(DownFramesLength)].map((_, i) => () => {
    if (i === 0) {
      soundPack.playStairs()
      blockControlRequired()
      blockStatusChangeRequired()
    }
    const { lightColor, unlitColor } = resolveFrameColor(color.frame)
    const eye = getDefaultEye()
    const units = getUnits(renderGrid, scaffoldValues, terrainStyle)
    const fadeOutStage = (i + 1) / DownFramesLength
    const lights = getLights(eye, lightColor, light, { out: fadeOutStage })
    renderScene({ units, eye, lights, unlitColor })
    if (i === StairAnimationFrameValues.length - 1) {
      unblockControlRequired()
      unblockStatusChangeRequired()
    }
  })
  RenderQueue.push(...drawFrameSequence)
}

const nextFloorFadeInFrames = 16
export const renderProceedToNextFloor: RenderHandler = ({
  renderGrid,
  scaffoldValues,
  light,
  terrainStyle,
  color,
}) => {
  const drawFrameSequence = [...Array(nextFloorFadeInFrames)].map((_, i) => () => {
    if (i === 0) {
      blockControlRequired()
      blockStatusChangeRequired()
    }
    resolveFloorColor(color.floor) // 16x
    const { lightColor, unlitColor } = resolveFrameColor(color.frame)
    const eye = getDefaultEye()
    const units = getUnits(renderGrid, scaffoldValues, terrainStyle)
    const fadeInStage = (i + 1) / nextFloorFadeInFrames
    const lights = getLights(eye, lightColor, light, { in: fadeInStage })
    renderScene({ units, eye, lights, unlitColor })
    if (i === nextFloorFadeInFrames - 1) {
      unblockControlRequired()
      unblockStatusChangeRequired()
    }
  })
  RenderQueue.push(...drawFrameSequence)
}

const DieFrames = 48
export const renderDie: RenderHandler = ({ renderGrid, scaffoldValues, light, terrainStyle, color }) => {
  const dieSequence = [...Array(DieFrames)].map((_, i) => () => {
    if (i === 0) {
      blockControlRequired()
      blockStatusChangeRequired()
    }
    const { lightColor, unlitColor } = resolveFrameColor(color.frame)
    const eye = getDefaultEye()
    const units = getUnits(renderGrid, scaffoldValues, terrainStyle)
    const fadeOutStage = (i + 1) / DieFrames
    const lights = getLights(eye, lightColor, light, { out: fadeOutStage })
    renderScene({ units, eye, lights, unlitColor })

    if (i === DieFrames - 1) {
      resurrectEvent()
    }
  })
  RenderQueue.update(dieSequence)
}

const ResurrectFrames = 32
export const renderResurrect: RenderHandler = ({
  scaffoldValues,
  light,
  renderGrid,
  terrainStyle,
  color,
}) => {
  const drawFrameSequence = [...Array(ResurrectFrames)].map((_, i) => () => {
    if (i === 0) {
      resetColors()
      blockControlRequired()
      blockStatusChangeRequired()
    }
    const { lightColor, unlitColor } = resolveFrameColor(color.frame)
    const eye = getDefaultEye()
    const units = getUnits(renderGrid, scaffoldValues, terrainStyle)
    const fadeInStage = (i + 1) / ResurrectFrames
    const lights = getLights(eye, lightColor, light, { in: fadeInStage })
    renderScene({ units, eye, lights, unlitColor })
    if (i === ResurrectFrames - 1) {
      unblockControlRequired()
      unblockStatusChangeRequired()
    }
  })
  RenderQueue.update(drawFrameSequence)
}
