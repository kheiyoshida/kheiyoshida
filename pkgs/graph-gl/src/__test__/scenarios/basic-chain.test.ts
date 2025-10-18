import { OffscreenDrawNode } from '../../graph/node/offscreen'
import { FrameBuffer } from '../../gl/frameBuffer'
import { TriangleModel } from '../../model/triangle/model'
import { InputColorRenderingNode } from '../../graph/node/onscreen'

test(`can chain nodes to propagate rendering results`, () => {
  const offscreen = new OffscreenDrawNode()
  offscreen.renderTarget = {
    frameBuffer: new FrameBuffer(960, 540),
  }
  offscreen.drawables.push(new TriangleModel())

  const screen = new InputColorRenderingNode()
  screen.setInput(offscreen)

  offscreen.render()
  screen.render()
})
