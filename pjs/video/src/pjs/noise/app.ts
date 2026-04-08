import { adjustMobileCanvas, DrawRTHandle, FrameBuffer, ImageResolution, InputColorRenderingNode } from 'graph-gl'
import { ChannelNode } from '../../lib-node/channel/node'
import { startRenderingLoop } from '../../lib/pipeline'
import { VideoChannel } from '../../lib-node/channel/channel'
import { noiseSourceVideoList } from './source'
import { ScreenEffectNode } from '../../lib-node/effect/node'
import { NoiseEffect } from './noise/fx'
import { cityVideoList } from '../phantasy-break/channel'
import { videoSourceList } from '../shinjuku/videos'

export async function app() {
  const isMobile = window.innerWidth < window.innerHeight

  let resolution: ImageResolution

  if (isMobile) {
    adjustMobileCanvas()
    resolution = { width: window.innerWidth, height: window.innerHeight }
  } else {
    resolution = { width: 960, height: 576 }
  }

  const channel = new VideoChannel(videoSourceList)
  const chNode = new ChannelNode(channel)
  chNode.renderTarget = new DrawRTHandle(new FrameBuffer(resolution.width, resolution.height, {}, { repeat: true }))

  const fx = new NoiseEffect()
  fx.setResolution(resolution)
  const effectNode = new ScreenEffectNode([fx])
  effectNode.renderTarget = new DrawRTHandle(new FrameBuffer(resolution.width, resolution.height))
  effectNode.setInput(chNode)

  const screen = new InputColorRenderingNode()
  screen.setInput(effectNode)

  function renderLoop(f: number) {
    chNode.render()
    effectNode.render()
    screen.render()
  }

  startRenderingLoop(renderLoop)
}
