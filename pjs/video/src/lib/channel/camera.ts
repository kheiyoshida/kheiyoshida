import { PixelChannel } from './channel'
import { CameraInputSource } from '../../media/camera'
import { ImageResolution } from '../../media/pixels/types'
import { Shader } from '../../gl/shader'
import vert from './camera.vert?raw'
import frag from './camera.frag?raw'

export class CameraChannel extends PixelChannel<CameraInputSource> {
  constructor(
    source: CameraInputSource,
    videoAspectRatio: number,
    videoWidth: number,
    outputResolutionWidth: number
  ) {
    const videoResolution: ImageResolution = {
      width: videoWidth,
      height: videoWidth / videoAspectRatio,
    }
    super(source, videoResolution, outputResolutionWidth, new Shader(vert, frag))
    this.setReverseHorizontal(true)

    this.setContrast(1.0)
    this.setBrightness(0.0)
  }

  public reverse(bool: boolean): void {
    this.offScreenTexturePass.screenRect.setReverseHorizontal(bool)
  }

  get shader() {
    return this.offScreenTexturePass.screenRect.shader
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
