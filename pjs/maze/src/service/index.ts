import { constantEvent, initializeEvent, recurringConstantStatusEvent } from '../integration/events.ts'
import { bindControl } from './control'
import { makeRenderer } from 'maze-gl'
import { FPS } from '../config'
import { renderDebugText } from './interface/debug.tsx'
import { trackTime } from './utils/time.ts'
import { consumeMessageQueue } from './consumer.ts'
import { RenderQueue } from './render/queue.ts'
import { setupMazeGL } from 'maze-gl/src/webgl.ts'
import { musicContext } from './music'
import { game } from '../game'

const renderer = makeRenderer(FPS)

export const initializeServices = () => {
  bindControl()
  musicContext.startPlaying()

}

export const setupRenderingCycle = () => {
  initializeEvent()

  setupMazeGL()

  renderer.start((frameCount) => {
    if (frameCount % 10 === 0) {
      recurringConstantStatusEvent()
    }
    renderDebugText({ ...game.player.status, time: trackTime() })
    constantEvent()
    consumeMessageQueue()
    RenderQueue.consume()
  })
}
