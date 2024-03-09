import { MakeRender, renderCurrentView, renderGo, renderGoDownstairs, renderProceedToNextFloor, renderTurn } from ".";
import { STAND_INTERVAL_MS } from "../../config/constants";
import { recurringConstantEventHandler, recurringStandEventHandler } from "../../domain/events/commands";
import { MessageQueue, RenderSignal } from "../../domain/events/messages";
import { setIntervalEvent } from "../timer";
import { renderMap } from "./others/map";
import { consumeVisionIntention } from "./vision";

export const ConsumeMessageMap: Record<RenderSignal, MakeRender> = {
  [RenderSignal.CurrentView]: renderCurrentView,
  [RenderSignal.Go]: renderGo,
  [RenderSignal.TurnRight]: renderTurn('r'),
  [RenderSignal.TurnLeft]: renderTurn('l'),
  [RenderSignal.GoDownStairs]: renderGoDownstairs,
  [RenderSignal.ProceedToNextFloor]: renderProceedToNextFloor,
  [RenderSignal.OpenMap]: renderMap,
  [RenderSignal.CloseMap]: renderCurrentView
}

export const consumeMessageQueue = () => {
  while(MessageQueue.length) {
    const [signal, slice] = MessageQueue.shift()!
    const vision = consumeVisionIntention(slice)
    const render = ConsumeMessageMap[signal](vision)
    render()
  }
}

export const setupConstantConsumers = () => {
  registerConcurrentConstantEvent()
  registerRecurringRender()
}

const registerConcurrentConstantEvent = () => {
  setIntervalEvent(
    'constant',
    () => {
      recurringConstantEventHandler()
      consumeMessageQueue()
    },   
    STAND_INTERVAL_MS * 2
  )
}

const registerRecurringRender = () => {
  setIntervalEvent(
    'stand',
    () => {
      recurringStandEventHandler()
      consumeMessageQueue()
    },
    STAND_INTERVAL_MS
  )
}