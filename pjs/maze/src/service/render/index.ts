import { RenderHandler } from '../consumer'
import {
  DownstairsValues,
  cameraReset,
  getGoDeltaArray,
  getTurnLRDeltaArray,
  moveCamera,
} from './camera'
import { drawTerrain } from './draw'
import { corridorToNextFloor } from './others/scenes'
import { RenderQueue } from './queue'

export const renderCurrentView: RenderHandler = ({ renderGrid, visibility }) => {
  const drawFrame = () => {
    cameraReset(visibility)
    drawTerrain(renderGrid)
  }
  RenderQueue.push(drawFrame)
}

export const renderGo: RenderHandler = ({ renderGrid, speed }) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta) => () => {
    moveCamera(zDelta)
    drawTerrain(renderGrid)
  })
  RenderQueue.update(drawFrameSequence)
}

export const renderTurn =
  (d: 'r' | 'l'): RenderHandler =>
  ({ renderGrid, speed }) => {
    const LRDeltaValues = getTurnLRDeltaArray(speed)
    const drawFrameSequence = LRDeltaValues.map((turnDelta) => () => {
      moveCamera(0, d === 'r' ? turnDelta : -turnDelta)
      drawTerrain(renderGrid)
    })
    RenderQueue.update(drawFrameSequence)
  }

export const renderGoDownstairs: RenderHandler = ({ renderGrid }) => {
  const drawFrameSequence = DownstairsValues.map((values) => () => {
    moveCamera(...values)
    drawTerrain(renderGrid)
  })
  RenderQueue.push(...drawFrameSequence)
}

export const renderProceedToNextFloor: RenderHandler = ({ speed }) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta) => () => {
    moveCamera(zDelta)
    drawTerrain(corridorToNextFloor)
  })
  RenderQueue.push(...drawFrameSequence)
}
