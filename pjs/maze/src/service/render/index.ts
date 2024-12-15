import { LR } from 'src/utils/direction'
import {
  blockControlRequired,
  blockStatusChangeRequired,
  idleStatusChangeRequired,
  resurrectEvent,
  unblockControlRequired,
  unblockStatusChangeRequired,
} from '../../domain/events'
import { RenderHandler } from '../consumer'
import { getDefaultEye, getMovementEye } from './scene/eye.ts'
import { calcSmoothValue, getLights } from './scene/light.ts'
import {
  getGoDeltaArray,
  getTurnLRDeltaArray,
  GoDownstairsMovement,
  ProceedToNextFloorMovement,
} from './scene/movement.ts'
import { Distortion } from './scaffold/distortion'
import { RenderQueue } from './queue'
import { soundPack } from './sound'
import { getUnits } from './scene'
import { renderScene as rs, Scene } from 'maze-gl'
import { updateRandomValues } from './mesh/material'
import { resetColors, resolveFloorColor, resolveFrameColor } from './color'
import { drawButtons, hideButtons } from '../interface/buttons'
import { getEffect } from './scene/effect.ts'
import { corridorToNextFloor, debugStairClose } from '../../domain/query/structure/renderGrid/scenes.ts'

const renderScene = (scene: Scene) => {
  updateRandomValues()
  rs(scene)
  // rs({ ...scene, screenEffect: getScreenEffect('edge') })
}

export const renderCurrentView: RenderHandler = ({ structure, vision }) => {
  const drawFrame = () => {
    drawButtons()
    idleStatusChangeRequired()
    const { lightColor, unlitColor } = resolveFrameColor(vision.color.frame)
    const eye = getDefaultEye()
    // const units = getUnits({ ...structure, renderGrid: debugStairClose })
    const units = getUnits(structure)
    const lights = getLights(eye, lightColor, vision.light)
    const effect = getEffect(vision.effectParams)
    renderScene({ units, eye, lights, unlitColor, effect })
  }
  RenderQueue.push(drawFrame)
}

export const renderGo: RenderHandler = ({ structure, vision, movement }) => {
  const GoMoveMagValues = getGoDeltaArray(movement.speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta, i) => () => {
    if (i === 0) {
      soundPack.playWalk()
      blockControlRequired()
    }
    drawButtons(i === 0 ? 'up' : undefined)
    const { lightColor, unlitColor } = resolveFrameColor(vision.color.frame)
    const eye = getMovementEye({ move: zDelta }, structure.scaffold)
    const units = getUnits(structure)
    const lights = getLights(eye, lightColor, vision.light)
    const effect = getEffect(vision.effectParams)
    renderScene({ units, eye, lights, unlitColor, effect })

    if (i === GoMoveMagValues.length - 1) {
      unblockControlRequired()
      Distortion.slideGo()
    }
  })
  RenderQueue.update(drawFrameSequence)
}

export const renderTurn =
  (direction: LR): RenderHandler =>
  ({ structure, vision, movement }) => {
    const LRDeltaValues = getTurnLRDeltaArray(movement.speed)
    const drawFrameSequence = LRDeltaValues.map((turnDelta, i) => () => {
      if (i === 0) {
        blockControlRequired()
        drawButtons(i === 0 ? direction : undefined)
      }
      const { lightColor, unlitColor } = resolveFrameColor(vision.color.frame)
      const eye = getMovementEye({ turn: direction === 'right' ? turnDelta : -turnDelta }, structure.scaffold)
      const units = getUnits(structure)
      const lights = getLights(eye, lightColor, vision.light)
      const effect = getEffect(vision.effectParams)
      renderScene({ units, eye, lights, unlitColor, effect })

      if (i === LRDeltaValues.length - 1) {
        unblockControlRequired()
        Distortion.slideTurn(direction)
      }
    })
    RenderQueue.update(drawFrameSequence)
  }

