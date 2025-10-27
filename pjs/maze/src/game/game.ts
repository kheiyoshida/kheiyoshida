import { fireByRate, randomItemFromArray } from 'utils'
import { getTurnedDirection } from '../core/grid/direction.ts'
import { Player } from './player'
import { Maze } from './maze'
import { Mapper } from './map/mapper.ts'

export class GameAggregate {
  constructor(
    public readonly maze: Maze,
    public readonly player: Player,
    public readonly mapper: Mapper
  ) {
    this.#setupNextLevel()
  }

  restart() {
    this.maze.restart()
    this.player.reinitialize()
    this.#setupNextLevel()
  }

  #setupNextLevel() {
    this.maze.setNextLevel()
    this.mapper.resetMap(this.maze.currentLevel.grid)

    const corridorCell = randomItemFromArray(this.maze.currentLevel.grid.getCorridors())
    this.player.position = corridorCell
    this.player.direction = getTurnedDirection(
      fireByRate(0.5) ? 'right' : 'left',
      this.maze.currentLevel.grid.getCorridorDir(corridorCell)!
    )
  }

  goDownStairs() {
    this.#setupNextLevel()
  }

  movePlayerToFront() {
    this.player.walk()
    this.mapper.track(this.player.position)
  }

  get currentPlayerCell() {
    return this.maze.currentLevel.grid.get(this.player.position)
  }

  get canPlayerProceed() {
    return !!this.maze.currentLevel.grid.getRelativeCell(this.player.position, this.player.direction, 2)
  }

  get isPlayerOnStair(): boolean {
    return this.currentPlayerCell?.type === 'stair'
  }
}
