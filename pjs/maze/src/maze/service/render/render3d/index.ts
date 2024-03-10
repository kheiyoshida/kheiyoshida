import { drawAtPosition3D } from 'p5utils/src/render'
import { Conf } from '../../../config'
import { RenderGrid } from '../../../domain/compose/renderSpec'
import { registerIntervalRenderSequence } from '../base'
import { RenderQueue } from '../queue'
import { Vision } from '../vision'
import { getPalette } from '../vision/color/palette'
import { GoMoveMagValues, TurnMoveLRDeltaValues, cameraReset, moveCamera } from './camera'
import { convertRenderGridIntoCoordinates } from './position'

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
  const coordinates = convertRenderGridIntoCoordinates(renderGrid)
  p.background(getPalette().fill)
  coordinates.forEach((position3d) => {
    drawAtPosition3D(position3d, () => {
      p.fill(100)
      p.box(1000)
    })
  })
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