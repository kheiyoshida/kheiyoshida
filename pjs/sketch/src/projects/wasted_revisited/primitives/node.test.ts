import { toRadians } from 'p5utils/src/3d'
import { createGraphNode, emitNodeEdge } from './node'

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
})
