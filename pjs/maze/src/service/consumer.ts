import { MessageQueue, RenderSignal } from '../domain/messages'
import { showFloor } from './interface/handlers'
import { closeMap, renderMap } from './interface/map'
import {
  renderCurrentView,
  renderDie,
  renderGo,
  renderGoDownstairs,
  renderProceedToNextFloor,
  renderTurn,
} from './render'
import { RenderPack, packRenderingInfo } from './render/pack'

export type RenderHandler = (pack: RenderPack) => void

export const MessageResolutionMap: Record<RenderSignal, RenderHandler> = {
  [RenderSignal.CurrentView]: renderCurrentView,
  [RenderSignal.Go]: renderGo,
  [RenderSignal.TurnRight]: renderTurn('r'),
  [RenderSignal.TurnLeft]: renderTurn('l'),
  [RenderSignal.GoDownStairs]: renderGoDownstairs,
  [RenderSignal.ProceedToNextFloor]: renderProceedToNextFloor,
  [RenderSignal.OpenMap]: renderMap,
  [RenderSignal.CloseMap]: closeMap,
  [RenderSignal.ShowFloor]: showFloor,
  [RenderSignal.Die]: renderDie
}

export const consumeMessageQueue = () => {
  MessageQueue.resolve(([signal, intention]) => {
    const pack = packRenderingInfo(intention)
    MessageResolutionMap[signal](pack)
  })
}
