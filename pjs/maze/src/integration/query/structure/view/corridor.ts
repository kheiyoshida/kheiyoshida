import { MazeView, ViewPosition, ViewX, ViewY, ViewZ } from './view.ts'
import { MazeCell, MazeCellType } from '../../../../core/level/cell.ts'
import { MazeGrid } from '../../../../core/level/grid.ts'
import { buildViewGrid } from './get.ts'
import { PhysicalMazeGrid } from '../../../../game/maze/physical/grid.ts'
import { Maze } from '../../../../game/maze'
import { game } from '../../../../game'
import { Structure } from '../../../../game/world/types.ts'

const NumericalRepresentationMap = {
  0: null,
  1: 'floor',
  2: 'stair',
} as const satisfies Record<number, MazeCellType | null>

type NumericRepresentation = keyof typeof NumericalRepresentationMap

const makeGrid = (input: NumericRepresentation[][]): MazeGrid => {
  const sizeY = input.length
  const sizeX = input[0].length

  const grid = new MazeGrid(sizeX, sizeY)
  for (let y = 0; y < sizeY; y++) {
    for (let x = 0; x < sizeX; x++) {
      const cellType = NumericalRepresentationMap[input[y][x]]
      if (cellType !== null) {
        grid.set({ x, y }, new MazeCell(cellType))
      }
    }
  }

  return grid
}

const corridorGrid = makeGrid([
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
])

const buildCorridorViewForStructure = (structure: Structure) => {
  return buildViewGrid(PhysicalMazeGrid.convert(corridorGrid, 'path', game.maze.worldState), {
    position: { x: 2, y: 3 },
    direction: 'n',
  })
}

export class AlternativeViewService {
  private currentLevel = 0
  private cachedView: MazeView | null = null
  constructor(private readonly maze: Maze = game.maze) {}

  /**
   * attach a "corridor" in front of the next level's starting point
   */
  public getNextLevelView(currentView: MazeView): MazeView {
    if (this.currentLevel === this.maze.currentLevelNumber && this.cachedView !== null) {
      return this.cachedView
    }
    this.currentLevel = this.maze.currentLevelNumber

    const structure = this.maze.structureContext.current
    const corridorView = buildCorridorViewForStructure(structure)

    for (let z = ViewZ.L5; z <= ViewZ.L6; z++) {
      for (let x = ViewX.Left2; x <= ViewX.Right2; x++) {
        for (let y = ViewY.Down2; y <= ViewY.Up2; y++) {
          const viewPos: ViewPosition = {
            x,
            y,
            z,
          }
          corridorView.setBlock(
            viewPos,
            currentView.getBlock({
              ...viewPos,
              z: z - 4,
            })!
          )
        }
      }
    }

    this.cachedView = corridorView

    return corridorView
  }
}
