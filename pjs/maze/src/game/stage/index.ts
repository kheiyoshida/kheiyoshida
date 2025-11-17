import { World } from '../world'
import { buildStages } from './stage.ts'

export type Stage = {
  number: number

  startLevel: number
  endLevel: number

  world: World
}

export class StageContext {
  public readonly stages: Stage[]

  private readonly cache: Record<number, World>

  constructor() {
    this.stages = buildStages()

    this.cache = {}

    for (const stage of this.stages) {
      for (let level = stage.startLevel; level <= stage.endLevel; level++) {
        this.cache[level] = stage.world
      }
    }

    console.log(this.cache)
  }

  public getWorld(level: number): World | null {
    return this.cache[level] ?? null
  }
}
