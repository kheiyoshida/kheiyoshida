import { MazeLevel } from './level.ts'
import { BuildMazeGridParams } from '../../core/level/builder'
import { StageContext } from '../stage'
import { StructureContext } from '../world'

/**
 * manages maze grids over levels
 */
export class Maze {
  private _levelNumber = 0
  private _level!: MazeLevel

  constructor(
    private stages: StageContext,
    private buildParams: (level: number, structureContext: StructureContext) => BuildMazeGridParams
  ) {}

  // debugging params
  public debugParams?: BuildMazeGridParams

  setNextLevel() {
    this._levelNumber++
    const params = this.buildParams(this._levelNumber, this.structureContext)
    this._level = MazeLevel.build(params, this.structureContext)
    this.debugParams = params
  }

  get structureContext(): StructureContext {
    return {
      prev: this.stages.getWorld(this._levelNumber - 1)?.structure,
      current: this.stages.getWorld(this._levelNumber)!.structure,
      next: this.stages.getWorld(this._levelNumber + 1)?.structure,
    }
  }

  get currentWorld() {
    return this.stages.getWorld(this._levelNumber)
  }

  restart(floorStages?: StageContext) {
    if (floorStages) {
      this.stages = floorStages
    }
    this._levelNumber = 0
  }

  get currentLevelNumber() {
    return this._levelNumber
  }

  get currentLevel() {
    if (!this._level) throw Error(`Level not initialized. did you call setNextLevel()?`)
    return this._level
  }
}
