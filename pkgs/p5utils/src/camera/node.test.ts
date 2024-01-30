import p5 from 'p5'
import { createCameraNode } from './node'

describe(`${createCameraNode.name}`, () => {
  it(`can be set up with initial position`, () => {
    const node = createCameraNode(new p5.Vector(0, 10, 0))
    expect(node.position).toMatchObject([0, 10, 0])
  })
  it(`can change its position`, () => {
    const node = createCameraNode()
    node.setPosition(10, 0, 0)
    expect(node.position).toMatchObject([10, 0, 0])
  })
  it(`can set direction & speed to move`, () => {
    const node = createCameraNode()
    node.setPosition(0, 0, 0)
    node.setDirection({ theta: 90, phi: 0 })
    node.setSpeed(100)
    node.move()
    expect(node.position).toMatchInlineSnapshot(`
      [
        0,
        -6.123233995736766e-15,
        100,
      ]
    `)
  })
})
