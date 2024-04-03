import { MessageQueue, RenderSignal } from '../domain/events/messages'
import { closeMap, renderMap } from './interface/map'
import {
  renderCurrentView3d,
  renderGo3d,
  renderGoDownstairs3d,
  renderProceedToNextFloor3d,
  renderTurn3d,
} from './render'
import { RenderPack, packDomainIntention } from './render/pack'

export type MakeRender = (intention: RenderPack) => () => void

export const ConsumeMessageMap: Record<RenderSignal, MakeRender> = {
  [RenderSignal.CurrentView]: renderCurrentView3d,
  [RenderSignal.Go]: renderGo3d,
  [RenderSignal.TurnRight]: renderTurn3d('r'),
  [RenderSignal.TurnLeft]: renderTurn3d('l'),
  [RenderSignal.GoDownStairs]: renderGoDownstairs3d,
  [RenderSignal.ProceedToNextFloor]: renderProceedToNextFloor3d,
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
