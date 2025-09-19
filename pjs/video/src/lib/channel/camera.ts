import { PixelChannel } from './channel'
import { CameraInputSource } from '../../media/camera'
import { ImageResolution } from '../../media/pixels/types'

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
    super(source, videoResolution, outputResolutionWidth)
  }

  override get isAvailable(): boolean {
    return this.source.isAvailable
  }
}
