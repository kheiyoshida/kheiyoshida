import {
  initializeEvent,
  recurringConstantEvent,
  recurringStandEvent,
} from '../domain/events/events'
import { consumeMessageQueue } from './consumer'
import { bindControl } from './control'
import { FrameConsumer } from './frame'
import { RenderQueue } from './render/queue'
import { demo } from './sound/songs/demo'
import { makeIntervalTimer } from './timer'

export const initializeServices = () => {
  bindControl()
  demo()
}

export const initialize3d = () => {
  initializeEvent()

  FrameConsumer.registerFrameEvent('constant', {
    handler: consumeMessageQueue,
  })
  FrameConsumer.registerFrameEvent('status', {
    handler: () => {
      recurringConstantEvent()
      recurringStandEvent()
    },
  })
  FrameConsumer.registerFrameEvent('render', {
    handler: () => RenderQueue.consume(),
  })

  const frameIntervalMS = 1000 / 12
  const setInterval = makeIntervalTimer(frameIntervalMS)
  setInterval((frameCount) => {
    FrameConsumer.consumeFrame(frameCount)
  })
}
