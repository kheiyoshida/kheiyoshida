import { LR } from 'src/core/grid/direction.ts'
import {
  blockControlRequired,
  blockStatusChangeRequired,
  idleStatusChangeRequired,
  resurrectEvent,
  unblockControlRequired,
  unblockStatusChangeRequired,
} from '../../integration/events.ts'
import { RenderHandler } from '../consumer'
import { getDefaultEye, getMovementEye } from './scene/eye.ts'
import { calcSmoothValue } from './scene/light.ts'
import {
  getGoDeltaArray,
  getTurnLRDeltaArray,
  GoDownstairsMovement,
  proceedToNextFloorMovement,
} from './scene/movement.ts'
import { RenderQueue } from './queue'
import { soundPack } from './sound'
import { getUnits } from './scene'
import { resetColors, resolveFloorColor, resolveFrameColor } from './color'
import { drawButtons, hideButtons } from '../interface/buttons'
import { renderScene } from 'maze-gl'
import { scaffold } from './scaffold'
import { alternativeViewService } from '../../integration/query'

export const renderCurrentView: RenderHandler = ({ structure, vision }) => {
  const drawFrame = () => {
    drawButtons()
    idleStatusChangeRequired()
    const { unlitColor } = resolveFrameColor(vision.color.frame, vision.mode)
    const eye = getDefaultEye()
    const units = getUnits(structure)
    renderScene({ units, eye, baseColor: unlitColor, effect: vision.effectParams })
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
    const { unlitColor } = resolveFrameColor(vision.color.frame, vision.mode)
    const eye = getMovementEye({ move: zDelta }, structure.scaffold)
    const units = getUnits(structure)
    renderScene({ units, eye, baseColor: unlitColor, effect: vision.effectParams })

    if (i === GoMoveMagValues.length - 1) {
      unblockControlRequired()
      scaffold.slide()
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
      const { unlitColor } = resolveFrameColor(vision.color.frame, vision.mode)
      const eye = getMovementEye({ turn: direction === 'right' ? turnDelta : -turnDelta }, structure.scaffold)
      const units = getUnits(structure)

      renderScene({ units, eye, baseColor: unlitColor, effect: vision.effectParams })

      if (i === LRDeltaValues.length - 1) {
        unblockControlRequired()
        scaffold.turn(direction)
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

    if (animation === 'lift') {
      if (i === 0) {
        soundPack.playLift()
      }
    } else {
      if (i % 12 === 0) {
        soundPack.playWalk()
      }
    }

    const { unlitColor } = resolveFrameColor(vision.color.frame, vision.mode)

    const eye = getMovementEye(movement, structure.scaffold)
    const units = getUnits(structure, eye.position[1])

    const halfFrames = movementValueArray.length / 2
    const fade = i > halfFrames ? calcSmoothValue(i - halfFrames, halfFrames) : 0

    console.log(fade)

    renderScene({
      units,
      eye,
      baseColor: unlitColor,
      effect: { ...vision.effectParams, fade: { fadeLevel: fade } },
    })
    if (i === movementValueArray.length - 1) {
      unblockControlRequired()
      unblockStatusChangeRequired()
    }
  })
  RenderQueue.push(...drawFrameSequence)
}

export const renderProceedToNextFloor: RenderHandler = ({ structure, vision, movement }) => {
  const movementValueArray = proceedToNextFloorMovement(movement.speed)
  const drawFrameSequence = movementValueArray.map((movement, i) => () => {
    if (i === 0) {
      hideButtons()
      blockControlRequired()
      blockStatusChangeRequired()
    }

    if (i % 12 === 0) {
      soundPack.playWalk()
    }
    if (i < 16) {
      resolveFloorColor(vision.color.floor) // 16x
    }

    const { unlitColor } = resolveFrameColor(vision.color.frame, vision.mode)
    const eye = getMovementEye(movement, structure.scaffold)

    const units = getUnits({
      ...structure,
      view: alternativeViewService.getNextLevelView(structure.view),
    })

    const fade = 1.0 - calcSmoothValue(i, movementValueArray.length)

    renderScene({
      units,
      eye,
      baseColor: unlitColor,
      effect: { ...vision.effectParams, fade: { fadeLevel: fade } },
    })
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
    const { unlitColor } = resolveFrameColor(vision.color.frame, vision.mode)
    const eye = getDefaultEye()
    const units = getUnits(structure)
    const fade = (i + 1) / DieFrames
    renderScene({
      units,
      eye,
      baseColor: unlitColor,
      effect: { ...vision.effectParams, fade: { fadeLevel: fade } },
    })
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
    const { unlitColor } = resolveFrameColor(vision.color.frame, vision.mode)
    const eye = getDefaultEye()
    const units = getUnits(structure)
    const fade = 1 - (i + 1) / ResurrectFrames

    renderScene({
      units,
      eye,
      baseColor: unlitColor,
      effect: { ...vision.effectParams, fade: { fadeLevel: fade } },
    })
    if (i === ResurrectFrames - 1) {
      unblockControlRequired()
      unblockStatusChangeRequired()
    }
  })
  RenderQueue.update(drawFrameSequence)
}
