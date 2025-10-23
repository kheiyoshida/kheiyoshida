import { randomIntInclusiveBetween } from 'utils'
import { Position2D } from './position2d.ts'

export class Grid2D<Item> {
  public readonly items: (Item | null)[][]

  constructor(
    readonly sizeX: number,
    readonly sizeY: number
  ) {
    this.sizeX = sizeX
    this.sizeY = sizeY
    this.items = Array.from({ length: sizeY }, () => Array(sizeX).fill(null))
  }

  public set(position: Position2D, item: Item) {
    this.items[position.y][position.x] = item
  }

  public get(position: Position2D): Item | null {
    if (position.x < 0 || position.x >= this.sizeX) return null
    if (position.y < 0 || position.y >= this.sizeY) return null
    return this.items[position.y][position.x] || null
  }

  public iterate(cb: (item: Item | null, position: Position2D) => void) {
    this.items.forEach((row, y) => row.forEach((item, x) => cb(item, { x, y })))
  }

  public iterateItems(cb: (item: Item, position: Position2D) => void) {
    this.items.forEach((row, y) => row.forEach((item, x) => item && cb(item, { x, y })))
  }

  public filter(predicate: (item: Item, position: Position2D) => boolean): Item[] {
    const result: Item[] = []
    this.iterate((item, position) => {
      if (item !== null && predicate(item, position)) {
        result.push(item)
      }
    })
    return result
  }

  public count(): number {
    return this.items.reduce((acc, row) => acc + row.filter((item) => item !== null).length, 0)
  }

  getRandomPosition(): Position2D {
    return {
      x: randomIntInclusiveBetween(0, this.sizeX - 1),
      y: randomIntInclusiveBetween(0, this.sizeY - 1),
    }
  }

  getRandomEvenPosition(): Position2D {
    return {
      x: randomIntInclusiveBetween(0, Math.floor((this.sizeX - 1) / 2)) * 2,
      y: randomIntInclusiveBetween(0, Math.floor((this.sizeY - 1) / 2)) * 2,
    }
  }
}
