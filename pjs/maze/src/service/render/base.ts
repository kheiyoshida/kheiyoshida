import { RenderGrid } from '../../domain/compose/renderSpec'
import { RenderPack } from './pack'
import { RenderFn, RenderQueue } from './queue'

export type RenderFunc = (
  grid: RenderGrid,
  vision: RenderPack,
  speed: number
) => Promise<void> | void

export const registerIntervalRenderSequence = (renderFns: RenderFn[]) => {
  RenderQueue.update(renderFns)
}

export const reserveIntervalRender = (renderFns: RenderFn[]) => {
  renderFns.forEach(RenderQueue.push)
}
