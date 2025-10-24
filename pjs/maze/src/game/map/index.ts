import { Position } from 'utils'
import { MazeLevel } from '../maze/level.ts'
import { buildMap, Map, track } from './map.ts'

export class Mapper {
  #map: Map = []

  get map() {
    return this.#map
  }

  resetMap(level: MazeLevel) {
    this.#map = buildMap(level)
  }

  track({ from, dest }: { from: Position; dest: Position }) {
    const grid = this.#map.slice()
    this.#map = track(grid, { from, dest })
  }
}
