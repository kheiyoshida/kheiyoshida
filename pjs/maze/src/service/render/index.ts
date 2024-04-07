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

export const renderCurrentView: RenderHandler = ({ renderGrid, visibility, scaffoldLengths }) => {
  const drawFrame = () => {
    cameraReset(visibility)
    drawTerrain(renderGrid, scaffoldLengths)
  }
  RenderQueue.push(drawFrame)
}

export const renderGo: RenderHandler = ({ renderGrid, speed, scaffoldLengths }) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta) => () => {
    moveCamera(zDelta)(scaffoldLengths)
    drawTerrain(renderGrid, scaffoldLengths)
  })
  RenderQueue.update(drawFrameSequence)
}

export const renderTurn =
  (d: 'r' | 'l'): RenderHandler =>
  ({ renderGrid, speed, scaffoldLengths }) => {
    const LRDeltaValues = getTurnLRDeltaArray(speed)
    const drawFrameSequence = LRDeltaValues.map((turnDelta) => () => {
      moveCamera(0, d === 'r' ? turnDelta : -turnDelta)(scaffoldLengths)
      drawTerrain(renderGrid, scaffoldLengths)
    })
    RenderQueue.update(drawFrameSequence)
  }

export const renderGoDownstairs: RenderHandler = ({ renderGrid, scaffoldLengths }) => {
  const drawFrameSequence = DownstairsValues.map((values) => () => {
    moveCamera(...values)(scaffoldLengths)
    drawTerrain(renderGrid, scaffoldLengths)
  })
  RenderQueue.push(...drawFrameSequence)
}

export const renderProceedToNextFloor: RenderHandler = ({ speed, scaffoldLengths }) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta) => () => {
    moveCamera(zDelta)(scaffoldLengths)
    drawTerrain(corridorToNextFloor, scaffoldLengths)
  })
  RenderQueue.push(...drawFrameSequence)
}
