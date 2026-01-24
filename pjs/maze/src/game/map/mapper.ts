import { MapGrid } from './grid.ts'
import { MazeGrid } from '../../core/level/grid.ts'
import { Position2D } from '../../core/grid/position2d.ts'

export class Mapper {
  private _isOpen = false
  public get isOpen(): boolean {
    return this._isOpen
  }
  public open() {
    this._isOpen = true
  }
  public close() {
    this._isOpen = false
  }

  private _mapGrid!: MapGrid

  public get map(): MapGrid {
    return this._mapGrid
  }

  public resetMap(mazeGrid: MazeGrid) {
    this._mapGrid = new MapGrid(mazeGrid)
  }

  public track(position: Position2D) {
    this._mapGrid.visit(position)
  }
}
