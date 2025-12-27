import { Scene } from '../models'
import { UnitsRenderingNode } from './units'
import { DrawTarget, FrameBuffer, getGL, ImageResolution, InputColorRenderingNode } from 'graph-gl'
import { EdgeRenderingNode } from './screenEffect/edge/node'
import { FogEffectNode } from './screenEffect/fog/node'

const setupGraph = () => {
  const gl = getGL()
  const resolution: ImageResolution = { width: gl.canvas.width, height: gl.canvas.height }

  const sceneFrameBuffer = new FrameBuffer(resolution.width, resolution.height, { normal: true, depth: true })
  const frameBufferA = new FrameBuffer(resolution.width, resolution.height, { normal: true, depth: false })
  const frameBufferB = new FrameBuffer(resolution.width, resolution.height, { normal: true, depth: false })

  const sceneTarget: DrawTarget = { frameBuffer: sceneFrameBuffer }
  const renderTargetA: DrawTarget = { frameBuffer: frameBufferA }
  const renderTargetB: DrawTarget = { frameBuffer: frameBufferB }

  const sceneNode = new UnitsRenderingNode()
  sceneNode.renderTarget = sceneTarget

  const edgeRenderingNode = new EdgeRenderingNode()
  edgeRenderingNode.enabled = true
  edgeRenderingNode.renderTarget = renderTargetB

  const fogEffectNode = new FogEffectNode()
  fogEffectNode.enabled = true
  fogEffectNode.renderTarget = renderTargetA

  const screenNode = new InputColorRenderingNode()

  edgeRenderingNode.setInput(sceneNode, sceneFrameBuffer)
  fogEffectNode.setInput(edgeRenderingNode, sceneFrameBuffer)
  screenNode.setInput(fogEffectNode)

  return function renderScene(scene: Scene) {
    sceneNode.updateScene(scene)
    sceneNode.render()

    edgeRenderingNode.updateParams({
      time: performance.now(),
      edgeRenderingLevel: 1.0
    })
    edgeRenderingNode.render()

    fogEffectNode.render()

    screenNode.render()
  }
}

let graph: ReturnType<typeof setupGraph>

export const renderScene = (scene: Scene) => {
  if (!graph) graph = setupGraph()
  graph(scene)
}
