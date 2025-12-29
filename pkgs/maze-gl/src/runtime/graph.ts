import { Scene } from '../models'
import { UnitsRenderingNode } from './scene'
import { DrawTarget, FrameBuffer, getGL, ImageResolution, InputColorRenderingNode } from 'graph-gl'
import { EdgeRenderingNode } from '../models/core/effect/edge/node'
import { FogEffectNode } from '../models/core/effect/fog/node'
import { BlurNode } from '../models/core/effect/blur/node'
import { DistortionNode } from '../models/core/effect/distortion/node'
import { FadeNode } from '../models/core/effect/fade/node'
import { ScreenEffectNode } from '../models/core/effect/node'

type RenderGraph = (scene: Scene) => void

export const connectGraph = (nodes: ScreenEffectNode[]): RenderGraph => {
  const gl = getGL()
  const resolution: ImageResolution = { width: gl.canvas.width, height: gl.canvas.height }

  const sceneFrameBuffer = new FrameBuffer(resolution.width, resolution.height, { normal: true, depth: true })
  const frameBufferA = new FrameBuffer(resolution.width, resolution.height)
  const frameBufferB = new FrameBuffer(resolution.width, resolution.height)

  const sceneTarget: DrawTarget = { frameBuffer: sceneFrameBuffer }
  const renderTargetA: DrawTarget = { frameBuffer: frameBufferA }
  const renderTargetB: DrawTarget = { frameBuffer: frameBufferB }

  const sceneNode = new UnitsRenderingNode()
  sceneNode.renderTarget = sceneTarget

  const screenNode = new InputColorRenderingNode()

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (i % 2 === 0) {
      node.renderTarget = renderTargetA
    } else {
      node.renderTarget = renderTargetB
    }

    if (i === 0) {
      node.setInput(sceneNode, sceneFrameBuffer)
    } else {
      node.setInput(nodes[i - 1], sceneFrameBuffer)
    }
  }

  screenNode.setInput(nodes[nodes.length - 1])

  return function renderScene(scene: Scene) {
    sceneNode.updateScene(scene)
    sceneNode.render()

    for (const node of nodes) node.renderEffect(scene.effect)

    screenNode.render()
  }
}

const setupGraph = () => {
  const edgeRenderingNode = new EdgeRenderingNode()
  const fogEffectNode = new FogEffectNode()
  const blurHoriNode = new BlurNode('horizontal')
  const blurVertNode = new BlurNode('vertical')
  const distortionNode = new DistortionNode()
  const fadeNode = new FadeNode()

  return connectGraph([
    edgeRenderingNode,
    fogEffectNode,
    distortionNode,
    blurHoriNode,
    blurVertNode,
    fadeNode,
  ])
}

let graph: ReturnType<typeof setupGraph>

export const renderScene = (scene: Scene) => {
  if (!graph) graph = setupGraph()
  graph(scene)
}
