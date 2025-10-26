import { fireByRate, randomItemFromArray } from 'utils'
import { getBlockAtPosition, getCorridorBlocks } from './maze/legacy/level.ts'
import { Position, sumPosition } from '../core/_legacy/position.ts'
import { getTurnedDirection, positionalDirection } from '../core/grid/direction.ts'
import { Player } from './player'
import { Maze } from './maze/legacy'
import { Mapper } from './map'

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
    this.mapper.resetMap(this.maze.currentLevel)

    const initialPlayerBlock = randomItemFromArray(getCorridorBlocks(this.maze.currentLevel))
    this.player.position = initialPlayerBlock.position
    this.player.direction = getTurnedDirection(
      fireByRate(0.5) ? 'right' : 'left',
      initialPlayerBlock.corridorDirection!
    )
  }

  goDownStairs() {
    this.#setupNextLevel()
  }

  movePlayerToFront() {
    const frontPosition = this.#getPlayerFrontPosition()
    const res = this.player.walk(frontPosition)
    this.mapper.track(res)
  }

  get currentPlayerBlock() {
    return getBlockAtPosition(this.maze.currentLevel, this.player.position)
  }

  get canPlayerProceed() {
    return this.currentPlayerBlock.edges[this.player.direction]
  }

  get isPlayerOnStair(): boolean {
    return !!this.currentPlayerBlock.stair
  }

  #getPlayerFrontPosition(dist = 1): Position {
    return sumPosition(this.player.position, positionalDirection(this.player.direction, dist))
  }
}
