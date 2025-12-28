import { Scene } from '../models'
import { UnitsRenderingNode } from './units'
import { DrawTarget, FrameBuffer, getGL, ImageResolution, InputColorRenderingNode } from 'graph-gl'
import { EdgeRenderingNode } from './screenEffect/edge/node'
import { FogEffectNode } from './screenEffect/fog/node'
import { BlurNode } from './screenEffect/blur/node'
import { DistortionNode } from './screenEffect/distortion/node'
import { FadeNode } from './screenEffect/fade/node'

const setupGraph = () => {
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

  const edgeRenderingNode = new EdgeRenderingNode()
  edgeRenderingNode.renderTarget = renderTargetB

  const fogEffectNode = new FogEffectNode()
  fogEffectNode.enabled = true
  fogEffectNode.renderTarget = renderTargetA

  const blurHoriNode = new BlurNode('horizontal')
  const blurVertNode = new BlurNode('vertical')
  blurHoriNode.renderTarget = renderTargetB
  blurVertNode.renderTarget = renderTargetA

  const distortionNode = new DistortionNode()
  distortionNode.renderTarget = renderTargetB

  const fadeNode = new FadeNode()
  fadeNode.renderTarget = renderTargetA

  const screenNode = new InputColorRenderingNode()

  edgeRenderingNode.setInput(sceneNode, sceneFrameBuffer)
  fogEffectNode.setInput(edgeRenderingNode, sceneFrameBuffer)
  blurHoriNode.setInput(fogEffectNode, sceneFrameBuffer)
  blurVertNode.setInput(blurHoriNode, sceneFrameBuffer)
  distortionNode.setInput(blurVertNode, sceneFrameBuffer)
  fadeNode.setInput(distortionNode, sceneFrameBuffer)
  screenNode.setInput(fadeNode)

  return function renderScene(scene: Scene) {
    sceneNode.updateScene(scene)
    sceneNode.render()

    edgeRenderingNode.updateParams(scene.effect.edge)
    edgeRenderingNode.render()

    fogEffectNode.render()

    blurHoriNode.updateParams(scene.effect.blur)
    blurHoriNode.render()

    blurVertNode.updateParams(scene.effect.blur)
    blurVertNode.render()

    distortionNode.updateParams(scene.effect.distortion)
    distortionNode.render()

    fadeNode.updateParams(scene.effect.fade)
    fadeNode.render()

    screenNode.render()
  }
}

let graph: ReturnType<typeof setupGraph>

export const renderScene = (scene: Scene) => {
  if (!graph) graph = setupGraph()
  graph(scene)
}
