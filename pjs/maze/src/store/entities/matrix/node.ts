import { Position } from '../../../utils/position'
import { Direction } from '../../../domain/interface/maze/direction'

type Edges = {
  [k in Direction]: boolean
}

export class Node {
  private _edges: Edges
  get edges() {
    return this._edges
  }

  constructor(
    public pos: Position,
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

  private _stair = false
  public get stair() {
    return this._stair
  }

  public setStair() {
    this._stair = true
  }

  get isDeadEnd() {
    return Object.values(this._edges).filter((v) => v === true).length === 1
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

  public distance(other: Node) {
    if (this === other) throw Error(`distance should be compared with another node`)
    return Math.abs(other.pos[0] - this.pos[0]) + Math.abs(other.pos[1] - this.pos[1])
  }

  public isAdjacent(another: Node): boolean {
    return this.distance(another) === 1
  }

  public direction(other: Node, prefer: 'ns' | 'ew' = 'ns'): Direction {
    let ns, ew

    if (this.pos[0] < other.pos[0]) {
      ns = 's'
    } else if (this.pos[0] > other.pos[0]) {
      ns = 'n'
    }

    if (this.pos[1] < other.pos[1]) {
      ew = 'e'
    } else if (this.pos[1] > other.pos[1]) {
      ew = 'w'
    }

    if (!ns && !ew) {
      throw Error('directioin must be compared between two different nodes')
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
