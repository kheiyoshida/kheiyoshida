import { FloorStage } from '../stage'
import { MazeLevel } from './level.ts'
import { MazeGridParams } from '../../core/level/builder'

import { determineModelingStyle } from '../world'

/**
 * manages maze grids over levels
 */
export class Maze {
  private _levelNumber = 0
  private _level!: MazeLevel

  constructor(
    private stages: FloorStage[],
    private buildParams: (floor: number) => MazeGridParams
  ) {}

  setNextLevel() {
    this._levelNumber++
    this._level = MazeLevel.build(
      this.buildParams(this._levelNumber),
      determineModelingStyle(this.stages[this._levelNumber - 1].style)
    )
  }

  get stageContext() {
    return {
      prev: this.stages[this._levelNumber - 2] || null,
      current: this.stages[this._levelNumber - 1], // B1F = index:0
      next: this.stages[this._levelNumber] || null,
    }
  }

  restart(floorStages?: FloorStage[]) {
    if (floorStages) {
      this.stages = floorStages
    }
    this._levelNumber = 0
  }

  get currentFloor() {
    return this._levelNumber
  }

  get currentLevel() {
    if (!this._level) throw Error(`Level not initialized. did you call setNextLevel()?`)
    return this._level
  }
}
