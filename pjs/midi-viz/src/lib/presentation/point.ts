import * as T from 'three'
import { toRadians, xyz } from './utils.ts'

export class MovingPoint {
  constructor(
    public position: T.Vector3 = new T.Vector3(0, 0, 0),
    public movement: T.Vector3 = new T.Vector3(0, 0, 0)
  ) {}

  move() {
    this.position.add(this.movement)
    ;(this.constructor as typeof MovingPoint).decreaseSpeed?.(this.movement)
  }

  public static decreaseSpeed: (movement: T.Vector3) => void
}

export class MovingPointEmitter {
  public theta: number = toRadians(90)
  public phi: number = toRadians(0)

  /**
   * @param angle degrees
   * @param velocity
   */
  emit(angle: number, velocity: number): MovingPoint {
    const movement = new T.Vector3().setFromSphericalCoords(velocity, this.theta, this.phi + toRadians(angle))
    return new MovingPoint(new T.Vector3(), movement)
  }

  /**
   * rotate emitter around Y axis
   * @param angle in degrees
   */
  rotateY(angle = 0) {
    this.phi += toRadians(angle)
  }
}

export const constrainPointPosition = (radiusFromCenter: number, points: MovingPoint[]) => {
  for (const point of points) {
    if (point.position.length() > radiusFromCenter) {
      point.position.setLength(radiusFromCenter)
    }
  }
}

export class ChainablePoint extends MovingPoint {
  private _neighbours: ChainablePoint[] = []
  get neighbours() {
    return this._neighbours
  }

  connect(other: ChainablePoint) {
    if (this._neighbours.includes(other)) return
    this._neighbours.push(other)
    other.connect(this)
  }

  override move() {
    super.move()
    this.needsCheck = true
    this.sortFrag = 0
  }

  sortFrag: number = 0

  static pullThresholdDistance: number = 10.0

  public needsCheck = true;

  /**
   * check if neighbours should be pulled by this point
   * and pull them if it should
   */
  checkChainReaction() {
    this.needsCheck = false
    for (const neighbour of this.neighbours) {
      if (!neighbour.needsCheck) continue

      if (this.position.distanceTo(neighbour.position) > ChainablePoint.pullThresholdDistance) {
        this.pullNeighbour(neighbour)
      }
    }
  }

  private pullNeighbour(neighbour: ChainablePoint) {
    // set neighbour movement
    const thisMovementLength = this.movement.length()
    const neighbourToThis = new T.Vector3().subVectors(this.position, neighbour.position)
    neighbour.movement.set(...xyz(neighbourToThis.setLength(thisMovementLength)))

    // set neighbour position
    const thisToNeighbour = neighbourToThis.multiplyScalar(-1)
    neighbour.position.set(
      ...xyz(
        new T.Vector3().addVectors(
          this.position,
          thisToNeighbour.setLength(ChainablePoint.pullThresholdDistance - thisMovementLength)
        )
      )
    )
  }
}
