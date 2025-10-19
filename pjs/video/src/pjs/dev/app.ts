import { FrameBuffer, InputColorRenderingNode, OffscreenDrawNode } from 'graph-gl'
import { MultiChannelNode } from '../../lib-node/channel/node'
import { VideoChannel } from '../../lib-node/channel/channel'
import { VideoSupply } from '../../media/video/supply'
import { videoSourceList as shinjukuVideoSourceList } from '../shinjuku/videos'
import { youtubeVideoList } from './channels/videos'
import { ChannelManager } from '../../lib-node/channel/manager'
import { startRenderingLoop } from '../../lib/pipeline'
import { PresentationNode } from '../../lib-node/presentation/node'
import { LinePresentation } from './presentation/line'

export async function app() {
  const channel = new VideoChannel(new VideoSupply(shinjukuVideoSourceList))
  const channel2 = new VideoChannel(new VideoSupply(youtubeVideoList))

  await Promise.all([channel.waitForReady(), channel2.waitForReady()])

  const channelManager = new ChannelManager([channel, channel2])

  const chNode = new MultiChannelNode(channelManager)
  chNode.renderTarget = {
    frameBuffer: new FrameBuffer(960, 540),
    pixelDataArray: new Uint8Array(960 * 540 * 4),
  }

  const presentation = new LinePresentation(chNode.outputResolution)
  presentation.setLuminanceThresholdDirect(0.1)
  presentation.setMaxDistanceDirect(16)

  const presentationNode = new PresentationNode([presentation])
  presentationNode.renderTarget = {
    frameBuffer: new FrameBuffer(960, 540),
  }
  presentationNode.setPixelDataInput(chNode)
  presentationNode.backgroundColor = [0.5, 0.5, 0.5, 1]

  const offscreen = new OffscreenDrawNode()
  offscreen.renderTarget = {
    frameBuffer: new FrameBuffer(960, 540),
  }
  offscreen.backgroundColor = [1, 0, 0, 1]
  offscreen.drawables = [presentation.instance]

  const screen = new InputColorRenderingNode()
  screen.setInput(offscreen)

  function renderLoop() {
    chNode.render()
    presentationNode.render()
    offscreen.render()
    screen.render()
  }

  startRenderingLoop(renderLoop)
}
