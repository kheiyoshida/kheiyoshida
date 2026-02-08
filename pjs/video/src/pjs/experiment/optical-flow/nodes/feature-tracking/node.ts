import { Drawable, OffscreenDrawNode } from 'graph-gl'
import { MotionLineInstance } from './line/instance'
import { GreyScaleGradientNode } from '../greyscale/node'
import { FeatureDetectionNode } from '../feature-detection/node'
import { FeatureTracker } from './tracker/feature'
import { getResiduals } from './tracker/motion'
import { DotInstance } from '../../../../../gl/model/dot/instance'
import { DepthTileManager, estimateDepth } from './tracker/depth'

export class FeatureTrackingNode extends OffscreenDrawNode {
  private greyScaleInput?: GreyScaleGradientNode
  public setGreyScaleInput(node: GreyScaleGradientNode) {
    this.greyScaleInput = node
    this.featureTracker.setGreyscalePassDimension(
      node.renderTarget!.frameBuffer.width,
      node.renderTarget!.frameBuffer.height
    )
  }

  private featureDataInput?: FeatureDetectionNode
  public setFeatureDetectionInput(node: FeatureDetectionNode) {
    this.featureDataInput = node
    this.featureTracker.setFeatureDetectionPassDimension(
      node.renderTarget!.frameBuffer.width,
      node.renderTarget!.frameBuffer.height
    )
    this.featureTracker.setTileSize(node.tileSize)
  }

  private featureTracker: FeatureTracker = new FeatureTracker()
  private motionLine: MotionLineInstance

  private depthDot: DotInstance

  constructor() {
    super()
    this.motionLine = new MotionLineInstance(500)
    this.depthDot = new DotInstance(500, 1)
  }

  render() {
    const greyScaleData = this.greyScaleInput!.renderTarget!.pixelDataArray
    const featureData = this.featureDataInput!.renderTarget!.pixelDataArray

    const trackedFeatures = this.featureTracker.track(greyScaleData, featureData)
    const motions = getResiduals(trackedFeatures)

    const w = this.greyScaleInput?.renderTarget?.scope.finalResolution.width
    const h = this.greyScaleInput?.renderTarget?.scope.finalResolution.height
    if (w === undefined || h === undefined) return

    const depths = estimateDepth(new DepthTileManager(w, h, 8), motions)

    let k = 0
    for (let i = 0; i < motions.length; i++) {
      const m = motions[i]
      const base = k * 4
      this.motionLine.instanceDataArray[base] = m.x / w
      this.motionLine.instanceDataArray[base + 1] = m.y / h
      this.motionLine.instanceDataArray[base + 2] = (m.x + m.rx) / w
      this.motionLine.instanceDataArray[base + 3] = (m.y + m.ry) / h

      k++
    }
    this.motionLine.updateInstances(k)

    for (let i = 0; i < depths.length; i++) {
      const d = depths[i]

      this.depthDot.instanceDataArray[i * 6]     = d.x / w
      this.depthDot.instanceDataArray[i * 6 + 1] = d.y / h

      this.depthDot.instanceDataArray[i * 6 + 2] = d.z
      this.depthDot.instanceDataArray[i * 6 + 3] = 0
      this.depthDot.instanceDataArray[i * 6 + 4] = 0

      this.depthDot.instanceDataArray[i * 6 + 5] = 1 / h
    }

    this.depthDot.updateInstances(depths.length)

    super.render()
  }

  override get drawables(): Drawable[] {
    return [this.motionLine, this.depthDot]
  }
}
