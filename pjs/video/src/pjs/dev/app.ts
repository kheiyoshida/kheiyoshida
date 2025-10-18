import { FrameBuffer, InputColorRenderingNode } from 'graph-gl'
import { MultiChannelNode } from '../../lib-node/channel/node'
import { VideoChannel } from '../../lib-node/channel/channel'
import { VideoSupply } from '../../media/video/supply'
import { videoSourceList as shinjukuVideoSourceList } from '../shinjuku/videos'
import { startRenderingLoop } from '../../lib/pipeline'
import { youtubeVideoList } from './channels/videos'
import { ChannelManager } from '../../lib-node/channel/manager'

export async function app() {
  const channel = new VideoChannel(new VideoSupply(shinjukuVideoSourceList))
  const channel2 = new VideoChannel(new VideoSupply(youtubeVideoList))

  await Promise.all([channel.waitForReady(), channel2.waitForReady()])

  const channelManager = new ChannelManager([channel, channel2])

  const offscreen = new MultiChannelNode(channelManager)
  offscreen.renderTarget = {
    frameBuffer: new FrameBuffer(1920, 1080),
    pixelDataArray: new Uint8Array(1920 * 1080 * 4),
  }

  const screen = new InputColorRenderingNode()
  screen.setInput(offscreen)
  screen.screenRect.setReverseVertical(true)

  channelManager.channelSwitchRate = 0.2

  function renderLoop() {
    offscreen.render()
    screen.render()
  }

  startRenderingLoop(renderLoop)
}
