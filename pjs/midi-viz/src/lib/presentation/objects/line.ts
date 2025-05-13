import * as T from 'three'
import { defaultScene } from '../setup.ts'
import { ChainablePoint, MovingPoint } from '../point.ts'

abstract class LineBase {
  protected readonly geometry: T.BufferGeometry
  protected points: MovingPoint[] = []
  protected readonly positions: Float32Array

  constructor(maxLength: number, material?: T.Material) {
    this.positions = new Float32Array(maxLength * 3) // 3 floats per point

    this.geometry = new T.BufferGeometry()
    this.geometry.setAttribute('position', new T.BufferAttribute(this.positions, 3))

    const line = new T.Line(this.geometry, material)
    defaultScene().add(line)
  }

  /**
   * update buffer's vertex positions based on current moving points' position
   * @protected
   */
  protected updateAttribPositions() {
    const positions = this.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < this.points.length; i++) {
      const node = this.points[i]

      positions[i * 3] = node.position.x
      positions[i * 3 + 1] = node.position.y
      positions[i * 3 + 2] = node.position.z
    }
    this.geometry.attributes.position.needsUpdate = true
  }
}

/**
 * line that accepts new points
 */
export class AdditiveLine extends LineBase {
  addPoint(point: MovingPoint) {
    this.points.push(point)
  }
  update() {
    this.points.forEach((point) => {point.move()})

    // remove dead nodes
    this.points = this.points.filter((node) => node.movement.length() > 0.1)

    this.updateAttribPositions()
    this.geometry.setDrawRange(0, this.points.length) // hide unused buffer data
  }
}

/**
 * line that has consistent number of points
 */
export class FixedLine extends LineBase {
  constructor(points: MovingPoint[], material?: T.Material) {
    super(points.length, material)
    this.points = points
    this.update()
    this.geometry.setDrawRange(0, this.points.length)
  }
  update() {
    this.updateAttribPositions()
  }
}

export class MovingChainLine extends FixedLine {
  override points: ChainablePoint[]

  constructor(points: ChainablePoint[], material?: T.Material) {
    super(points, material)
    this.points = points

    for (let i = 0; i < this.points.length - 1; i++) {
      this.points[i].connect(this.points[i + 1])
    }
  }

  checkChainReaction() {
    this.points.forEach( (point) => {
      point.checkChainReaction()
    })
  }

  connect(other: MovingChainLine) {
    this.points[0].connect(other.points[0])
    this.neighbours.push(other)
    other.neighbours.push(this)
  }

  neighbours: MovingChainLine[] = []
}
