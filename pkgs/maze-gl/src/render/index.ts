import { Scene } from '../models'
import { UnitsRenderingNode } from './units'
import { DrawTarget, FrameBuffer, getGL, ImageResolution, InputColorRenderingNode } from 'graph-gl'
import { EdgeRenderingNode } from './screenEffect/edge/node'

const setupGraph = () => {
  const gl = getGL()
  const resolution: ImageResolution = { width: gl.canvas.width, height: gl.canvas.height }

  const frameBufferA = new FrameBuffer(resolution.width, resolution.height, { normal: true, depth: true })
  const frameBufferB = new FrameBuffer(resolution.width, resolution.height, { normal: true, depth: true })

  const renderTargetA: DrawTarget = { frameBuffer: frameBufferA }
  const renderTargetB: DrawTarget = { frameBuffer: frameBufferB }

  const unitsRenderingNode = new UnitsRenderingNode()
  unitsRenderingNode.renderTarget = renderTargetA

  const effectNode = new EdgeRenderingNode()
  effectNode.enabled = true;
  effectNode.renderTarget = renderTargetB

  const screenNode = new InputColorRenderingNode()

  effectNode.setInput(unitsRenderingNode)
  screenNode.setInput(effectNode)

  return function renderScene(scene: Scene) {
    unitsRenderingNode.updateScene(scene)
    unitsRenderingNode.render()

    effectNode.updateParams({
      time: performance.now(),
      edgeRenderingLevel: 1.0
    })
    effectNode.render()

    screenNode.render()
  }
}

let graph: ReturnType<typeof setupGraph>

export const renderScene = (scene: Scene) => {
  if (!graph) graph = setupGraph()
  graph(scene)
}
