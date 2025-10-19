import { DrawRTHandle, FrameBuffer, InputColorRenderingNode } from 'graph-gl'
import { SingleChannelNode } from '../../lib-node/channel/node'
import { VideoChannel } from '../../lib-node/channel/channel'
import { VideoSupply } from '../../media/video/supply'
import { videoSourceList as shinjukuVideoSourceList } from '../shinjuku/videos'
import { devVideoList, youtubeVideoList } from './channels/videos'
import { startRenderingLoop } from '../../lib/pipeline'
import { PresentationNode } from '../../lib-node/presentation/node'
import { DotPresentation } from './presentation/dot'
import { PixelDataRTHandle } from '../../lib-node/channel/target'
import { EffectNode } from '../../lib-node/effect/node'
import { MultiplyEffectModel } from '../phantasy-break/effect/multiply'

export async function app() {
  const channel = new VideoChannel(new VideoSupply(shinjukuVideoSourceList))
  const channel2 = new VideoChannel(new VideoSupply(youtubeVideoList))
  const channel3 = new VideoChannel(new VideoSupply(devVideoList))

  await Promise.all([channel.waitForReady(), channel2.waitForReady()])

  // const chNode = new MultiChannelNode(new ChannelManager([channel, channel2]))
  const chNode = new SingleChannelNode(channel3)
  chNode.renderTarget = new PixelDataRTHandle(new FrameBuffer(960, 540), 960/3)

  const presentation = new DotPresentation(chNode.outputResolution)
  // presentation.setLuminanceThresholdDirect(0.1)
  // presentation.setMaxDistanceDirect(16)

  const rtA = new DrawRTHandle(new FrameBuffer(960, 540))
  const rtB = new DrawRTHandle(new FrameBuffer(960, 540))

  const presentationNode = new PresentationNode([presentation])
  presentationNode.renderTarget = rtA
  presentationNode.setPixelDataInput(chNode)

  const fx = new MultiplyEffectModel(16)
  const fxNode = new EffectNode([fx])
  fxNode.setInput(presentationNode)
  fxNode.renderTarget = rtB
  fxNode.backgroundColor = [1, 0, 0, 1]
  fx.enabled = true
  fx.setMultiply(16)

  const screen = new InputColorRenderingNode()
  screen.screenRect.setReverseVertical(true)
  screen.setInput(fxNode)

  // validate
  chNode.validate()
  presentationNode.validate()
  fxNode.validate()
  screen.validate()

  function renderLoop() {
    chNode.render()
    presentationNode.render()
    fxNode.render()
    screen.render()
  }

  startRenderingLoop(renderLoop)
}
