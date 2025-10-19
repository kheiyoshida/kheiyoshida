import { FrameBuffer } from './gl'
import { DebugTriangleModel } from './model/triangle/model'
import { OffscreenPixelDrawNode } from './graph'

async function main() {
  const width = 160
  const height = 90

  const framebuffer = new FrameBuffer(width, height)

  const triangle = new DebugTriangleModel()

  const offscreen = new OffscreenPixelDrawNode()
  offscreen.renderTarget = {
    frameBuffer: framebuffer,
    pixelDataArray: new Uint8Array(width * height * 4),
  }
  offscreen.drawables = [triangle]

  function drawFrame(i: number) {
    // alternate colors per frame
    const color: [number, number, number, number] = i % 2 ? [1, 0, 0, 1] : [0, 1, 0, 1]
    triangle.setColor(color)

    // render using frame buffer
    offscreen.render()

    // === Read pixels ===
    const pixels = offscreen.renderTarget!.pixelDataArray

    // Sample a few values
    console.log(`frame ${i}`, pixels.slice(0, 12)) // first few pixels
  }

  drawFrame(0) // green
  drawFrame(1) // red
  drawFrame(2) // green
}

// eslint-disable-next-line no-console
void main().catch(console.error)
