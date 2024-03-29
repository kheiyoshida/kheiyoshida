import {
  MakeRender,
  renderCurrentView,
  renderGo,
  renderGoDownstairs,
  renderProceedToNextFloor,
  renderTurn,
} from '.'
import { STAND_INTERVAL_MS } from '../../config/constants'
import { recurringConstantEvent, recurringStandEvent } from '../../domain/events/events'
import { MessageQueue, RenderSignal } from '../../domain/events/messages'
import { setIntervalEvent } from '../timer'
import { renderMap } from './others/map'
import { consumeVisionIntention } from './vision'

export const ConsumeMessageMap: Record<RenderSignal, MakeRender> = {
  [RenderSignal.CurrentView]: renderCurrentView,
  [RenderSignal.Go]: renderGo,
  [RenderSignal.TurnRight]: renderTurn('r'),
  [RenderSignal.TurnLeft]: renderTurn('l'),
  [RenderSignal.GoDownStairs]: renderGoDownstairs,
  [RenderSignal.ProceedToNextFloor]: renderProceedToNextFloor,
  [RenderSignal.OpenMap]: renderMap,
}

export const consumeMessageQueue = () => {
  MessageQueue.consume(([signal, slice]) => {
    const vision = consumeVisionIntention(slice)
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
