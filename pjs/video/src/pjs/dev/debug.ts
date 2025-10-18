import { getGL } from '../../gl/gl'
import {
  FrameBuffer,
  InputColorRenderingNode,
  OffscreenDrawNode,
  OffscreenPixelDrawNode,
  OnscreenRenderingNode,
} from 'graph-gl'
import { TriangleModel } from 'graph-gl/src/model/triangle/model'
import { DebugDotPresentation } from './presentation/debug'

export function app() {
  getGL()

  const offscreen = new OffscreenPixelDrawNode()

  offscreen.renderTarget = {
    frameBuffer: new FrameBuffer(160, 90),
    pixelDataArray: new Uint8Array(160 * 90 * 4),
  }
  offscreen.drawables = [new TriangleModel()]

  const presentation = new DebugDotPresentation(offscreen.outputResolution)

  // const drawNode = new OffscreenDrawNode()
  // drawNode.renderTarget = {
  //   frameBuffer: new FrameBuffer(160, 90),
  // }
  // drawNode.drawables = [presentation.instance]

  const screen = new OnscreenRenderingNode()
  screen.drawables = [presentation.instance]
  // screen.setInput(offscreen)

  function renderLoop(frameCount: number) {
    console.log('frameCount', frameCount)

    offscreen.render()
    console.log(offscreen.renderTarget!.pixelDataArray)

    presentation.represent(offscreen.renderTarget!.pixelDataArray)

    // drawNode.render()

    screen.render()
  }

  renderLoop(1)
  renderLoop(2)
}
