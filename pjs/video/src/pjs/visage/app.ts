import { adjustMobileCanvas, DrawRTHandle, FrameBuffer, ImageResolution, InputColorRenderingNode } from 'graph-gl'
import { startRenderingLoop } from '../../lib/pipeline'
import { ChannelNode } from '../../lib-node/channel/node'
import { PixelDataRTHandle } from '../../lib-node/channel/target'
import { CameraChannel } from '../../lib-node/channel/camera/camera'
import { CameraInputSource } from '../../media/camera'
import { GreyScaleGradientNode } from './nodes/greyscale/node'
import { FeatureDetectionNode } from './nodes/feature-detection/node'
import { FeatureScoringNode } from './nodes/scoring/node'
import { DistortionNode } from './nodes/distortion/node'

export const appState = {
  featureThreshold: 0.29,
  searchRadius: 4,
  diffThreshold: 0.3,
  backgroundColour: [0, 0, 0],
  colour: [0, 1, 0],
  enableTriangles: false,
  enableOriginal: false,
}

export async function app() {
  const isMobile = window.innerWidth < window.innerHeight

  let resolution: ImageResolution
  let dataResolution: ImageResolution
  let tilePassResolution: ImageResolution
  const tileSize: number = 8

  if (isMobile) {
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
  const cameraSource = await CameraInputSource.create(undefined, 'FrontCamera')
  const cameraCh = new CameraChannel(cameraSource)

  cameraCh.screenRect.setReverseHorizontal(true)

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

  const featureScoringNode = new FeatureScoringNode(tileSize)
  featureScoringNode.renderTarget = new DrawRTHandle(
    new FrameBuffer(tilePassResolution.width, tilePassResolution.height)
  )
  featureScoringNode.setInput(featureDetectionNode)

  const distortionNode = new DistortionNode(tileSize)
  distortionNode.renderTarget = new DrawRTHandle(new FrameBuffer(resolution.width, resolution.height))
  distortionNode.setInput(chNode)
  distortionNode.setScoreInput(featureScoringNode)
  distortionNode.setResolution()

  const screen = new InputColorRenderingNode()
  screen.setInput(distortionNode)

  function renderLoop(f: number) {
    featureDetectionNode.setThreshold(appState.featureThreshold)
    featureScoringNode.setRadiusSize(appState.searchRadius)
    featureScoringNode.setDiffThreshold(appState.diffThreshold)

    chNode.render()
    greyNode.render()
    featureDetectionNode.render()
    featureScoringNode.render()
    distortionNode.render()
    screen.render()

    // if (f > 10) throw new Error('test')
  }

  startRenderingLoop(renderLoop)
}
