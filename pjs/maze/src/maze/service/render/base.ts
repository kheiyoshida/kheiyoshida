import { getSpeed } from 'src/maze/domain/stats'
import { debugStats } from 'src/maze/domain/stats/debug'
import { Vision, makeVision } from 'src/maze/domain/vision'
import { screenPaint } from 'src/maze/domain/vision/draw/screen'
import { Frame } from 'src/maze/domain/vision/frame'
import { debugFrames } from 'src/maze/domain/vision/frame/debug'
import * as maze from '../../domain/maze/maze'
import { setIntervalEvent } from '../timer'
import { composeRender } from './compose'
import { RenderGrid } from './compose/renderSpec'
import * as RenderQueue from './queue'

export type RenderFunc = (
  grid: RenderGrid,
  vision: Vision,
  speed: number
) => Promise<void> | void

/**
 * inject domain dependencies
 */
export const inject =
  (renderFn: RenderFunc) =>
  async (
    vision = makeVision(),
    renderSpecs = composeRender(maze.getPath(), maze.query.direction),
    speed = getSpeed()
  ) => {
    vision.renewColors()
    await renderFn(renderSpecs, vision, speed)
  }

/**
 * generate render function
 */
export const genRender =
  (grid: RenderGrid, { finalize, draw }: Vision) =>
  (frames: Frame[]) => {
    screenPaint()
    draw(finalize(grid, frames))
    if (process.env.DEBUG) {
      // debugFrames(frames)
      debugStats()
    }
  }

export const intervalRender = (
  interval: number,
  ren: (frame: Frame[], i: number) => void,
  framesSequence: Frame[][]
): void => {
  RenderQueue.update(framesSequence.map((f, i) => () => ren(f, i)))
  RenderQueue.consume()
  setIntervalEvent('render', RenderQueue.consume, interval)
}

export const reserveIntervalRender = (
  interval: number,
  ren: (frame: Frame[], i: number) => void,
  framesSequence: Frame[][]
): void => {
  framesSequence.map((f, i) => () => ren(f, i)).forEach(RenderQueue.push)
  setIntervalEvent('render', RenderQueue.consume, interval)
}
