import { FrameBuffer, InputColorRenderingNode } from 'graph-gl'
import { videoSourceList as shinjukuVideoSourceList } from '../shinjuku/videos'
import { startRenderingLoop } from '../../lib/pipeline'
import { SingleChannelNode } from '../../lib-node/channel/node'
import { VideoChannel } from '../../lib-node/channel/channel'
import { PixelDataRTHandle } from '../../lib-node/channel/target'

export async function app() {
  const chNode = new SingleChannelNode(new VideoChannel(shinjukuVideoSourceList))
  chNode.renderTarget = new PixelDataRTHandle(new FrameBuffer(960, 540), 320)

  const screen = new InputColorRenderingNode()
  screen.setInput(chNode)

  function renderLoop() {
    chNode.render()
    screen.render()
  }

  startRenderingLoop(renderLoop)
}
