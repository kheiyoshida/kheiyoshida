import { MessageQueue, RenderSignal } from '../domain/messages'
import { showFloor } from './interface/handlers'
import { closeMap, renderMap } from './interface/map_new'
import { updateMusicDest } from './music'
import {
  renderCurrentView,
  renderDie,
  renderGo,
  renderGoDownstairs,
  renderProceedToNextFloor,
  renderResurrect,
  renderTurn,
} from './render'
import { RenderPack, packRenderingInfo } from './render/pack'

export type RenderHandler = (pack: RenderPack) => void

export const MessageResolutionMap: Record<RenderSignal, RenderHandler> = {
  [RenderSignal.CurrentView]: renderCurrentView,
  [RenderSignal.Go]: renderGo,
  [RenderSignal.TurnRight]: renderTurn('right'),
  [RenderSignal.TurnLeft]: renderTurn('left'),

  [RenderSignal.GoDownStairs]: renderGoDownstairs,

  [RenderSignal.ProceedToNextFloor]: renderProceedToNextFloor,
  [RenderSignal.Die]: renderDie,
  [RenderSignal.Resurrect]: renderResurrect,

  // Maybe: separate non-visual rendering signals?
  [RenderSignal.OpenMap]: renderMap,
  [RenderSignal.CloseMap]: closeMap,
  [RenderSignal.ShowFloor]: showFloor,
  [RenderSignal.UpdateMusicDest]: updateMusicDest,
}

export const consumeMessageQueue = () => {
  MessageQueue.resolve(([signal, intention]) => {
    const pack = packRenderingInfo(intention)
    MessageResolutionMap[signal](pack)
  })
}
