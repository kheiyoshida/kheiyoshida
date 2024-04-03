import { RenderGrid } from '../../domain/compose/renderSpec'
import { registerIntervalRenderSequence, reserveIntervalRender } from './base'
import {
  DownstairsValues,
  GoMoveMagValues,
  TurnMoveLRDeltaValues,
  cameraReset,
  moveCamera,
} from './camera'
import { getPalette } from './color/palette'
import { convertToModelGrid } from './model'
import { finalize } from './model/finalize'
import { convertModelGrid } from './model/modelToGeo'
import { corridorToNextFloor } from './others/scenes'
import { RenderPack } from './pack'
import { RenderQueue } from './queue'
import { createScaffold } from './scaffold'

export const renderCurrentView3d =
  ({ renderGrid }: RenderPack) =>
  () => {
    const render = () => {
      cameraReset()
      renderCurrentTerrain(renderGrid)
    }
    RenderQueue.push(render)
    RenderQueue.consume()
  }

const getGeos = (renderGrid: RenderGrid) => {
  const modelGrid = convertToModelGrid(renderGrid)
  const coords = convertModelGrid(modelGrid, createScaffold())
  const geos = finalize(coords)
  return geos
}

export const renderCurrentTerrain = (renderGrid: RenderGrid) => {
  const geos = getGeos(renderGrid)
  p.background(getPalette().fill)
  geos.forEach((geo) => p.model(geo))
}

export const renderGo3d =
  ({ renderGrid }: RenderPack) =>
  () => {
    const renderFns = GoMoveMagValues.map((val) => () => {
      moveCamera(val)
      renderCurrentTerrain(renderGrid)
    })
    registerIntervalRenderSequence(renderFns)
  }

export const renderTurn3d =
  (d: 'r' | 'l') =>
  ({ renderGrid }: RenderPack) =>
  () => {
    const renderFns = TurnMoveLRDeltaValues.map((val) => () => {
      moveCamera(0, d === 'r' ? val : -val)
      renderCurrentTerrain(renderGrid)
    })
    registerIntervalRenderSequence(renderFns)
  }

export const renderGoDownstairs3d =
  ({ renderGrid }: RenderPack) =>
  () => {
    const renderFns = DownstairsValues.map((values) => () => {
      moveCamera(...values)
      renderCurrentTerrain(renderGrid)
    })
    reserveIntervalRender(renderFns)
  }

export const renderProceedToNextFloor3d = () => () => {
  const renderFns = GoMoveMagValues.map((val) => () => {
    moveCamera(val)
    renderCurrentTerrain(corridorToNextFloor)
  })
  reserveIntervalRender(renderFns)
}
