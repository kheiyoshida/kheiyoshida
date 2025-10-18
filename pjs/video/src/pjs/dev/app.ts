import { FrameBuffer, InputColorRenderingNode, OffscreenDrawNode, OnscreenRenderingNode } from 'graph-gl'
import { MultiChannelNode, SingleChannelNode } from '../../lib-node/channel/node'
import { VideoChannel } from '../../lib-node/channel/channel'
import { VideoSupply } from '../../media/video/supply'
import { videoSourceList as shinjukuVideoSourceList } from '../shinjuku/videos'
import { youtubeVideoList } from './channels/videos'
import { ChannelManager } from '../../lib-node/channel/manager'
import { DebugDotPresentation } from './presentation/debug'
import { startRenderingLoop } from '../../lib/pipeline'

export async function app() {
  const channel = new VideoChannel(new VideoSupply(shinjukuVideoSourceList))
  const channel2 = new VideoChannel(new VideoSupply(youtubeVideoList))

  await Promise.all([channel.waitForReady(), channel2.waitForReady()])

  const channelManager = new ChannelManager([channel, channel2])

  const chNode = new SingleChannelNode(channel)
  chNode.renderTarget = {
    frameBuffer: new FrameBuffer(96, 54),
    pixelDataArray: new Uint8Array(96 * 54 * 4),
  }

  const presentation = new DebugDotPresentation(chNode.outputResolution)

  // const presentationNode = new PresentationNode([presentation])
  // presentationNode.renderTarget = {
  //   frameBuffer: new FrameBuffer(960, 540),
  // }
  // presentationNode.setPixelDataInput(chNode)
  // presentationNode.backgroundColor = [0.5, 0.5, 0.5, 1]

  const offscreen = new OffscreenDrawNode()
  offscreen.renderTarget = {
    frameBuffer: new FrameBuffer(960, 540),
  }
  offscreen.drawables = [presentation.instance]

  const screen = new InputColorRenderingNode()
  screen.setInput(offscreen)

  function renderLoop() {
    chNode.render()

    const data = chNode.renderTarget!.pixelDataArray
    console.log('data snapshot', data)
    presentation.represent(data)

    offscreen.render()
    screen.render()
  }
  renderLoop()

  setTimeout(renderLoop, 500)

  // startRenderingLoop(renderLoop)
}
