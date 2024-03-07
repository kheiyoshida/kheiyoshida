import { getRenderGridFromCurrentState } from '../../domain/compose'
import { RenderGrid } from '../../domain/compose/renderSpec'
import { getRenderingSpeed } from '../../domain/stats'
import { setIntervalEvent } from '../timer'
import * as RenderQueue from './queue'
import { Vision, getVisionFromCurrentState } from './vision'
import { screenPaint } from './vision/draw/screen'
import { Frame } from './vision/frame'

export type RenderFunc = (grid: RenderGrid, vision: Vision, speed: number) => Promise<void> | void

export const injectDomainDeps =
  (renderFn: RenderFunc) =>
  async (
    vision = getVisionFromCurrentState(),
    renderGrid = getRenderGridFromCurrentState(),
    speed = getRenderingSpeed()
  ) => {
    vision.renewColors()
    await renderFn(renderGrid, vision, speed)
  }

export const genRenderFn =
  (grid: RenderGrid, { finalize, draw }: Vision) =>
  (frames: Frame[]) => {
    screenPaint()
    const drawSpecs = finalize(grid, frames)
    draw(drawSpecs)
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
