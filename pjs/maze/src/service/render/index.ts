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
import { resetColors, resolveFloorColor, resolveFrameColor } from './color'
import { drawButtons, hideButtons } from '../interface/buttons'
import { getEffect } from './scene/effect.ts'
import { corridorToNextFloor } from '../../integration/query/structure/scenes.ts'
import { getScreenEffect } from './scene/screenEffect'
import { renderScene } from 'maze-gl'
import { convertRenderGridToUnitSpecList } from '../../integration/query/structure/unit'

export const renderCurrentView: RenderHandler = ({ structure, vision }) => {
  const drawFrame = () => {
    drawButtons()
    idleStatusChangeRequired()
    const { lightColor, unlitColor } = resolveFrameColor(vision.color.frame, vision.mode)
    const eye = getDefaultEye()
    // const units = getUnits({ ...structure, renderGrid: debugStairClose })
    const units = getUnits(vision.mode, structure)
    const lights = getLights(eye, lightColor, vision.light)
    const effect = getEffect(vision.effectParams)
    const screenEffect = getScreenEffect(vision.mode, vision.screenEffectParams, unlitColor)
    renderScene({ units, eye, lights, unlitColor, effect, screenEffect })
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
    const { lightColor, unlitColor } = resolveFrameColor(vision.color.frame, vision.mode)
    const eye = getMovementEye({ move: zDelta }, structure.scaffold)
    const units = getUnits(vision.mode, structure)
    const lights = getLights(eye, lightColor, vision.light)
    const effect = getEffect(vision.effectParams)
    const screenEffect = getScreenEffect(vision.mode, vision.screenEffectParams, unlitColor)
    renderScene({ units, eye, lights, unlitColor, effect, screenEffect })

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
      const { lightColor, unlitColor } = resolveFrameColor(vision.color.frame, vision.mode)
      const eye = getMovementEye({ turn: direction === 'right' ? turnDelta : -turnDelta }, structure.scaffold)
      const units = getUnits(vision.mode, structure)

      const lights = getLights(eye, lightColor, vision.light)
      const effect = getEffect(vision.effectParams)
      const screenEffect = getScreenEffect(vision.mode, vision.screenEffectParams, unlitColor)

      renderScene({ units, eye, lights, unlitColor, effect, screenEffect })

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

    const { lightColor, unlitColor } = resolveFrameColor(vision.color.frame, vision.mode)

    const eye = getMovementEye(movement, structure.scaffold)
    const units = getUnits(vision.mode, structure)

    const halfFrames = movementValueArray.length / 2
    const fade = i > halfFrames ? calcSmoothValue(i - halfFrames, halfFrames) : 0

    const lights = getLights(eye, lightColor, vision.light)
    const screenEffect = getScreenEffect(vision.mode, vision.screenEffectParams, unlitColor, fade)
    const effect = getEffect(vision.effectParams)
    renderScene({ units, eye, lights, unlitColor, effect, screenEffect })
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

    const { lightColor, unlitColor } = resolveFrameColor(vision.color.frame, vision.mode)
    const eye = getMovementEye(movement, structure.scaffold)

    const units = getUnits(vision.mode, {
      ...structure,
      renderGrid:
        animation === 'still'
          ? structure.renderGrid
          : convertRenderGridToUnitSpecList(corridorToNextFloor, structure.terrainStyle),
    })

    const fade =
      i >= movementValueArray.length / 2 ? 0 : 1 - calcSmoothValue(i, movementValueArray.length / 2)
    const lights = getLights(eye, lightColor, vision.light)

    const effect = getEffect(vision.effectParams)
    const screenEffect = getScreenEffect(vision.mode, vision.screenEffectParams, unlitColor, fade)
    renderScene({ units, eye, lights, unlitColor, effect, screenEffect })
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
    const { lightColor, unlitColor } = resolveFrameColor(vision.color.frame, vision.mode)
    const eye = getDefaultEye()
    const units = getUnits(vision.mode, structure)
    const fade = (i + 1) / DieFrames
    const lights = getLights(eye, lightColor, vision.light)
    const effect = getEffect(vision.effectParams)
    const screenEffect = getScreenEffect(vision.mode, vision.screenEffectParams, unlitColor, fade)
    renderScene({ units, eye, lights, unlitColor, effect, screenEffect })
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
    const { lightColor, unlitColor } = resolveFrameColor(vision.color.frame, vision.mode)
    const eye = getDefaultEye()
    const units = getUnits(vision.mode, structure)
    const fade = 1 - (i + 1) / ResurrectFrames
    const lights = getLights(eye, lightColor, vision.light)
    const effect = getEffect(vision.effectParams)
    const screenEffect = getScreenEffect(vision.mode, vision.screenEffectParams, unlitColor, fade)
    renderScene({ units, eye, lights, unlitColor, effect, screenEffect })
    if (i === ResurrectFrames - 1) {
      unblockControlRequired()
      unblockStatusChangeRequired()
    }
  })
  RenderQueue.update(drawFrameSequence)
}
