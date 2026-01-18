import { MazeLevel } from './level.ts'
import { BuildMazeGridParams } from '../../core/level/builder'
import { StructureContext } from '../world/types.ts'
import { WorldProvider } from '../world'
import { IWorldState } from '../world/state.ts'
import { debugAtmosphere } from '../../config/debug.ts'
import { ModelEntity } from 'maze-models'
import { paramBuild } from './params.ts'

/**
 * manages maze grids over levels
 */
export class Maze {
  private _levelNumber = 0
  private _level!: MazeLevel

  constructor(
    private worldProvider: WorldProvider = new WorldProvider()
  ) {
    this.worldState = this.worldProvider.state.getSnapShot()
  }

  // debugging params
  public debugParams?: BuildMazeGridParams

  setNextLevel() {
    this._levelNumber++

    this.worldState = this.worldProvider.state.getSnapShot()

    this.worldProvider.generateNextWorld(this._levelNumber)

    const params = paramBuild(this._levelNumber, this.structureContext, this.worldState)
    ModelEntity.variantRange.max = Math.min(3 + Math.floor(this._levelNumber / 3), 9)
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

  worldState: IWorldState
}
