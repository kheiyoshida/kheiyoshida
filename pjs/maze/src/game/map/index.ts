import { Position } from 'utils'
import { MazeLevel } from '../maze/legacy/level.ts'
import { buildMap, Map, track } from './map.ts'

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

  private _map: Map = []

  public get map() {
    return this._map
  }

  public resetMap(level: MazeLevel) {
    this._map = buildMap(level)
  }

  public track({ from, dest }: { from: Position; dest: Position }) {
    const grid = this._map.slice()
    this._map = track(grid, { from, dest })
  }
}
