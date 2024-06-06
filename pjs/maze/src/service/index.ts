import { constantEvent, initializeEvent, recurringConstantStatusEvent } from '../domain/events'
import { statusStore } from '../store'
import { trackTime } from '../utils/time'
import { consumeMessageQueue } from './consumer'
import { bindControl } from './control'
import { renderDebugText } from './interface/debug'
import { RenderQueue } from './render/queue'
import { oldMusic } from './sound/songs/demo'
// import { setupMusic } from './music'
import { FrameConsumer } from './time/frame'

export const initializeServices = () => {
  bindControl()
  oldMusic()
  // setupMusic()
}

export const setupRenderingCycle = () => {
  initializeEvent()

  FrameConsumer.registerFrameEvent('every-frame', {
    frameInterval: 1,
    handler: () => {
      renderDebugText({ ...statusStore.current, time: trackTime() })
      constantEvent()
      consumeMessageQueue()
      RenderQueue.consume()
    },
  })
  FrameConsumer.registerFrameEvent('status', {
    frameInterval: 6,
    handler: recurringConstantStatusEvent,
  })
}

export const consumeFrame = () => {
  FrameConsumer.consumeFrame(p.frameCount)
}
