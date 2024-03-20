import { RenderGrid } from '../../domain/compose/renderSpec'
import { setIntervalEvent } from '../timer'
import { RenderFn, RenderQueue } from './queue'
import { RenderPack } from './vision'

export type RenderFunc = (
  grid: RenderGrid,
  vision: RenderPack,
  speed: number
) => Promise<void> | void

export const registerIntervalRenderSequence = (interval: number, renderFns: RenderFn[]) => {
  RenderQueue.update(renderFns)
  RenderQueue.consume()
  setIntervalEvent('render', RenderQueue.consume, interval)
}

export const reserveIntervalRender = (interval: number, renderFns: RenderFn[]) => {
  renderFns.forEach(RenderQueue.push)
  setIntervalEvent('render', RenderQueue.consume, interval)
}
