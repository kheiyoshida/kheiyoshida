import { FloorStage } from '../stage'
import { MazeLevel } from './level.ts'
import { MazeGridParams } from '../../core/level/builder'
import { determineModelingStyle } from './physical/modelingStyle.ts'

/**
 * manages maze grids over levels
 */
export class Maze {
  private _levelIndex = 0
  private _level: MazeLevel

  constructor(
    private stages: FloorStage[],
    private buildParams: (floor: number) => MazeGridParams
  ) {
    this._level = MazeLevel.build(
      buildParams(this._levelIndex),
      determineModelingStyle(stages[this._levelIndex].style)
    )
  }

  get stageContext() {
    return {
      prev: this.stages[this._levelIndex - 1] || null,
      current: this.stages[this._levelIndex], // B1F = index:0
      next: this.stages[this._levelIndex + 1] || null,
    }
  }

  restart(floorStages?: FloorStage[]) {
    if (floorStages) {
      this.stages = floorStages
    }
    this._levelIndex = 0
  }

  /** logical floor number where B1F = 0 */
  get currentFloor() {
    return this._levelIndex + 1
  }

  get currentLevel() {
    return this._level
  }

  setNextLevel() {
    this._levelIndex++
    this._level = MazeLevel.build(
      this.buildParams(this._levelIndex),
      determineModelingStyle(this.stages[this._levelIndex].style)
    )
  }
}
