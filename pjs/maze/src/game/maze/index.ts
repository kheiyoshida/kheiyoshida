import { MazeLevel } from './level.ts'
import { BuildMazeGridParams } from '../../core/level/builder'
import { StructureContext } from '../world/types.ts'
import { WorldProvider } from '../world'
import { WorldState } from '../world/state.ts'
import { debugAtmosphere } from '../../config/debug.ts'

/**
 * manages maze grids over levels
 */
export class Maze {
  private _levelNumber = 0
  private _level!: MazeLevel

  constructor(
    private buildParams: (level: number, structureContext: StructureContext) => BuildMazeGridParams,
    private worldProvider: WorldProvider = new WorldProvider()
  ) {}

  // debugging params
  public debugParams?: BuildMazeGridParams

  setNextLevel() {
    this._levelNumber++
    this.worldProvider.generateWorld(this._levelNumber)
    const params = this.buildParams(this._levelNumber, this.structureContext)
    this._level = MazeLevel.build(params, this.structureContext, this.worldState)
    this.debugParams = params
  }

  get structureContext(): StructureContext {
    return this.worldProvider.getStructureContext(this._levelNumber)
  }

  get currentWorld() {
    const world = this.worldProvider.getWorld(this._levelNumber)
    if (debugAtmosphere) {
      world.atmosphere = debugAtmosphere
    }
    return world
  }

  restart() {
    this.worldProvider = new WorldProvider()
    this._levelNumber = 0
  }

  get currentLevelNumber() {
    return this._levelNumber
  }

  get currentLevel() {
    if (!this._level) throw Error(`Level not initialized. did you call setNextLevel()?`)
    return this._level
  }

  get worldState(): WorldState {
    return this.worldProvider.state
  }
}
