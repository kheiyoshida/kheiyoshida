import { Grid2D } from './grid2d.ts'

export type Position3D = { x: number; y: number, z: number }

export class Grid3D<Item> {
  public readonly items: Grid2D<Item>[]

  constructor(
    readonly sizeX: number,
    readonly sizeY: number,
    readonly sizeZ: number
  ) {
    this.sizeX = sizeX
    this.sizeY = sizeY
    this.sizeZ = sizeZ
    this.items = Array.from({ length: sizeZ }).map(() => new Grid2D(sizeX, sizeY))
  }

  public set(position: Position3D, item: Item) {
    this.items[position.z].set(position, item)
  }

  public get(position: Position3D): Item | null {
    if (position.x < 0 || position.x >= this.sizeX) return null
    if (position.y < 0 || position.y >= this.sizeY) return null
    if (position.z < 0 || position.z >= this.sizeZ) return null
    return this.items[position.z].get(position) || null
  }

  public iterate(cb: (item: Item | null, position: Position3D) => void) {
    this.items.forEach((layer, z) => layer.iterate((item, position) => cb(item, { ...position, z })))
  }

  public filter(predicate: (item: Item, position: Position3D) => boolean): Item[] {
    const result: Item[] = []
    this.iterate((item, position) => {
      if (item !== null && predicate(item, position)) {
        result.push(item)
      }
    })
    return result
  }
}
