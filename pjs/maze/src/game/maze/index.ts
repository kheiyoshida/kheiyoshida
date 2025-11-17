import { MazeLevel } from './level.ts'
import { MazeGridParams } from '../../core/level/builder'
import { StageContext } from '../stage'

/**
 * manages maze grids over levels
 */
export class Maze {
  private _levelNumber = 0
  private _level!: MazeLevel

  constructor(
    private stages: StageContext,
    private buildParams: (floor: number) => MazeGridParams
  ) {}

  setNextLevel() {
    this._levelNumber++
    this._level = MazeLevel.build(
      this.buildParams(this._levelNumber),
      this.stages.getWorld(this._levelNumber)!.structure
    )
  }

  get structureContext() {
    return {
      prev: this.stages.getWorld(this._levelNumber -1)?.structure,
      current: this.stages.getWorld(this._levelNumber)!.structure,
      next: this.stages.getWorld(this._levelNumber +1)?.structure,
    }
  }

  restart(floorStages?: StageContext) {
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
