import { FrameBuffer, getGL } from './gl'
import { DebugTriangleModel } from './model/triangle/model'

async function main() {
  const gl = getGL()

  const width = 160,
    height = 90

  const framebuffer = new FrameBuffer(width, height)

  const triangle = new DebugTriangleModel()

  function drawFrame(i: number) {
    framebuffer.activate()

    // alternate colors per frame
    const color: [number, number, number, number] = i % 2 ? [1, 0, 0, 1] : [0, 1, 0, 1]
    triangle.setColor(color)
    triangle.draw(gl.TRIANGLES)

    // === Read pixels ===
    const pixels = framebuffer.readPixels()

    // Sample a few values
    console.log(`frame ${i}`, pixels.slice(0, 12)) // first few pixels

    framebuffer.deactivate()
  }

  drawFrame(0) // green
  drawFrame(1) // red
  drawFrame(2) // green
}

// eslint-disable-next-line no-console
void main().catch(console.error)
