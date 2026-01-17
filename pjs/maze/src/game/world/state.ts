import { clamp, randomFloatBetween, randomFloatInAsymmetricRange } from 'utils'
import { Ambience, Structure } from './types.ts'
import { direction } from '../../core/grid/position2d.ts'

export type IWorldState = {
  density: number
  gravity: number
}

const debug = false
const debugState: IWorldState[] = [
  { density: 0.3, gravity: 1.0 },
  { density: 0.4, gravity: 1.0 },
  { density: 0.5, gravity: 1.0 },
]

export class WorldState implements IWorldState {
  constructor(initialDensity = 1.0, initialGravity = 1.0) {
    this.density = initialDensity
    this.gravity = initialGravity
  }

  public density: number
  public gravity: number

  public update(delta: number = 0.1, avoid?: Structure, retry = 0): void {
    if (debug) return this.updateDebug()
    if (retry > 10) return
    this.density = clamp(this.density + randomFloatInAsymmetricRange(delta), 0, 1)
    this.gravity = clamp(this.gravity + randomFloatInAsymmetricRange(delta), 0, 1)
    if (this.structure === avoid) this.update(delta + 0.1, avoid, retry + 1)
  }

  private updateDebug() {
    const state = debugState.shift()
    this.density = state?.density ?? this.density
    this.gravity = state?.gravity ?? this.gravity
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

abstract class WorldStateValue {
  protected constructor(initialValue: number) {
    this.value = initialValue
  }
  public value: number
  public abstract update(maxDelta: number): number
}

export class DirectedValue extends WorldStateValue {
  public constructor(initialValue: number, private directionSign: boolean) {
    super(initialValue)
  }
  public update(maxDelta: number): number {
    const delta = randomFloatBetween(0, maxDelta) * (this.directionSign ? 1 : -1)
    this.value += delta

    if (this.value < 0) {
      this.value = 0
      this.directionSign = true
    }
    if (this.value > 1) {
      this.value = 1
      this.directionSign = false
    }

    return this.value
  }
}

export class RandomValue extends WorldStateValue {
  public constructor(initialValue: number) {
    super(initialValue)
  }
  public update(maxDelta: number): number {
    this.value = clamp(this.value + randomFloatInAsymmetricRange(maxDelta), 0, 1)
    if (this.value === 0) this.value = 0.1
    if (this.value === 1) this.value = 0.9
    return this.value
  }
}
