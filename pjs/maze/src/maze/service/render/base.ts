import * as maze from '../../domain/maze/maze'
import { getSpeed } from '../../domain/stats'
import { Vision, makeVision } from '../../domain/vision'
import { screenPaint } from '../../domain/vision/draw/screen'
import { Frame } from '../../domain/vision/frame'
import { setIntervalEvent } from '../timer'
import { composeRender } from './compose'
import { RenderGrid } from './compose/renderSpec'
import * as RenderQueue from './queue'

export type RenderFunc = (grid: RenderGrid, vision: Vision, speed: number) => Promise<void> | void

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
