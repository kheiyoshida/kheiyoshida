import { GameAggregate } from './game.ts'
import { Maze } from './maze'
import { paramBuild } from './maze/params.ts'
import { Player } from './player'
import { StatusEventValues } from './player/status/delta.ts'
import { Mapper } from './map/mapper.ts'
import { makeTestGrid, visualizeGrid3D } from '../__test__/grid/visualise.ts'
import * as builder from '../core/level/builder'
import { VerticalLayer } from './maze/physical/grid.ts'

describe(`${GameAggregate.name}`, () => {
  it(`should provide aggregate access point for integration layer`, () => {
    const mockGrid = makeTestGrid([
      [2, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 1, 1],
    ])
    jest.spyOn(builder, 'buildMazeGrid').mockReturnValueOnce(mockGrid)
    jest.spyOn(builder, 'buildMazeGrid').mockReturnValueOnce(mockGrid)

    const maze = new Maze(paramBuild)
    const player = new Player(StatusEventValues)
    const mapper = new Mapper()
    const game = new GameAggregate(maze, player, mapper)

    console.log(visualizeGrid3D(game.maze.currentLevel.physicalGrid, VerticalLayer.Middle))
  })
})
