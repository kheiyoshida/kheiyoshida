import { KaleidoscopeEffectModel } from '../effect/kaleido'

abstract class KaleidoscopeShooterControl {
  protected constructor(protected kaleidoscope: KaleidoscopeEffectModel) {
    kaleidoscope.enabled = false
  }

  protected posX = 0
  protected posY = 0

  protected speed: number = 0.01

  private lastInteraction = 0
  private startInteraction() {
    this.lastInteraction = performance.now()
    this.kaleidoscope.enabled = true;
  }

  protected updatePosition(x: number, y: number): void {
    this.startInteraction()
    this.posX = x
    this.posY = y
  }

  protected increaseSpeed() {
    this.startInteraction()
    this.speed = 0.2
  }

  private decreaseSpeed() {
    this.speed = Math.max(0.01, this.speed / 1.12)
  }

  submitControlValues() {
    if (!this.kaleidoscope.enabled) return

    // disable after being idle for 5 seconds
    const now = performance.now()
    if (now - this.lastInteraction > 5_000) {
      this.kaleidoscope.enabled = false
      return;
    }

    this.kaleidoscope.setCenter(this.posX, this.posY)
    this.decreaseSpeed()
    this.kaleidoscope.textureOffset -= this.speed
  }
}

export class MouseKaleidoscopeShooterControl extends KaleidoscopeShooterControl {
  constructor(kaleidoscope: KaleidoscopeEffectModel) {
    super(kaleidoscope)

    window.onmousemove = (e) => {
      this.updatePosition(
        (e.x / window.innerWidth) * 2.0 - 1.0,
        ((window.innerHeight - e.y) / window.innerHeight) * 2.0 - 1.0
      )
    }

    window.onclick = () => {
      this.increaseSpeed()
    }
  }
}
