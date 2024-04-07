import { FPS } from '../config'
import { initializeEvent, recurringConstantStatusEvent, standEvent } from '../domain/events/events'
import { consumeMessageQueue } from './consumer'
import { bindControl } from './control'
import { FrameConsumer } from './time/frame'
import { RenderQueue } from './render/queue'
import { demo } from './sound/songs/demo'
import { makeIntervalTimer } from './time/timer'

export const initializeServices = () => {
  bindControl()
  demo()
}

export const setupRenderingCycle = () => {
  initializeEvent()

  FrameConsumer.registerFrameEvent('constant', {
    handler: () => {
      standEvent()
      consumeMessageQueue()
      RenderQueue.consume()
    },
  })
  FrameConsumer.registerFrameEvent('status', {
    frameInterval: 2,
    handler: recurringConstantStatusEvent,
  })

  const frameIntervalMS = 1000 / FPS
  const setInterval = makeIntervalTimer(frameIntervalMS)
  setInterval((frameCount) => {
    FrameConsumer.consumeFrame(frameCount)
  })
}
