import { KaleidoscopeEffectModel } from '../effect/kaleido'
import { PS3DualShock } from '../../../media/gamepad/ps3'
import { clamp } from 'utils'

abstract class KaleidoscopeShooterControl {
  protected constructor(protected kaleidoscope: KaleidoscopeEffectModel, private enableScore: (flag: boolean) => void) {
    kaleidoscope.enabled = false
  }

  protected posX = 0
  protected posY = 0

  public speed: number = 0.01

  private lastInteraction = 0
  private startInteraction() {
    this.lastInteraction = performance.now()
    this.kaleidoscope.enabled = true
    this.enableScore(true)
  }

  protected updatePosition(x: number, y: number): void {
    this.startInteraction()
    this.posX = clamp(x, -0.8, 0.8)
    this.posY = clamp(y, -0.8, 0.8)
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
      this.enableScore(false)
      return
    }

    this.kaleidoscope.startAngle = this.kaleidoscope.startAngle + this.speed * 100
    this.kaleidoscope.setCenter(this.posX, this.posY)
    this.decreaseSpeed()
    this.kaleidoscope.textureOffset -= this.speed
  }
}

export class MouseKaleidoscopeShooterControl extends KaleidoscopeShooterControl {
  constructor(kaleidoscope: KaleidoscopeEffectModel, enableScore: (flag: boolean) => void) {
    super(kaleidoscope, enableScore)

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

export class DualShockKaleidoscopeShooterControl extends KaleidoscopeShooterControl {
  constructor(
    kaleidoscope: KaleidoscopeEffectModel,
    private dualshock: PS3DualShock,
    enableScore: (flag: boolean) => void
  ) {
    super(kaleidoscope, enableScore)
  }

  public pollInput(): void {
    const {
      sticks: { left },
      pressed,
    } = this.dualshock.poll()
    if (left.x > 0.5 || left.x < -0.5 || left.y > 0.5 || left.y < -0.5) {
      this.updatePosition(this.posX + left.x * 0.1, this.posY - left.y * 0.1)
    }

    if (pressed.cross) {
      this.increaseSpeed()
    }
  }
}
