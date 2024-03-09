import { RenderGrid } from '../../domain/compose/renderSpec'
import { setIntervalEvent } from '../timer'
import { RenderFn, RenderQueue } from './queue'
import { Vision } from './vision'
import { screenPaint } from './vision/draw/screen'
import { Frame } from './vision/frame'

export type RenderFunc = (grid: RenderGrid, vision: Vision, speed: number) => Promise<void> | void

export const makeRenderFn =
  (grid: RenderGrid, { finalize, draw }: Vision) =>
  (frames: Frame[]) => {
    screenPaint()
    const drawSpecs = finalize(grid, frames)
    draw(drawSpecs)
  }

export const compileRenderFnSequence = (
  framesSequence: Frame[][],
  renderFn: (frame: Frame[], frameIndex: number) => void
) => framesSequence.map((f, i) => () => renderFn(f, i))

export const registerIntervalRenderSequence = (interval: number, renderFns: RenderFn[]) => {
  RenderQueue.update(renderFns)
  RenderQueue.consume()
  setIntervalEvent('render', RenderQueue.consume, interval)
}

export const reserveIntervalRender = (interval: number, renderFns: RenderFn[]) => {
  renderFns.forEach(RenderQueue.push)
  setIntervalEvent('render', RenderQueue.consume, interval)
}
