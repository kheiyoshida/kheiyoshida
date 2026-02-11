import {
  adjustMobileCanvas,
  DrawRTHandle,
  FrameBuffer,
  ImageResolution,
  InputColorRenderingNode,
} from 'graph-gl'
import { startRenderingLoop } from '../../lib/pipeline'
import { ChannelNode } from '../../lib-node/channel/node'
import { PixelDataRTHandle } from '../../lib-node/channel/target'
import { CameraChannel } from '../../lib-node/channel/camera/camera'
import { CameraInputSource } from '../../media/camera'
import { GreyScaleGradientNode } from './nodes/greyscale/node'
import { FeatureDetectionNode } from './nodes/feature-detection/node'
import { OutlineDetectionNode } from './nodes/outline-detection/node'
import { DrawNode } from './nodes/draw/node'

export const appState = {
  featureThreshold: 0.29,
  searchRadius: 4,
  diffThreshold: 0.3,
  backgroundColor: [0, 0, 0, 1],
  enableTriangles: false
}

export async function app() {
  let resolution: ImageResolution
  let dataResolution: ImageResolution
  let tilePassResolution: ImageResolution
  const tileSize: number = 8

  if (window.innerWidth < window.innerHeight) {
    adjustMobileCanvas()
    // resolution = { width: 576, height: 960 }
    resolution = { width: window.innerWidth, height: window.innerHeight }
    dataResolution = { width: 192, height: 320 }
    tilePassResolution = { width: 192 / tileSize, height: 320 / tileSize }
  } else {
    resolution = { width: 960, height: 576 }
    dataResolution = { width: 320, height: 192 }
    tilePassResolution = { width: 320 / tileSize, height: 192 / tileSize }
  }

  // set up camera
  const cameraSource = await CameraInputSource.create(undefined, 'BackCamera')
  const cameraCh = new CameraChannel(cameraSource)

  const chNode = new ChannelNode(cameraCh)
  chNode.renderTarget = new DrawRTHandle(new FrameBuffer(resolution.width, resolution.height))

  const greyNode = new GreyScaleGradientNode()
  greyNode.renderTarget = new PixelDataRTHandle(new FrameBuffer(dataResolution.width, dataResolution.height))
  greyNode.setInput(chNode)

  const featureDetectionNode = new FeatureDetectionNode(tileSize)
  featureDetectionNode.renderTarget = new PixelDataRTHandle(
    new FrameBuffer(tilePassResolution.width, tilePassResolution.height)
  )
  featureDetectionNode.setInput(greyNode)

  const outlineDetectionNode = new OutlineDetectionNode(tileSize)
  outlineDetectionNode.renderTarget = new PixelDataRTHandle(
    new FrameBuffer(tilePassResolution.width, tilePassResolution.height)
  )
  outlineDetectionNode.setInput(featureDetectionNode)

  const drawNode = new DrawNode()
  drawNode.renderTarget = new DrawRTHandle(new FrameBuffer(resolution.width, resolution.height))
  drawNode.setOriginalColourNode(chNode)
  drawNode.setFeatureDetectionNode(featureDetectionNode)
  drawNode.setOutlineDetectionNode(outlineDetectionNode)

  const screen = new InputColorRenderingNode()
  screen.setInput(drawNode)

  function renderLoop(f: number) {
    featureDetectionNode.setThreshold(appState.featureThreshold)
    outlineDetectionNode.setRadiusSize(appState.searchRadius)
    outlineDetectionNode.setDiffThreshold(appState.diffThreshold)
    drawNode.backgroundColor = appState.backgroundColor as [number, number, number, number]
    drawNode.enableTriangle = appState.enableTriangles

    chNode.render()
    greyNode.render()
    featureDetectionNode.render()
    outlineDetectionNode.render()
    drawNode.render()
    screen.render()

    // if (f > 10) throw new Error('test')
  }

  startRenderingLoop(renderLoop)
}
