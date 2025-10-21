
export type Position2D = { x: number; y: number }

export class Grid2D<Item> {
  public readonly items: Item[][]

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

  public filter(predicate: (item: Item, position: Position2D) => boolean): Item[] {
    const result: Item[] = []
    this.iterate((item, position) => {
      if (item !== null && predicate(item, position)) {
        result.push(item)
      }
    })
    return result
  }
}
