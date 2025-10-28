import { FloorStage } from '../stage'
import { MazeLevel } from './level.ts'
import { MazeGridParams } from '../../core/level/builder'
import { determineModelingStyle } from './physical/modelingStyle.ts'

/**
 * manages maze grids over levels
 */
export class Maze {
  private _floor = 0
  private _level!: MazeLevel

  constructor(
    private stages: FloorStage[],
    private buildParams: (floor: number) => MazeGridParams
  ) {}

  setNextLevel() {
    this._floor++
    this._level = MazeLevel.build(
      this.buildParams(this._floor),
      determineModelingStyle(this.stages[this._floor].style)
    )
  }

  get stageContext() {
    return {
      prev: this.stages[this._floor - 2] || null,
      current: this.stages[this._floor - 1], // B1F = index:0
      next: this.stages[this._floor] || null,
    }
  }

  restart(floorStages?: FloorStage[]) {
    if (floorStages) {
      this.stages = floorStages
    }
    this._floor = 0
  }

  get currentFloor() {
    return this._floor
  }

  get currentLevel() {
    return this._level
  }
}
