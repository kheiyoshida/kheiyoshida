import { LineNode, LineNodeEmitter } from './line.ts'
import { Vector3 } from 'three'

describe(`${LineNode.name}`, () => {
  it(`can move`, () => {
    const node = new LineNode(new Vector3(), new Vector3(1, 0, 0))
    expect(node.position).toEqual({ x: 0, y: 0, z: 0 })

    node.move()
    expect(node.position).toEqual({ x: 1, y: 0, z: 0 })
  })

  it(`can set decreaseSpeed`, () => {
    LineNode.decreaseSpeed = (m) => {
      m.setLength(m.length() - 0.1)
    }
    const node = new LineNode(new Vector3(), new Vector3(1, 0, 0))
    expect(node.position).toEqual({ x: 0, y: 0, z: 0 })

    node.move()
    expect(node.position).toEqual({ x: 1, y: 0, z: 0 })

    node.move()
    expect(node.position).toEqual({ x: 1.9, y: 0, z: 0 })
  })
})

describe(`${LineNodeEmitter.name}`, () => {
  it(`can emit nodes to given direction with velocity`, () => {
    const emitter = new LineNodeEmitter()
    const node = emitter.emitNode(90, 1)
    expect(node.movement.x).toBe(1)
    expect(node.movement.y).toBeCloseTo(0)
    expect(node.movement.z).toBeCloseTo(0)
  })
  it(`can rotate itself`, () => {
    const emitter = new LineNodeEmitter()
    emitter.rotateY(90)
    const node = emitter.emitNode(90, 1)
    expect(node.movement.x).not.toBe(1)
    expect(node.movement.z).toBe(-1)
  })
})
