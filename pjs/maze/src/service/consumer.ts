import { MessageQueue, RenderSignal } from '../domain/events/messages'
import { closeMap, renderMap } from './interface/map'
import {
  renderCurrentView3d,
  renderGo,
  renderGoDownstairs,
  renderProceedToNextFloor,
  renderTurn,
} from './render'
import { RenderPack, packDomainIntention } from './render/pack'

export type MakeRender = (intention: RenderPack) => () => void

export const ConsumeMessageMap: Record<RenderSignal, MakeRender> = {
  [RenderSignal.CurrentView]: renderCurrentView3d,
  [RenderSignal.Go]: renderGo,
  [RenderSignal.TurnRight]: renderTurn('r'),
  [RenderSignal.TurnLeft]: renderTurn('l'),
  [RenderSignal.GoDownStairs]: renderGoDownstairs,
  [RenderSignal.ProceedToNextFloor]: renderProceedToNextFloor,
  [RenderSignal.OpenMap]: renderMap,
  [RenderSignal.CloseMap]: () => closeMap,
}

export const consumeMessageQueue = () => {
  MessageQueue.consume(([signal, intention]) => {
    const vision = packDomainIntention(intention)
    const render = ConsumeMessageMap[signal](vision)
    render()
  })
}
