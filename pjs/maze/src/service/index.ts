import { FPS } from '../config'
import {
  initializeEvent,
  recurringConstantEvent,
  standEvent,
} from '../domain/events/events'
import { consumeMessageQueue } from './consumer'
import { bindControl } from './control'
import { FrameConsumer } from './frame'
import { RenderQueue } from './render/queue'
import { demo } from './sound/songs/demo'
import { makeIntervalTimer } from './timer'

export const initializeServices = () => {
  bindControl()
  // demo()
}

export const initialize3d = () => {
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
    handler: () => {
      recurringConstantEvent()
    },
  })

  const frameIntervalMS = 1000 / FPS
  const setInterval = makeIntervalTimer(frameIntervalMS)
  setInterval((frameCount) => {
    FrameConsumer.consumeFrame(frameCount)
  })
}