export const renderGoDownstairs: RenderHandler = ({ structure, vision, movement }) => {
  const animation = movement.stairAnimation.goDownstairs
  const movementValueArray = GoDownstairsMovement[animation](movement.speed)

  const drawFrameSequence = movementValueArray.map((movement, i) => () => {
    if (i === 0) {
      hideButtons()
      blockControlRequired()
      blockStatusChangeRequired()
    }

    if (animation === 'warp') {
      if (i === 0) {
        soundPack.playWarp()
      }
    } else if (animation === 'lift') {
      if (i === 0) {
        soundPack.playLift()
      }
    } else {
      if (i % 12 === 0) {
        soundPack.playWalk()
      }
    }

    const { lightColor, unlitColor } = resolveFrameColor(vision.color.frame)

    const eye = getMovementEye(movement, structure.scaffold)
    const units = getUnits({ ...structure, renderGrid: debugStairClose })
    // const units = getUnits(structure)

    const halfFrames = movementValueArray.length / 2
    const fadeOutStage = i > halfFrames ? calcSmoothValue(i - halfFrames, halfFrames) : 0

    const lights = getLights(eye, lightColor, vision.light, { out: fadeOutStage })

    const effect = getEffect(vision.effectParams)
    renderScene({ units, eye, lights, unlitColor, effect })
    if (i === movementValueArray.length - 1) {
      unblockControlRequired()
      unblockStatusChangeRequired()
    }
  })
  RenderQueue.push(...drawFrameSequence)
}

export const renderProceedToNextFloor: RenderHandler = ({ structure, vision, movement }) => {
  const animation = movement.stairAnimation.proceedToNextFloor
  const movementValueArray = ProceedToNextFloorMovement[animation](movement.speed)
  const drawFrameSequence = movementValueArray.map((movement, i) => () => {
    if (i === 0) {
      hideButtons()
      blockControlRequired()
      blockStatusChangeRequired()
    }
    if (animation === 'corridor') {
      if (i % 12 === 0) {
        soundPack.playWalk()
      }
    }
    if (i < 16) {
      resolveFloorColor(vision.color.floor) // 16x
    }

    const { lightColor, unlitColor } = resolveFrameColor(vision.color.frame)
    const eye = getMovementEye(movement, structure.scaffold)

    const units = getUnits({
      ...structure,
      renderGrid: animation === 'still' ? structure.renderGrid : corridorToNextFloor,
    })

    const fadeInStage = calcSmoothValue(i, movementValueArray.length)
    const lights = getLights(eye, lightColor, vision.light, { in: fadeInStage })

    const effect = getEffect(vision.effectParams)
    renderScene({ units, eye, lights, unlitColor, effect })
    if (i === movementValueArray.length - 1) {
      unblockControlRequired()
      unblockStatusChangeRequired()
    }
  })
  RenderQueue.push(...drawFrameSequence)
}

const DieFrames = 48
export const renderDie: RenderHandler = ({ structure, vision }) => {
  const dieSequence = [...Array(DieFrames)].map((_, i) => () => {
    if (i === 0) {
      hideButtons()
      blockControlRequired()
      blockStatusChangeRequired()
    }
    const { lightColor, unlitColor } = resolveFrameColor(vision.color.frame)
    const eye = getDefaultEye()
    const units = getUnits(structure)
    const fadeOutStage = (i + 1) / DieFrames
    const lights = getLights(eye, lightColor, vision.light, { out: fadeOutStage })
    const effect = getEffect(vision.effectParams)
    renderScene({ units, eye, lights, unlitColor, effect })

    if (i === DieFrames - 1) {
      resurrectEvent()
    }
  })
  RenderQueue.update(dieSequence)
}

const ResurrectFrames = 32
export const renderResurrect: RenderHandler = ({ structure, vision }) => {
  const drawFrameSequence = [...Array(ResurrectFrames)].map((_, i) => () => {
    if (i === 0) {
      resetColors()
      hideButtons()
      blockControlRequired()
      blockStatusChangeRequired()
    }
    const { lightColor, unlitColor } = resolveFrameColor(vision.color.frame)
    const eye = getDefaultEye()
    const units = getUnits(structure)
    const fadeInStage = (i + 1) / ResurrectFrames
    const lights = getLights(eye, lightColor, vision.light, { in: fadeInStage })
    const effect = getEffect(vision.effectParams)
    renderScene({ units, eye, lights, unlitColor, effect })
    if (i === ResurrectFrames - 1) {
      unblockControlRequired()
      unblockStatusChangeRequired()
    }
  })
  RenderQueue.update(drawFrameSequence)
}
