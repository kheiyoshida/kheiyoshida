import * as T from 'three'
import { defaultScene } from '../setup.ts'
import { MovingPoint } from '../point.ts'

export class MovableBall {
  constructor(
    readonly point: MovingPoint,
    radius: number,
    material: T.Material,
  ) {
    const ballGeometry = new T.SphereGeometry(radius, 10, 10)
    this.mesh = new T.Mesh(ballGeometry, material)
    defaultScene().add(this.mesh)
    this.update()
  }

  private readonly mesh: T.Mesh

  update() {
    this.mesh.position.set(this.point.position.x, this.point.position.y, this.point.position.z)
  }
}
