import { drawAtPosition3D } from 'p5utils/src/render'
import { Conf } from '../../../config'
import { RenderGrid } from '../../../domain/compose/renderSpec'
import { registerIntervalRenderSequence, reserveIntervalRender } from '../base'
import { RenderQueue } from '../queue'
import { Vision } from '../vision'
import { getPalette } from '../vision/color/palette'
import { DownstairsValues, GoMoveMagValues, TurnMoveLRDeltaValues, cameraReset, moveCamera } from './camera'
import { convertRenderGridIntoCoordinates } from './position'
import { corridorToNextFloor } from '../others/scenes'

export const renderCurrentView3d =
  ({ renderGrid }: Vision) =>
  () => {
    const render = () => {
      cameraReset()
      renderCurrentTerrain(renderGrid)
    }
    RenderQueue.push(render)
    RenderQueue.consume()
  }

export const renderCurrentTerrain = (renderGrid: RenderGrid) => {
  const [coordinates, stair] = convertRenderGridIntoCoordinates(renderGrid)
  p.background(getPalette().fill)
  coordinates.forEach((position3d) => {
    drawAtPosition3D(position3d, () => {
      p.fill(100)
      p.noStroke()
      p.box(1000)
    })
  })
  if (stair) {
    drawAtPosition3D(stair, () => {
      p.fill('red')
      p.box(500)
    })
  }
}

export const renderGo3d =
  ({ renderGrid, speed }: Vision) =>
  () => {
    const interval = speed * Conf.frameInterval
    const renderFns = GoMoveMagValues.map((val) => () => {
      moveCamera(val)
      renderCurrentTerrain(renderGrid)
    })
    registerIntervalRenderSequence(interval, renderFns)
  }

export const renderTurn3d = (d: 'r' | 'l') => ({renderGrid, speed}: Vision) => () => {
  const interval = speed * Conf.frameInterval
  const renderFns = TurnMoveLRDeltaValues.map((val) => () => {
    moveCamera(0, d === 'r' ? val : -val)
    renderCurrentTerrain(renderGrid)
  })
  registerIntervalRenderSequence(interval, renderFns)
}

export const renderGoDownstairs3d = ({renderGrid, speed}: Vision) => () => {
  const interval = speed * Conf.frameInterval * 3 
  const renderFns = DownstairsValues.map((values) => () => {
    moveCamera(...values)
    renderCurrentTerrain(renderGrid)
  })
  reserveIntervalRender(interval, renderFns)
}

export const renderProceedToNextFloor3d = (vision: Vision) => () => {
  const interval = vision.speed * Conf.frameInterval * 2
  const renderFns = GoMoveMagValues.slice(6).map((val) => () => {
    moveCamera(val)
    renderCurrentTerrain(corridorToNextFloor)
  })
  reserveIntervalRender(interval, renderFns)
}
