import { FrameBuffer, InputColorRenderingNode, OffscreenDrawNode } from 'graph-gl'
import { MultiChannelNode, SingleChannelNode } from '../../lib-node/channel/node'
import { VideoChannel } from '../../lib-node/channel/channel'
import { VideoSupply } from '../../media/video/supply'
import { videoSourceList as shinjukuVideoSourceList } from '../shinjuku/videos'
import { devVideoList, youtubeVideoList } from './channels/videos'
import { ChannelManager } from '../../lib-node/channel/manager'
import { startRenderingLoop } from '../../lib/pipeline'
import { PresentationNode } from '../../lib-node/presentation/node'
import { DotPresentation } from './presentation/dot'
import { PixelDataRTHandle } from '../../lib-node/channel/target'
import { LinePresentation } from './presentation/line'

export async function app() {
  const channel = new VideoChannel(new VideoSupply(shinjukuVideoSourceList))
  const channel2 = new VideoChannel(new VideoSupply(youtubeVideoList))
  const channel3 = new VideoChannel(new VideoSupply(devVideoList))

  await Promise.all([channel.waitForReady(), channel2.waitForReady()])

  // const chNode = new MultiChannelNode(new ChannelManager([channel, channel2]))
  const chNode = new SingleChannelNode(channel3)
  chNode.renderTarget = new PixelDataRTHandle(new FrameBuffer(960, 540), 960/4)

  const presentation = new DotPresentation(chNode.outputResolution)
  // presentation.setLuminanceThresholdDirect(0.1)
  // presentation.setMaxDistanceDirect(16)

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
  screen.screenRect.setReverseVertical(true)
  screen.setInput(offscreen)

  function renderLoop() {
    chNode.scope.magnifyLevel = Math.floor(Math.random() * 3)
    chNode.render()
    presentationNode.render()
    offscreen.render()
    screen.render()
  }

  startRenderingLoop(renderLoop)
}
