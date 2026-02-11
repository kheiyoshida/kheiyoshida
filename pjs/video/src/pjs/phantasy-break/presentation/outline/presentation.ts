import { PixelPresentation } from '../../../../lib-node/presentation/presentation'
import { ImageResolution } from '../../../../media/pixels/types'
import { OutlineInstance } from './line/instance'
import { FeatureDetectionNode } from './feature-detection/node'
import { OutlineDetectionNode } from './outline-detection/node'
import { PixelDataRTHandle } from '../../../../lib-node/channel/target'
import { FrameBuffer } from 'graph-gl'

export class OutlinePresentation extends PixelPresentation {
  private lineInstance: OutlineInstance

  private featureDetectionNode: FeatureDetectionNode
  private outlineDetectionNode: OutlineDetectionNode
  private tilePassResolution: ImageResolution

  constructor(videoSourceResolution: ImageResolution, tileSize = 5) {
    const tilePassResolution: ImageResolution = {
      width: videoSourceResolution.width / tileSize,
      height: videoSourceResolution.height / tileSize,
    }
    if (!Number.isInteger(tilePassResolution.width) || !Number.isInteger(tilePassResolution.height))
      throw new Error(
        `tile size ${tileSize} is not integer multiple of video resolution ${JSON.stringify(
          videoSourceResolution
        )}`
      )

    const maxInstanceCount = tilePassResolution.width * tilePassResolution.height
    const lineInstance = new OutlineInstance(maxInstanceCount)

    super(lineInstance, tilePassResolution)

    this.lineInstance = lineInstance

    this.featureDetectionNode = new FeatureDetectionNode(tileSize)
    this.featureDetectionNode.renderTarget = new PixelDataRTHandle(
      new FrameBuffer(tilePassResolution.width, tilePassResolution.height)
    )
    this.featureDetectionNode.setGradientTexelSize(1 / videoSourceResolution.width, 1 / videoSourceResolution.height)

    this.outlineDetectionNode = new OutlineDetectionNode(tileSize)
    this.outlineDetectionNode.renderTarget = new PixelDataRTHandle(
      new FrameBuffer(tilePassResolution.width, tilePassResolution.height)
    )
    this.outlineDetectionNode.setInput(this.featureDetectionNode)

    this.tilePassResolution = tilePassResolution
  }

  represent(_: Uint8Array, greyscaleTex: WebGLTexture | undefined): void {
    if (!greyscaleTex) throw new Error('greyscaleTex is undefined')

    this.featureDetectionNode.setTexture(greyscaleTex)

    this.featureDetectionNode.render()
    this.outlineDetectionNode.render()

    const features = this.featureDetectionNode.renderTarget!.pixelDataArray
    const outlines = this.outlineDetectionNode.renderTarget!.pixelDataArray

    let k = 0
    const { width, height } = this.tilePassResolution
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const index = y * width * 4 + x * 4

        if (features[index + 2] === 0 && features[index + 3] === 0) continue

        const middleX = features[index]
        const middleY = features[index + 1]

        const x1 = outlines[index]
        const y1 = outlines[index + 1]
        const x2 = outlines[index + 2]
        const y2 = outlines[index + 3]

        if (x1 === 0 && y1 === 0) continue
        if (x2 === 0 && y2 === 0) continue

        this.lineInstance.instanceDataArray[k * 6] = x1 / 255
        this.lineInstance.instanceDataArray[k * 6 + 1] = y1 / 255
        this.lineInstance.instanceDataArray[k * 6 + 2] = middleX / 255
        this.lineInstance.instanceDataArray[k * 6 + 3] = middleY / 255
        this.lineInstance.instanceDataArray[k * 6 + 4] = x2 / 255
        this.lineInstance.instanceDataArray[k * 6 + 5] = y2 / 255

        k++
      }
    }
    this.lineInstance.updateInstances(k)
  }
}
