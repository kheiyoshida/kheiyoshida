
import { RenderGrid } from '../../domain/compose/renderSpec'
import { registerIntervalRenderSequence, reserveIntervalRender } from './base'
import { corridorToNextFloor } from './others/scenes'
import { RenderQueue } from './queue'
import { RenderPack } from './pack'
import { getPalette } from './color/palette'
import {
  DownstairsValues,
  GoMoveMagValues,
  TurnMoveLRDeltaValues,
  cameraReset,
  moveCamera,
} from './camera'
import { convertToModelGrid } from './model'
import { finalize } from './model/finalize'
import { convertModelGrid } from './model/modelToGeo'
import { createScaffold } from './scaffold'
import { FrameInterval } from '../../config/frame'

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
  // p.fill(50)
  // p.stroke(255)
  
  geos.forEach((geo) => p.model(geo))
}

export const renderGo3d =
  ({ renderGrid, speed }: RenderPack) =>
  () => {
    const interval = speed * FrameInterval
    const renderFns = GoMoveMagValues.map((val) => () => {
      moveCamera(val)
      renderCurrentTerrain(renderGrid)
    })
    registerIntervalRenderSequence(interval, renderFns)
  }

export const renderTurn3d =
  (d: 'r' | 'l') =>
  ({ renderGrid, speed }: RenderPack) =>
  () => {
    const interval = speed * FrameInterval
    const renderFns = TurnMoveLRDeltaValues.map((val) => () => {
      moveCamera(0, d === 'r' ? val : -val)
      renderCurrentTerrain(renderGrid)
    })
    registerIntervalRenderSequence(interval, renderFns)
  }

export const renderGoDownstairs3d =
  ({ renderGrid, speed }: RenderPack) =>
  () => {
    const interval = speed * FrameInterval 
    const renderFns = DownstairsValues.map((values) => () => {
      moveCamera(...values)
      renderCurrentTerrain(renderGrid)
    })
    reserveIntervalRender(interval, renderFns)
  }

export const renderProceedToNextFloor3d = (vision: RenderPack) => () => {
  const interval = vision.speed * FrameInterval 
  const renderFns = GoMoveMagValues.map((val) => () => {
    moveCamera(val)
    renderCurrentTerrain(corridorToNextFloor)
  })
  reserveIntervalRender(interval, renderFns)
}
