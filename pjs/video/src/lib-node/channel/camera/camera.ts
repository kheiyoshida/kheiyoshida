import { CameraInputSource } from '../../../media/camera'
import vert from './camera.vert?raw'
import frag from './camera.frag?raw'
import { Shader } from 'graph-gl'
import { TextureChannel } from '../channel'

export class CameraChannel extends TextureChannel<CameraInputSource> {
  constructor(source: CameraInputSource) {
    super(source, new Shader(vert, frag))

    this.setContrast(1.0)
    this.setBrightness(0.0)
  }

  public reverse(bool: boolean): void {
    this.screenRect.setReverseHorizontal(bool)
  }

  get shader() {
    return this.screenRect.shader
  }

  public setContrast(contrast: number) {
    this.shader.use()
    this.shader.setUniformFloat('uContrast', contrast)
  }

  public setBrightness(brightness: number) {
    this.shader.use()
    this.shader.setUniformFloat('uBrightness', brightness)
  }

  override get isAvailable(): boolean {
    return this.source.isAvailable
  }
}
