import { ChainablePoint, MovingPointEmitter } from './point.ts'
import { Vector3 } from 'three'
import { MovingPoint } from './point.ts'

describe(`${MovingPoint.name}`, () => {
  it(`can move`, () => {
    const node = new MovingPoint(new Vector3(), new Vector3(1, 0, 0))
    expect(node.position).toEqual({ x: 0, y: 0, z: 0 })

    node.move()
    expect(node.position).toEqual({ x: 1, y: 0, z: 0 })
  })

  it(`can set decreaseSpeed`, () => {
    MovingPoint.decreaseSpeed = (m) => {
      m.setLength(m.length() - 0.1)
    }
    const node = new MovingPoint(new Vector3(), new Vector3(1, 0, 0))
    expect(node.position).toEqual({ x: 0, y: 0, z: 0 })

    node.move()
    expect(node.position).toEqual({ x: 1, y: 0, z: 0 })

    node.move()
    expect(node.position).toEqual({ x: 1.9, y: 0, z: 0 })
  })
})

describe(`${MovingPointEmitter.name}`, () => {
  it(`can emit nodes to given direction with velocity`, () => {
    const emitter = new MovingPointEmitter()
    const node = emitter.emit(90, 1)
    expect(node.movement.x).toBe(1)
    expect(node.movement.y).toBeCloseTo(0)
    expect(node.movement.z).toBeCloseTo(0)
  })
  it(`can rotate itself`, () => {
    const emitter = new MovingPointEmitter()
    emitter.rotateY(90)
    const node = emitter.emit(90, 1)
    expect(node.movement.x).not.toBe(1)
    expect(node.movement.z).toBe(-1)
  })
})

describe(`${ChainablePoint.name}`, () => {
  it(`can connect to other points`, () => {
    const point1 = new ChainablePoint()
    const point2 = new ChainablePoint()
    const point3 = new ChainablePoint()
    point1.connect(point2)
    expect(point1.neighbours.includes(point2)).toBe(true)
    expect(point2.neighbours.includes(point1)).toBe(true)
    point1.connect(point3)
    point1.connect(point3)
    expect(point1.neighbours.includes(point3)).toBe(true)
    expect(point3.neighbours.includes(point1)).toBe(true)
  })

  it(`can check chain reaction for neighbours and should pull neighbours if necessary`, () => {
    const a = new ChainablePoint(new Vector3(1, 1, 0), new Vector3(0.1, 0, 0)) // puller
    const b = new ChainablePoint(new Vector3(0, 0, 0), new Vector3(0, 0, 0)) // to be pulled
    const c = new ChainablePoint(new Vector3(1, 0.2, 0), new Vector3(0, 0, 0)) // not to be pulled
    a.connect(b)
    a.connect(c)
    ChainablePoint.pullThresholdDistance = 1.0

    a.checkChainReaction()
    expect(b.movement).toEqual(new Vector3(1, 1, 0).setLength(0.1)) // vector b -> a with the speed of a
    expect(c.movement).toEqual(new Vector3(0, 0, 0)) // not changed
  })

  it(`should set neighbour's position immediately if beyond pull threshold`, () => {
    const a = new ChainablePoint(new Vector3(1, 0, 0), new Vector3(0.1, 0, 0)) // puller
    const b = new ChainablePoint(new Vector3(-0.1, 0, 0), new Vector3(0, 0, 0)) // to be pulled
    a.connect(b)
    ChainablePoint.pullThresholdDistance = 1.0

    a.checkChainReaction()
    expect(b.movement).toEqual(new Vector3(1, 0, 0).setLength(0.1)) // vector b -> a with the speed of a
    expect(b.position.x).toBeCloseTo(0.1)
  })
})
