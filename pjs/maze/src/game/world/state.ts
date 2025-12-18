import { clamp, randomFloatInAsymmetricRange } from 'utils'
import { Ambience, Structure } from './types.ts'

export type IWorldState = {
  density: number
  gravity: number
}

export class WorldState implements IWorldState {
  constructor(initialDensity = 0.3, initialGravity = 1.0) {
    this.density = initialDensity
    this.gravity = initialGravity
  }

  public density: number
  public gravity: number

  public update(delta: number = 0.1, avoid?: Structure, retry = 0): void {
    if (retry > 10) return
    this.density = clamp(this.density + randomFloatInAsymmetricRange(delta), 0, 1)
    this.gravity = clamp(this.gravity + randomFloatInAsymmetricRange(delta), 0, 1)
    if (this.structure === avoid) this.update(delta + 0.1, avoid, retry + 1)
  }

  public get structure(): Structure {
    if (this.density > 0.8) return 'classic'
    if (this.density > 0.5) {
      if (this.gravity < 0.5) return 'floatingBoxes'
      else return 'stackedBoxes'
    } else {
      if (this.gravity < 0.5) return 'tiles'
      else return 'poles'
    }
  }

  public get ambience(): Ambience {
    return (10 - Math.min(9, Math.floor(this.gravity * 9) + 1)) as Ambience
  }
}
