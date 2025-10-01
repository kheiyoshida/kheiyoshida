import { TextPresentation } from './text'
import { ImageResolution } from '../../../media/pixels/types'

export class DebugPresentation extends TextPresentation {
  constructor(frameBufferResolution: ImageResolution, maxLetters: number) {
    super(frameBufferResolution, maxLetters)
    this.color = [1, 0, 0]
  }

  public cameraAvailable = true
  public chNumber = 0
  public soundLevel = 0

  private getSoundLevel(level: number): string {
    const len = Math.floor(level * 10)
    return '|'.repeat(len) + ' '.repeat(10 - len)
  }

  updateDebugText() {
    if (!this.enabled) return
    this.setText(
      `CH${this.chNumber + 1} CAM${
        this.cameraAvailable ? 'OK' : 'NG'
      } SND${this.soundLevel.toFixed(2)} ${this.getSoundLevel(this.soundLevel)}`
    )
  }
}
