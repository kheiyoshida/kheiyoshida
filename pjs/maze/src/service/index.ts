import { constantEvent, initializeEvent, recurringConstantStatusEvent } from '../domain/events'
import { bindControl } from './control'
import { GeometrySpec, makeRenderer } from 'maze-gl'
import { FPS } from '../config'
import { getGL } from 'maze-gl/src/webgl'
import { renderDebugText } from './interface/debug.tsx'
import { statusStore } from '../store'
import { trackTime } from '../utils/time.ts'
import { consumeMessageQueue } from './consumer.ts'
import { RenderQueue } from './render/queue.ts'

const renderer = makeRenderer(FPS)

export const initializeServices = () => {
  bindControl()
  // music.startPlaying()
}

export const setupRenderingCycle = () => {
  initializeEvent()

  const gl = getGL()

  renderer.start((frameCount) => {
    gl.clearColor(0.1, 0.1, 0.1, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    if (frameCount % 9 === 0) {
      recurringConstantStatusEvent()
    }
    renderDebugText({ ...statusStore.current, time: trackTime() })
    constantEvent()
    consumeMessageQueue()
    RenderQueue.consume()
  })
}
