import { DrawRTHandle, FrameBuffer, ImageResolution, InputColorRenderingNode } from 'graph-gl'
import { startRenderingLoop } from '../../lib/pipeline'
import { ChannelNode } from '../../lib-node/channel/node'
import { PixelDataRTHandle } from '../../lib-node/channel/target'
import { CameraChannel } from '../../lib-node/channel/camera/camera'
import { CameraInputSource } from '../../media/camera'
import { GreyScaleGradientNode } from './optical-flow/nodes/greyscale/node'
import { FeatureDetectionNode } from './optical-flow/nodes/feature-detection/node'
import { FeatureTrackingNode } from './optical-flow/nodes/feature-tracking/node'

let resolution: ImageResolution
let dataResolution: ImageResolution

if (window.innerWidth < window.innerHeight) {
  resolution = { width: 576, height: 960 }
  dataResolution = { width: 192, height: 320 }
} else {
  resolution = { width: 960, height: 576 }
  dataResolution = { width: 320, height: 192 }
}

export async function app() {
  // set up camera
  const cameraSource = await CameraInputSource.create(undefined, 'BackCamera')
  const cameraCh = new CameraChannel(cameraSource)

  const chNode = new ChannelNode(cameraCh)
  chNode.renderTarget = new DrawRTHandle(new FrameBuffer(resolution.width, resolution.height))

  const greyNode = new GreyScaleGradientNode()
  greyNode.renderTarget = new PixelDataRTHandle(new FrameBuffer(dataResolution.width, dataResolution.height))
  greyNode.setInput(chNode)

  const featureDetectionNode = new FeatureDetectionNode()
  const tileSize = 8
  featureDetectionNode.tileSize = tileSize
  featureDetectionNode.renderTarget = new PixelDataRTHandle(new FrameBuffer(dataResolution.width / tileSize, dataResolution.height / tileSize))
  featureDetectionNode.setInput(greyNode)

  const featureTrackingNode = new FeatureTrackingNode()
  featureTrackingNode.renderTarget = new PixelDataRTHandle(new FrameBuffer(resolution.width, resolution.height))
  featureTrackingNode.setFeatureDetectionInput(featureDetectionNode)
  featureTrackingNode.setGreyScaleInput(greyNode)

  const screen = new InputColorRenderingNode()
  screen.setInput(featureTrackingNode)

  function renderLoop() {
    chNode.render()
    greyNode.render()
    featureDetectionNode.render()
    featureTrackingNode.render()
    screen.render()
  }

  startRenderingLoop(renderLoop)
}
