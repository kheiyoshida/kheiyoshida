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

    console.log(this.maze.currentLevel.grid.filterItems((cell) => cell.start !== undefined))
    const startCellPos = this.maze.currentLevel.grid.findPosition(
      (_, cell) => cell !== null && cell.start !== undefined
    )!

    console.log(startCellPos)
    const startCell = this.maze.currentLevel.grid.get(startCellPos)!
    this.player.position = startCellPos
    this.player.direction = startCell.start!.direction
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
    return !!this.maze.currentLevel.grid.getRelativeCell(this.player.position, this.player.direction, 1)
  }

  get isPlayerOnStair(): boolean {
    return this.currentPlayerCell?.type === 'stair'
  }
}
