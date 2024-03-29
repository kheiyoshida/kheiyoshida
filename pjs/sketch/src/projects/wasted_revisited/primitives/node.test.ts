import * as p5utils3d from 'p5utils/src/3d'
import { toRadians } from 'p5utils/src/3d'
import { SphericalAngles } from 'p5utils/src/3d/types'
import { createGraphNode, emitNodeEdge } from './node'

jest.mock('p5utils/src/3d', () => ({
  __esModule: true,
  ...jest.requireActual('p5utils/src/3d')
}))

describe(`node`, () => {
  it(`can be created with initial position`, () => {
    const node = createGraphNode([0, 1000, 0])
    expect(node.position).toMatchObject([0, 1000, 0])
  })
  it(`can hold its grow direction`, () => {
    const node = createGraphNode([0, 1000, 0])
    expect(node.growDirection).toMatchObject({ theta: 0, phi: 0 })
    node.growDirection = { theta: 20, phi: 20 }
    expect(node.growDirection).toMatchObject({ theta: 20, phi: 20 })
  })
  it(`can emit edge node passing parent's grow info`, () => {
    const node = createGraphNode([0, 0, 0])
    const directionDelta = { theta: 45, phi: 180 }
    const growAmount = 100
    const emitEdge = emitNodeEdge(node)
    const edge = emitEdge(directionDelta, growAmount)
    expect(edge.growDirection).toMatchObject({ theta: 45, phi: 180 })
    expect(edge.position[0]).toBeCloseTo(0)
    expect(edge.position[1]).toBeCloseTo(-100 * Math.cos(toRadians(45)))
    expect(edge.position[2]).toBeCloseTo(-100 * Math.cos(toRadians(45)))
    expect(node.edges.includes(edge)).toBe(true)
  })
  it(`can emit multiple edges by specifying delta options`, () => {
    const node = createGraphNode([0, 0, 0], { theta: 0, phi: 60 })
    const edges = node.emitEdges(3, 20, 100)
    expect(edges.forEach((e) => node.edges.includes(e)))
    expect(edges.length).toBe(3)
  })
  it(`can be randomized`, () => {
    const node = createGraphNode([0, 0, 0], { theta: 0, phi: 60 })
    const edges = node.emitEdges(3, 20, 100, (delta, growAmount) => {
      return [
        {
          ...delta,
          phi: delta.phi + 10,
        },
        growAmount + 100,
      ]
    })
    expect(edges.forEach((e) => node.edges.includes(e)))
    expect(edges.length).toBe(3)
  })
  it(`can move within range`, () => {
    jest.spyOn(p5utils3d, 'randomAngles').mockReturnValue({ theta: 90, phi: 0 })
    const moveAmount = 100
    const movableDistance = 300
    const node = createGraphNode([0, 0, 0], { theta: 0, phi: 0 }, moveAmount, movableDistance)
    node.move()
    expect(node.position[0]).toBeCloseTo(0)
    expect(node.position[1]).toBeCloseTo(0)
    expect(node.position[2]).toBeCloseTo(moveAmount)
    node.move()
    expect(node.position[2]).toBeCloseTo(moveAmount * 2)
    node.move()
    expect(node.position[2]).toBeCloseTo(moveAmount * 2) // restrained
    jest.resetAllMocks()
  })
  it(`can gradually slow down its speed when moving`, () => {
    const moveAmount = 100
    const decreaseSpeed = (s: number) => s - 10
    jest.spyOn(p5utils3d, 'randomAngles').mockReturnValue({ theta: 90, phi: 180 })
    const node = createGraphNode([0, 0, 0], { theta: 0, phi: 0 }, moveAmount, 1000, decreaseSpeed)
    node.move()
    expect(node.position[2]).toBeCloseTo(-moveAmount)
    node.move()
    expect(node.position[2]).toBeCloseTo(-moveAmount * 2 + 10) // decreased velocity
  })
  it(`can change the movement direction when moving`, () => {
    const moveAmount = 100
    const changeDirection = (angle: SphericalAngles) => ({
      theta: angle.theta + 45,
      phi: angle.phi,
    })
    jest.spyOn(p5utils3d, 'randomAngles').mockReturnValue({ theta: 90, phi: 0 })
    const node = createGraphNode(
      [0, 0, 0],
      { theta: 0, phi: 0 },
      moveAmount,
      1000,
      (s) => s,
      changeDirection
    )
    node.move()
    expect(node.position[0]).toBeCloseTo(0)
    expect(node.position[1]).toBeCloseTo(0)
    expect(node.position[2]).toBeCloseTo(moveAmount)
    node.move()
    expect(node.position[0]).toBeCloseTo(0)
    expect(node.position[1]).toBeCloseTo(moveAmount * Math.sin(toRadians(45)))
    expect(node.position[2]).toBeCloseTo(moveAmount + moveAmount * Math.cos(toRadians(45)))
  })
  it(`can update its speed`, () => {
    jest.spyOn(p5utils3d, 'randomAngles').mockReturnValue({ theta: 90, phi: 0 })
    const initialSpeed = 100
    const newSpeed = 120
    const node = createGraphNode([0, 0, 0], { theta: 0, phi: 0 }, initialSpeed)
    node.move()
    expect(node.position[2]).toBeCloseTo(initialSpeed)
    node.updateSpeed(newSpeed)
    node.move()
    expect(node.position[2]).toBeCloseTo(initialSpeed + newSpeed)
  })
})
