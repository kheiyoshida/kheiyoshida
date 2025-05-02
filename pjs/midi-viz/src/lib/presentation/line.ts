import * as THREE from 'three'
import { defaultScene } from './setup.ts'
import { toRadians } from './utils.ts'

export class Line {
  private readonly geometry: THREE.BufferGeometry
  private nodes: LineNode[] = []
  private readonly positions: Float32Array

  constructor(maxLength: number, material: THREE.Material) {
    this.positions = new Float32Array(maxLength * 3) // 3 floats per point

    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))

    const line = new THREE.Line(this.geometry, material)
    defaultScene().add(line)
  }

  addNode(node: LineNode) {
    this.nodes.push(node)
  }

  update() {
    const positions = this.geometry.attributes.position.array as Float32Array

    // remove dead nodes
    this.nodes = this.nodes.filter((node) => node.movement.length() > 0.01)

    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i]
      node.move()

      positions[i * 3] = node.position.x
      positions[i * 3 + 1] = node.position.y
      positions[i * 3 + 2] = node.position.z
    }
    this.geometry.attributes.position.needsUpdate = true
    this.geometry.setDrawRange(0, this.nodes.length)
  }
}

export class LineNode {
  constructor(
    public position: THREE.Vector3,
    public movement: THREE.Vector3
  ) {}

  move() {
    this.position.add(this.movement)

    if (LineNode.decreaseSpeed) {
      LineNode.decreaseSpeed(this.movement)
    }
  }

  public static decreaseSpeed: (movement: THREE.Vector3) => void
}

export class LineNodeEmitter {
  public theta: number = toRadians(90)
  public phi: number = toRadians(0)

  /**
   * @param angle degrees
   * @param velocity
   */
  emitNode(angle: number, velocity: number): LineNode {
    const movement = new THREE.Vector3().setFromSphericalCoords(
      velocity,
      this.theta,
      this.phi + toRadians(angle)
    )
    return new LineNode(new THREE.Vector3(), movement)
  }

  /**
   * rotate emitter around Y axis
   * @param angle in degrees
   */
  rotateY(angle = 0) {
    this.phi += toRadians(angle)
  }
}
