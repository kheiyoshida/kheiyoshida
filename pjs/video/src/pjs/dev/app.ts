import { getGL } from '../../gl/gl'
import { Message } from '../shinjuku/message'
import { startRenderingLoop, VideoProjectionPipeline } from '../../lib/pipeline'
import { DevVideoChannel } from './channel'
import { DevDotPresentation } from './presentation'
import { SaturationEffect } from './effect/saturation'

// config
const videoAspectRatio = 16 / 9
const frameBufferWidth = 960
const backgroundColor: [number, number, number, number] = [0, 0, 0, 1]

export const app = async () => {
  // init gl
  getGL()

  // const channel = new DebugDevVideoChannel()

  // rendering
  const channel = new DevVideoChannel(videoAspectRatio, frameBufferWidth, frameBufferWidth / 4)
  const dotAspectRatio = 16 / 9
  const dotPresentation = new DevDotPresentation(channel.outputResolution, dotAspectRatio)

  const pipeline = new VideoProjectionPipeline([channel], [dotPresentation])
  pipeline.setBackgroundColor(backgroundColor)
  pipeline.registerEffect(tex => new SaturationEffect(tex))

  function renderLoop(frameCount: number) {
    // rendering phase
    pipeline.render()
  }

  // set up
  const message = new Message()

  message.text = 'loading...'
  await channel.waitForReady((progress) => (message.text = `loading: ${progress}%`))

  message.text = 'click/tap to play'
  message.div.onclick = () => {
    message.hide()
    startRenderingLoop(renderLoop)
  }
}
