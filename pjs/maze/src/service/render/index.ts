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
import { Distortion } from './scaffold/distortion'

export const renderCurrentView: RenderHandler = ({
  renderGrid,
  visibility,
  scaffoldValues: scaffold,
}) => {
  const drawFrame = () => {
    cameraReset(visibility)
    drawTerrain(renderGrid, scaffold)
  }
  RenderQueue.push(drawFrame)
}

export const renderGo: RenderHandler = ({ renderGrid, speed, scaffoldValues: scaffold }) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta, i) => () => {
    moveCamera(zDelta)(scaffold)
    drawTerrain(renderGrid, scaffold)
    if (i === GoMoveMagValues.length - 1) {
      Distortion.slideGo()
    }
  })
  RenderQueue.update(drawFrameSequence)
}

export const renderTurn =
  (d: 'r' | 'l'): RenderHandler =>
  ({ renderGrid, speed, scaffoldValues: scaffold }) => {
    const LRDeltaValues = getTurnLRDeltaArray(speed)
    const drawFrameSequence = LRDeltaValues.map((turnDelta) => () => {
      moveCamera(0, d === 'r' ? turnDelta : -turnDelta)(scaffold)
      drawTerrain(renderGrid, scaffold)
    })
    RenderQueue.update(drawFrameSequence)
  }

export const renderGoDownstairs: RenderHandler = ({ renderGrid, scaffoldValues: scaffold }) => {
  const drawFrameSequence = DownstairsValues.map((values) => () => {
    moveCamera(...values)(scaffold)
    drawTerrain(renderGrid, scaffold)
  })
  RenderQueue.push(...drawFrameSequence)
}

export const renderProceedToNextFloor: RenderHandler = ({ speed, scaffoldValues: scaffold }) => {
  const GoMoveMagValues = getGoDeltaArray(speed)
  const drawFrameSequence = GoMoveMagValues.map((zDelta) => () => {
    moveCamera(zDelta)(scaffold)
    drawTerrain(corridorToNextFloor, scaffold)
  })
  RenderQueue.push(...drawFrameSequence)
}
