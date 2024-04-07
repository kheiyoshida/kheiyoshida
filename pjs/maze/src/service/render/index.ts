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

export const renderCurrentView: RenderHandler = ({ renderGrid, visibility, scaffold }) => {
  const drawFrame = () => {
    cameraReset(visibility)
    drawTerrain(renderGrid, scaffold)
  }
  RenderQueue.push(drawFrame)
}

export const renderGo: RenderHandler = ({ renderGrid, speed, scaffold }) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta) => () => {
    moveCamera(zDelta)(scaffold.lengths)
    drawTerrain(renderGrid, scaffold)
  })
  RenderQueue.update(drawFrameSequence)
}

export const renderTurn =
  (d: 'r' | 'l'): RenderHandler =>
  ({ renderGrid, speed, scaffold }) => {
    const LRDeltaValues = getTurnLRDeltaArray(speed)
    const drawFrameSequence = LRDeltaValues.map((turnDelta) => () => {
      moveCamera(0, d === 'r' ? turnDelta : -turnDelta)(scaffold.lengths)
      drawTerrain(renderGrid, scaffold)
    })
    RenderQueue.update(drawFrameSequence)
  }

export const renderGoDownstairs: RenderHandler = ({ renderGrid, scaffold }) => {
  const drawFrameSequence = DownstairsValues.map((values) => () => {
    moveCamera(...values)(scaffold.lengths)
    drawTerrain(renderGrid, scaffold)
  })
  RenderQueue.push(...drawFrameSequence)
}

export const renderProceedToNextFloor: RenderHandler = ({ speed, scaffold }) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta) => () => {
    moveCamera(zDelta)(scaffold.lengths)
    drawTerrain(corridorToNextFloor, scaffold)
  })
  RenderQueue.push(...drawFrameSequence)
}
