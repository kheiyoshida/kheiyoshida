import { MessageQueue, RenderSignal } from '../domain/events/messages'
import { closeMap, renderMap } from './interface/map'
import {
  renderCurrentView,
  renderGo,
  renderGoDownstairs,
  renderProceedToNextFloor,
  renderTurn,
} from './render'
import { RenderPack, packDomainIntention } from './render/pack'

export type MakeRender = (domain: RenderPack) => () => void

export const MessageResolutionMap: Record<RenderSignal, MakeRender> = {
  [RenderSignal.CurrentView]: renderCurrentView,
  [RenderSignal.Go]: renderGo,
  [RenderSignal.TurnRight]: renderTurn('r'),
  [RenderSignal.TurnLeft]: renderTurn('l'),
  [RenderSignal.GoDownStairs]: renderGoDownstairs,
  [RenderSignal.ProceedToNextFloor]: renderProceedToNextFloor,
  [RenderSignal.OpenMap]: renderMap,
  [RenderSignal.CloseMap]: () => closeMap,
}

export const consumeMessageQueue = () => {
  MessageQueue.resolve(([signal, intention]) => {
    const pack = packDomainIntention(intention)
    const render = MessageResolutionMap[signal](pack)
    render()
  })
}
