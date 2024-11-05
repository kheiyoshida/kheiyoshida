import { constantEvent, initializeEvent, recurringConstantStatusEvent } from '../domain/events'
import { statusStore } from '../store'
import { trackTime } from '../utils/time'
import { consumeMessageQueue } from './consumer'
import { bindControl } from './control'
import { renderDebugText } from './interface/debug'
import { RenderQueue } from './render/queue'
import { music } from './music'
import { FrameConsumer } from './time/frame'

export const initializeServices = () => {
  bindControl()
  music.startPlaying()
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
    frameInterval: 9, // 0.5 second
    handler: recurringConstantStatusEvent,
  })
}

export const consumeFrame = () => {
  FrameConsumer.consumeFrame(p.frameCount) // TODO: replace with native frame manager
}
