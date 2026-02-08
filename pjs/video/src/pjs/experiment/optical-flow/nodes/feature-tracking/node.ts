import { Drawable, OffscreenDrawNode } from 'graph-gl'
import { MotionInstance } from './motion/instance'
import { GreyScaleGradientNode } from '../greyscale/node'
import { FeatureDetectionNode } from '../feature-detection/node'
import { FeatureTracker } from './tracker'

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
  private motion: MotionInstance

  constructor() {
    super()
    this.motion = new MotionInstance(500)
  }

  render() {
    const greyScaleData = this.greyScaleInput!.renderTarget!.pixelDataArray
    const featureData = this.featureDataInput!.renderTarget!.pixelDataArray

    const trackedFeatures = this.featureTracker.track(greyScaleData, featureData)

    const w = this.greyScaleInput?.renderTarget?.scope.finalResolution.width
    const h = this.greyScaleInput?.renderTarget?.scope.finalResolution.height
    if (w === undefined || h === undefined) return

    let k = 0
    for (let i = 0; i < trackedFeatures.length; i++) {
      const f = trackedFeatures[i]

      if (f.x0 - f.x1 === 0 && f.y0 - f.y1 === 0) {
        continue
      }

      const base = k * 4
      this.motion.instanceDataArray[base] = f.x0 / w
      this.motion.instanceDataArray[base + 1] = f.y0 / h
      this.motion.instanceDataArray[base + 2] = f.x1 / w
      this.motion.instanceDataArray[base + 3] = f.y1 / h

      k++
    }

    this.motion.updateInstances(k)

    super.render()
  }

  override get drawables(): Drawable[] {
    return [this.motion]
  }
}
