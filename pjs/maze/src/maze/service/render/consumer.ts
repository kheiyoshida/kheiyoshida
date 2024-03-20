import { STAND_INTERVAL_MS } from '../../config/constants'
import { recurringConstantEvent, recurringStandEvent } from '../../domain/events/events'
import { MessageQueue, RenderSignal } from '../../domain/events/messages'
import { setIntervalEvent } from '../timer'
import { renderMap } from './others/map'
import {
  renderCurrentView3d,
  renderGo3d,
  renderGoDownstairs3d,
  renderProceedToNextFloor3d,
  renderTurn3d,
} from './render3d'
import { RenderPack, packVisionIntention } from './vision'

export type MakeRender = (intention: RenderPack) => () => void

export const ConsumeMessageMap: Record<RenderSignal, MakeRender> = {
  [RenderSignal.CurrentView]: renderCurrentView3d,
  [RenderSignal.Go]: renderGo3d,
  [RenderSignal.TurnRight]: renderTurn3d('r'),
  [RenderSignal.TurnLeft]: renderTurn3d('l'),
  [RenderSignal.GoDownStairs]: renderGoDownstairs3d,
  [RenderSignal.ProceedToNextFloor]: renderProceedToNextFloor3d,
  [RenderSignal.OpenMap]: renderMap,
}

export const consumeMessageQueue = () => {
  MessageQueue.consume(([signal, intention]) => {
    const vision = packVisionIntention(intention)
    const render = ConsumeMessageMap[signal](vision)
    render()
  })
}

export const setupConstantConsumers = () => {
  registerConcurrentConstantEvent()
  registerRecurringRender()
}

const registerConcurrentConstantEvent = () => {
  setIntervalEvent(
    'constant',
    () => {
      recurringConstantEvent()
      consumeMessageQueue()
    },
    STAND_INTERVAL_MS * 2
  )
}

const registerRecurringRender = () => {
  setIntervalEvent(
    'stand',
    () => {
      recurringStandEvent()
      consumeMessageQueue()
    },
    STAND_INTERVAL_MS
  )
}
