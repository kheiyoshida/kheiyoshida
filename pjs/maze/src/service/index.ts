import { constantEvent, initializeEvent, recurringConstantStatusEvent } from '../domain/events'
import { bindControl } from './control'
import { makeRenderer } from 'maze-gl'
import { FPS } from '../config'
import { renderDebugText } from './interface/debug.tsx'
import { statusStore } from '../store'
import { trackTime } from '../utils/time.ts'
import { consumeMessageQueue } from './consumer.ts'
import { RenderQueue } from './render/queue.ts'
import { setupMazeGL } from 'maze-gl/src/webgl.ts'
import { music } from './music'

const renderer = makeRenderer(FPS)

export const initializeServices = () => {
  bindControl()
  music.startPlaying()
}

export const setupRenderingCycle = () => {
  initializeEvent()

  setupMazeGL()

  renderer.start((frameCount) => {
    if (frameCount % 9 === 0) {
      recurringConstantStatusEvent()
    }
    renderDebugText({ ...statusStore.current, time: trackTime() })
    constantEvent()
    consumeMessageQueue()
    RenderQueue.consume()
  })
}
