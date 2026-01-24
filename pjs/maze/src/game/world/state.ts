import { clamp, randomFloatBetween, randomFloatInAsymmetricRange } from 'utils'
import { Ambience, Structure } from './types.ts'
import { debugState, enableDebugState } from '../../config/debug.ts'

export type IWorldState = {
  order: number
  gravity: number
  density: number
  scale: number
}

export class WorldState implements IWorldState {
  private orderState: WorldStateValue
  private gravityState: WorldStateValue
  private densityState: WorldStateValue
  private scaleState: WorldStateValue

  constructor(initial?: Partial<IWorldState>) {
    this.orderState = new DirectedValue(initial?.order ?? 1.0, false)
    this.gravityState = new RandomValue(initial?.gravity ?? 0.5)
    this.densityState = new DirectedValue(initial?.density ?? 1.0, false)
    this.scaleState = new RandomValue(initial?.scale ?? 1.0)
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

  public update(delta: number = 0.25, avoid?: Structure, retry = 0): void {
    if (enableDebugState) return this.updateDebug()
    if (retry > 100) return
    this.orderState.update(delta * 2)
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
    if (this.order > 0.8) return 'classic'
    if (this.order > 0.5) {
      if (this.gravity < 0.5) return 'floatingBoxes'
      else return 'stackedBoxes'
    } else {
      if (this.gravity < 0.5) return 'tiles'
      else return 'poles'
    }
  }

  public get ambience(): Ambience {
    return (10 - Math.min(9, Math.floor(this.density * 9) + 1)) as Ambience
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
