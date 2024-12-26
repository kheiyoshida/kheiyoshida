import { Position } from '../utils/position.ts'
import { Direction } from '../utils/direction.ts'
import { Stair, StairType } from './object.ts'

type Edges = {
  [k in Direction]: boolean
}

export class Block {
  private _edges: Edges
  get edges() {
    return this._edges
  }

  constructor(
    readonly position: Position,
    edges?: { [k in Direction]?: boolean }
  ) {
    this._edges = {
      n: edges?.n || false,
      e: edges?.e || false,
      s: edges?.s || false,
      w: edges?.w || false,
    }
  }

  public set(edges: { [k in Direction]?: boolean }) {
    this._edges = Object.assign({ ...this._edges }, edges)
  }

  private _stair?: Stair
  public get stair() {
    return this._stair
  }

  public setStair(stairType: StairType): void {
    this._stair = new Stair(stairType)
  }

  get isDeadEnd() {
    return Object.values(this._edges).filter((v) => v).length === 1
  }

  get corridorDirection(): Direction | undefined {
    if (this._edges.e) {
      if (this._edges.w && !this._edges.n && !this._edges.s) {
        return 'e'
      }
    } else if (this._edges.n) {
      if (this._edges.s && !this._edges.w && !this._edges.e) {
        return 'n'
      }
    }
  }

  get isCorridor() {
    return Boolean(this.corridorDirection)
  }

  public distance(other: Block) {
    if (this === other) throw Error(`distance should be compared with another node`)
    return Math.abs(other.position[0] - this.position[0]) + Math.abs(other.position[1] - this.position[1])
  }

  public isAdjacent(another: Block): boolean {
    return this.distance(another) === 1
  }

  public direction(other: Block, prefer: 'ns' | 'ew' = 'ns'): Direction {
    let ns, ew

    if (this.position[0] < other.position[0]) {
      ns = 's'
    } else if (this.position[0] > other.position[0]) {
      ns = 'n'
    }

    if (this.position[1] < other.position[1]) {
      ew = 'e'
    } else if (this.position[1] > other.position[1]) {
      ew = 'w'
    }

    if (!ns && !ew) {
      throw Error('direction must be compared between two different nodes')
    }

    if (prefer === 'ns') {
      return (ns || ew) as Direction
    } else {
      return (ew || ns) as Direction
    }
  }

  get edgeList(): Direction[] {
    return (Object.keys(this.edges) as Direction[])
      .map((k) => (this.edges[k] ? k : null))
      .filter((k): k is Direction => k !== null)
  }
}
