import { FrameBuffer, InputColorRenderingNode, OffscreenDrawNode } from 'graph-gl'
import { TriangleModel } from 'graph-gl/src/model/triangle/model'

export async function app() {
  const offscreen = new OffscreenDrawNode()
  offscreen.renderTarget = {
    frameBuffer: new FrameBuffer(1920, 1080),
  }
  offscreen.models.push(new TriangleModel())

  const screen = new InputColorRenderingNode()
  screen.setInput(offscreen)
  screen.screenRect.setReverseVertical(true)

  offscreen.render()
  screen.render()
}
