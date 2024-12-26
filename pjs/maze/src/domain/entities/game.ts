import { fireByRate, randomItemFromArray } from 'utils'
import { getBlockAtPosition, getCorridorBlocks } from './maze/level.ts'
import { Block } from './maze/block.ts'
import { Position, sumPosition } from './utils/position.ts'
import { getTurnedDirection, positionalDirection } from './utils/direction.ts'
import { getMatrixItem } from './utils/matrix.ts'
import { maze, player } from '../game/setup.ts'
import { Player } from './player'
import { Maze } from './maze'

export class Game {
  constructor(
    private maze: Maze,
    private player: Player
  ) {
    this.#setupNextLevel()
  }

  #setupNextLevel() {
    const level = this.maze.currentLevel
    const initialPlayerBlock = randomItemFromArray(getCorridorBlocks(level))
    this.player.position = initialPlayerBlock.position
    this.player.direction = getTurnedDirection(
      fireByRate(0.5) ? 'right' : 'left',
      initialPlayerBlock.corridorDirection!
    )
  }

  goDownStairs() {
    player.proceedToNextFloor()
    this.#setupNextLevel()
  }

  movePlayerToFront() {
    if (this.canPlayerProceed) {
      const frontPosition = this.#getPlayerFrontPosition()
      return player.walk(frontPosition)
    }
  }

  get #currentPlayerBlock() {
    return getBlockAtPosition(maze.currentLevel, player.position)
  }

  get canPlayerProceed() {
    return this.#currentPlayerBlock.edges[player.direction]
  }

  get isPlayerOnStair(): boolean {
    return !!this.#currentPlayerBlock.stair
  }

  getPath(i = 0): Block[] {
    if (i > 2) return []
    const block = i === 0 ? this.#currentPlayerBlock : this.#getFrontBlock(i)
    if (block) {
      if (block.edges[player.direction]) return [block].concat(this.getPath(i + 1))
      else return [block]
    }
    return []
  }

  #getFrontBlock(dist = 1) {
    const front = this.#getPlayerFrontPosition(dist)
    return getMatrixItem(maze.currentLevel, front)
  }

  #getPlayerFrontPosition(dist = 1): Position {
    return sumPosition(player.position, positionalDirection(player.direction, dist))
  }
}
