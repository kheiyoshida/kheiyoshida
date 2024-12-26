import { FloorStage } from './stages'
import { buildNewLevel, getCurrentLevel } from './level.ts'
import { MazeLevelParams } from './factory'
import { classifyStyle } from './stages/style.ts'
import { StairType } from './object.ts'

export class Maze {
  protected floor = 0

  constructor(private stages: FloorStage[], private buildParams: (floor: number) => MazeLevelParams) {
    this.setNextLevel()
  }

  getStageContext() {
    return {
      prev: this.stages[this.floor - 2] || null,
      current: this.stages[this.floor - 1], // B1F = index:0
      next: this.stages[this.floor] || null,
    }
  }

  get currentLevel() {
    return getCurrentLevel()
  }

  setNextLevel() {
    this.floor ++;
    buildNewLevel(this.buildParams(this.floor), this.#getStairType())
  }

  #getStairType(): StairType {
    const { current, next } = this.getStageContext()
    if (!next) throw Error(`next is null at getStairType`)
    if (classifyStyle(current.style) !== classifyStyle(next.style)) {
      return 'warp'
    }
    return 'normal'
  }
}
