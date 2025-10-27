import { FloorStage } from '../../stage'
import { buildNewLevel, MazeLevel } from './level.ts'
import { MazeLevelParams } from '../../../core/level/legacy'
import { classifyStyle } from '../../stage/style.ts'
import { StairType } from './object.ts'


export class Maze {
  #floor = 0
  #level: MazeLevel = []

  constructor(
    private stages: FloorStage[],
    private buildParams: (floor: number) => MazeLevelParams
  ) {}

  getStageContext() {
    return {
      prev: this.stages[this.#floor - 2] || null,
      current: this.stages[this.#floor - 1], // B1F = index:0
      next: this.stages[this.#floor] || null,
    }
  }

  restart(floorStages?: FloorStage[]) {
    if (floorStages) {
      this.stages = floorStages
    }
    this.#floor = 0;
  }

  get currentFloor() {
    return this.#floor;
  }

  get currentLevel() {
    return this.#level
  }

  setNextLevel() {
    this.#floor++
    this.#level = buildNewLevel(this.buildParams(this.#floor), this.#getStairType())
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
