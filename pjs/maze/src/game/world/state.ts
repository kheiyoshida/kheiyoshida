import { clamp, randomFloatBetween, randomFloatInAsymmetricRange } from 'utils'
import { Ambience, Structure } from './types.ts'

export type IWorldState = {
  order: number
  gravity: number
  density: number
  scale: number
}

const debug = false
const debugState: IWorldState[] = [
  { density: 0.3, gravity: 1.0, order: 1.0, scale: 0.9 },
  { density: 0.4, gravity: 1.0, order: 1.0, scale: 0.9 },
  { density: 0.5, gravity: 1.0, order: 1.0, scale: 0.9 },
]

export class WorldState implements IWorldState {
  private orderState: WorldStateValue
  private gravityState: WorldStateValue
  private densityState: WorldStateValue
  private scaleState: WorldStateValue

  constructor(initialDensity = 1.0, initialGravity = 0.5) {
    this.orderState = new DirectedValue(1.0, false)
    this.gravityState = new RandomValue(initialGravity)
    this.densityState = new DirectedValue(initialDensity, false)
    this.scaleState = new RandomValue(1.0)
  }

  public get order(): number {
    return this.orderState.value
  }
  public get gravity(): number {
    return this.gravityState.value
  }
  public get density(): number {
    return this.densityState.value
  }
  public get scale(): number {
    return this.scaleState.value
  }

  public update(delta: number = 0.1, avoid?: Structure, retry = 0): void {
    if (debug) return this.updateDebug()
    if (retry > 100) return
    this.orderState.update(delta)
    this.gravityState.update(delta)
    this.densityState.update(delta)
    this.scaleState.update(delta)
    if (this.structure === avoid) this.update(delta + 0.1, avoid, retry + 1)
  }

  private updateDebug() {
    const state = debugState.shift()
    this.densityState.value = state?.density ?? this.density
    this.gravityState.value = state?.gravity ?? this.gravity
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

  public getSnapShot(): IWorldState {
    return { order: this.order, density: this.density, gravity: this.gravity, scale: this.scale }
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
  public constructor(
    initialValue: number,
    private directionSign: boolean
  ) {
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
