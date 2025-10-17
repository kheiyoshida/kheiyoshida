import { OffscreenDrawNode } from './graph/node/offscreen'
import { FrameBuffer } from './gl/frameBuffer'
import { TriangleModel } from './model/triangle/model'
import { InputColorRenderingNode } from './graph/node/onscreen'

async function main() {
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

// eslint-disable-next-line no-console
void main().catch(console.error)
