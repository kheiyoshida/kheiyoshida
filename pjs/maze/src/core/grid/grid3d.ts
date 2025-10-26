import { Grid2D } from './grid2d.ts'
import { Position2D } from './position2d.ts'

export type Position3D = { x: number; y: number, z: number }

export class Grid3D<Item> {
  public readonly grid2D: Grid2D<VerticalGrid3DSlice<Item>>

  constructor(
    readonly sizeX: number,
    readonly sizeY: number,
    readonly sizeZ: number
  ) {
    this.sizeX = sizeX
    this.sizeY = sizeY
    this.sizeZ = sizeZ
    this.grid2D = new Grid2D<VerticalGrid3DSlice<Item>>(sizeX, sizeY)
    this.grid2D.iterate((_, position) => {
      this.grid2D.set(position, new VerticalGrid3DSlice(sizeZ))
    })
  }

  public set(position: Position3D, item: Item) {
    this.grid2D.get(position)?.set(position.z, item)
  }

  public get(position: Position3D): Item | null {
    if (position.x < 0 || position.x >= this.sizeX) return null
    if (position.y < 0 || position.y >= this.sizeY) return null
    if (position.z < 0 || position.z >= this.sizeZ) return null
    return this.grid2D.get(position)?.get(position.z) || null
  }

  public getVerticalSlice(position: Position2D): VerticalGrid3DSlice<Item> {
    return this.grid2D.get(position)!
  }

  public iterate(cb: (item: Item | null, position: Position3D) => void) {
    this.grid2D.iterate((slice, position) => {
      slice?.items.forEach((item, z) => cb(item, { ...position, z }))
    })
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

export class VerticalGrid3DSlice<Item> {
  public readonly items: (Item | null)[]

  constructor(readonly sizeZ: number) {
    this.items = Array.from({ length: sizeZ }).map(() => null)
  }

  public set(index: number, item: Item) {
    if (index < 0 || index >= this.sizeZ) throw Error(`index out of bounds: ${index}`)
    this.items[index] = item
  }

  public get(index: number): Item | null {
    if (index < 0 || index >= this.sizeZ) return null
    return this.items[index]
  }
}
