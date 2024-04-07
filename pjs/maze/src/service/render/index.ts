import { Geometry } from 'p5'
import { RenderGrid } from '../../domain/compose/renderSpec'
import {
  DownstairsValues,
  cameraReset,
  getGoDeltaArray,
  getTurnLRDeltaArray,
  moveCamera,
} from './camera'
import { getPalette } from './color/palette'
import { convertToModelGrid } from './model'
import { finalize } from './model/finalize'
import { convertModelGrid } from './model/modelToGeo'
import { corridorToNextFloor } from './others/scenes'
import { RenderPack } from './pack'
import { RenderQueue, registerIntervalRenderSequence, reserveIntervalRender } from './queue'
import { createScaffold } from './scaffold'

export const renderCurrentTerrain = (renderGrid: RenderGrid) => {
  const geos = getGeos(renderGrid)
  drawCurrentGeometries(geos)
}

const getGeos = (renderGrid: RenderGrid) => {
  const modelGrid = convertToModelGrid(renderGrid)
  const coords = convertModelGrid(modelGrid, createScaffold())
  const geos = finalize(coords)
  return geos
}

const drawCurrentGeometries = (geos: Geometry[]) => {
  p.background(getPalette().fill)
  geos.forEach((geo) => p.model(geo))
}

export const renderCurrentView =
  ({ renderGrid, visibility }: RenderPack) =>
  () => {
    const render = () => {
      cameraReset(visibility)
      renderCurrentTerrain(renderGrid)
    }
    RenderQueue.push(render)
  }

export const renderGo =
  ({ renderGrid, speed }: RenderPack) =>
  () => {
    const GoMoveMagValues = getGoDeltaArray(speed)
    const renderFns = GoMoveMagValues.map((val) => () => {
      moveCamera(val)
      renderCurrentTerrain(renderGrid)
    })
    registerIntervalRenderSequence(renderFns)
  }

export const renderTurn =
  (d: 'r' | 'l') =>
  ({ renderGrid, speed }: RenderPack) =>
  () => {
    const LRDeltaValues = getTurnLRDeltaArray(speed)
    const renderFns = LRDeltaValues.map((val) => () => {
      moveCamera(0, d === 'r' ? val : -val)
      renderCurrentTerrain(renderGrid)
    })
    registerIntervalRenderSequence(renderFns)
  }

export const renderGoDownstairs =
  ({ renderGrid }: RenderPack) =>
  () => {
    const renderFns = DownstairsValues.map((values) => () => {
      moveCamera(...values)
      renderCurrentTerrain(renderGrid)
    })
    reserveIntervalRender(renderFns)
  }

export const renderProceedToNextFloor =
  ({ speed }: RenderPack) =>
  () => {
    const GoMoveMagValues = getGoDeltaArray(speed)
    const renderFns = GoMoveMagValues.map((val) => () => {
      moveCamera(val)
      renderCurrentTerrain(corridorToNextFloor)
    })
    reserveIntervalRender(renderFns)
  }
