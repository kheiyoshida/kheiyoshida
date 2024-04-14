import { initializeEvent, recurringConstantStatusEvent, constantEvent } from '../domain/events'
import { statusStore } from '../store'
import { trackTime } from '../utils/time'
import { consumeMessageQueue } from './consumer'
import { bindControl } from './control'
import { renderDebugText } from './interface/debug'
import { RenderQueue } from './render/queue'
import { music } from './sound/songs/demo'
import { FrameConsumer } from './time/frame'
import { handleInterval } from './time/timer'

export const initializeServices = () => {
  bindControl()
  music()
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
  handleInterval((frameCount) => {
    FrameConsumer.consumeFrame(frameCount)
  })
}
