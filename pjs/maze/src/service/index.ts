import { FPS } from '../config'
import { initializeEvent, recurringConstantStatusEvent, standEvent } from '../domain/events'
import { statusStore } from '../store'
import { trackTime } from '../utils/time'
import { consumeMessageQueue } from './consumer'
import { bindControl } from './control'
import { renderDebugText } from './interface/debug'
import { RenderQueue } from './render/queue'
import { demo } from './sound/songs/demo'
import { FrameConsumer } from './time/frame'
import { makeIntervalTimer } from './time/timer'

export const initializeServices = () => {
  bindControl()
  demo()
}

export const setupRenderingCycle = () => {
  initializeEvent()

  FrameConsumer.registerFrameEvent('constant', {
    handler: () => {
      renderDebugText({ ...statusStore.current, time: trackTime() })
      standEvent()
      consumeMessageQueue()
      RenderQueue.consume()
    },
  })
  FrameConsumer.registerFrameEvent('status', {
    frameInterval: 6,
    handler: recurringConstantStatusEvent,
  })

  const frameIntervalMS = 1000 / FPS
  const setInterval = makeIntervalTimer(frameIntervalMS)
  setInterval((frameCount) => {
    FrameConsumer.consumeFrame(frameCount)
  })
}
