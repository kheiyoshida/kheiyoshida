import { ImageResolution, OffscreenDrawNode, ScreenRect } from 'graph-gl'
import { FeatureDetectionNode } from '../feature-detection/node'
import { OutlineDetectionNode } from '../outline-detection/node'
import { OutlineInstance } from './line/instance'
import { TriangleInstance } from './triangle/instance'

export class DrawNode extends OffscreenDrawNode {
  // colour input
  private _originalColourNode!: OffscreenDrawNode
  public setOriginalColourNode(node: OffscreenDrawNode) {
    this._originalColourNode = node
    this.outline.shader.use()
    this.outline.shader.setUniformInt('uColourTexture', 0)
    this.screenRect.tex = node.renderTarget!.frameBuffer.colorTexture.tex
  }

  // feature input
  private _featureDetectionNode!: FeatureDetectionNode
  public setFeatureDetectionNode(node: FeatureDetectionNode) {
    this._featureDetectionNode = node
    this._tilePassDimension = node.outputResolution
  }

  private _tilePassDimension!: ImageResolution

  // outline input
  private _outlineDetectionNode!: OutlineDetectionNode
  public setOutlineDetectionNode(node: OutlineDetectionNode) {
    this._outlineDetectionNode = node
  }

  // instances
  private outline: OutlineInstance = new OutlineInstance(1000)
  private triangle: TriangleInstance = new TriangleInstance(1000)

  private screenRect: ScreenRect = new ScreenRect()

  constructor() {
    super()
    // this.drawables.push(this.screenRect)
    this.drawables.push(this.outline)
    this.drawables.push(this.triangle)
  }

  private bindColourTex() {
    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(
      this.gl.TEXTURE_2D,
      this._originalColourNode.renderTarget!.frameBuffer.colorTexture.tex
    )
  }

  public setColour(c: [number, number, number]) {
    this.outline.setColour(c)
  }

  render() {
    const features = this._featureDetectionNode.renderTarget!.pixelDataArray
    const outlines = this._outlineDetectionNode.renderTarget!.pixelDataArray

    let k = 0
    const { width, height } = this._tilePassDimension
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

        this.outline.instanceDataArray[k * 6] = x1 / 255
        this.outline.instanceDataArray[k * 6 + 1] = y1 / 255
        this.outline.instanceDataArray[k * 6 + 2] = middleX / 255
        this.outline.instanceDataArray[k * 6 + 3] = middleY / 255
        this.outline.instanceDataArray[k * 6 + 4] = x2 / 255
        this.outline.instanceDataArray[k * 6 + 5] = y2 / 255

        this.triangle.instanceDataArray[k * 6] = x1 / 255
        this.triangle.instanceDataArray[k * 6 + 1] = y1 / 255
        this.triangle.instanceDataArray[k * 6 + 2] = middleX / 255
        this.triangle.instanceDataArray[k * 6 + 3] = middleY / 255
        this.triangle.instanceDataArray[k * 6 + 4] = x2 / 255
        this.triangle.instanceDataArray[k * 6 + 5] = y2 / 255

        k++
      }
    }


    this.outline.updateInstances(k)
    this.triangle.updateInstances(k)

    this.bindColourTex()

    super.render()
  }

  public enableTriangle = true
  public enableOriginal = true;

  public override get drawables() {
    const drawables = []
    if (this.enableOriginal) drawables.push(this.screenRect)
    if (this.enableTriangle) drawables.push(this.triangle)
    drawables.push(this.outline)
    return drawables
  }
}
