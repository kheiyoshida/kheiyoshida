import { FrameBuffer, InputColorRenderingNode } from 'graph-gl'
import { SingleChannelNode } from '../../lib-node/channel/node'
import { VideoChannel } from '../../lib-node/channel/channel'
import { VideoSupply } from '../../media/video/supply'
import { videoSourceList as shinjukuVideoSourceList } from '../shinjuku/videos'
import { startRenderingLoop } from '../../lib/pipeline'

export async function app() {
  const supply = new VideoSupply(shinjukuVideoSourceList)
  supply.onEnded = () => supply.swapVideo()

  await supply.readyPromise
  supply.updateOptions({ speed: 0.3 })

  const channel = new VideoChannel(supply)

  const offscreen = new SingleChannelNode(channel)
  offscreen.renderTarget = {
    frameBuffer: new FrameBuffer(1920, 1080),
    pixelDataArray: new Uint8Array(1920 * 1080 * 4),
  }

  const screen = new InputColorRenderingNode()
  screen.setInput(offscreen)
  screen.screenRect.setReverseVertical(true)

  function renderLoop() {
    offscreen.render()
    screen.render()
  }

  startRenderingLoop(renderLoop)
}
