import { fireByRate, randomItemFromArray } from 'utils'
import { getBlockAtPosition, getCorridorBlocks } from './maze/level.ts'
import { Block } from './maze/block.ts'
import { Position, sumPosition } from './utils/position.ts'
import { getTurnedDirection, positionalDirection } from './utils/direction.ts'
import { getMatrixItem } from './utils/matrix.ts'
import { Player } from './player'
import { Maze } from './maze'
import { Mapper } from './map'
import { composeLogicalView, LogicalView } from './view'

export class Game {
  constructor(
    private maze: Maze,
    private player: Player,
    private mapper: Mapper
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

  get #currentPlayerBlock() {
    return getBlockAtPosition(this.maze.currentLevel, this.player.position)
  }

  get canPlayerProceed() {
    return this.#currentPlayerBlock.edges[this.player.direction]
  }

  get isPlayerOnStair(): boolean {
    return !!this.#currentPlayerBlock.stair
  }

  getView(): LogicalView {
    return composeLogicalView(this.getPath(), this.player.direction)
  }

  getPath(i = 0): Block[] {
    if (i > 2) return []
    const block = i === 0 ? this.#currentPlayerBlock : this.#getFrontBlock(i)
    if (block) {
      if (block.edges[this.player.direction]) return [block].concat(this.getPath(i + 1))
      else return [block]
    }
    return []
  }

  #getFrontBlock(dist = 1) {
    const front = this.#getPlayerFrontPosition(dist)
    return getMatrixItem(this.maze.currentLevel, front)
  }

  #getPlayerFrontPosition(dist = 1): Position {
    return sumPosition(this.player.position, positionalDirection(this.player.direction, dist))
  }
}
