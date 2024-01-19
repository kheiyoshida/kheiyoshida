import p5 from 'p5'
import { connect } from '../graph/node'
import { ShapeNode, Vertex } from './types'
import { getNearestVertices } from './utils'

const prepareNode = (position: p5.Vector, vertices: Vertex[] = []): ShapeNode => ({
  position,
  move: new p5.Vector(),
  angles: {
    theta: 0,
    phi: 0,
  },
  edges: [],
  option: { distanceFromNode: 50 },
  vertices,
})

describe('getNearestVertices', () => {
  it('should get the nearest vertices from edge (up to 3)', () => {
    const node = prepareNode(new p5.Vector())
    const edge: ShapeNode = prepareNode(new p5.Vector(100, 0, 0), [
      { position: new p5.Vector(50, 50, 0) },
      { position: new p5.Vector(50, -50, 0) },
      { position: new p5.Vector(150, 0, 50) },
      { position: new p5.Vector(150, 0, -100) },
    ])
    connect(node, edge)
    const result = getNearestVertices(node)
    expect(result).toHaveLength(3)
    expect(result).toMatchObject(edge.vertices.slice(0, 3))
  })
  it('should get at least one vertex from each node', () => {
    const node = prepareNode(new p5.Vector())
    const vertices = [
      { position: new p5.Vector(50, 50, 0) },
      { position: new p5.Vector(50, -50, 0) },
      { position: new p5.Vector(150, 0, 50) },
      { position: new p5.Vector(150, 0, -100) },
    ]
    const edge: ShapeNode = prepareNode(new p5.Vector(100, 0, 0), vertices)
    const vertices2 = [
      { position: new p5.Vector(0, 0, -300) },
      { position: new p5.Vector(0, 0, -500) },
      { position: new p5.Vector(200, 200, -300) },
      { position: new p5.Vector(200, -200, -500) },
    ]
    const edge2: ShapeNode = prepareNode(new p5.Vector(0, 0, -100), vertices2)
    connect(node, edge)
    connect(node, edge2)
    const result = getNearestVertices(node)
    expect(result.includes(edge2.vertices[0])).toBe(true)
    expect(result).toMatchObject([vertices[0], vertices2[0], vertices[1], vertices2[2]])
  })
  it('should not get shared vertex twice', () => {
    const node = prepareNode(new p5.Vector())
    const vertices = [
      { position: new p5.Vector(50, 50, 0) },
      { position: new p5.Vector(50, -50, 0) },
      { position: new p5.Vector(150, 0, 50) },
      { position: new p5.Vector(150, 0, -100) },
    ]
    const edge: ShapeNode = prepareNode(new p5.Vector(100, 0, 0), vertices)
    const vertices2 = [
      vertices[0],
      vertices[1],
      { position: new p5.Vector(200, 200, -300) },
      { position: new p5.Vector(200, -200, -500) },
    ]
    const edge2: ShapeNode = prepareNode(new p5.Vector(0, 0, -100), vertices2)
    connect(node, edge)
    connect(node, edge2)
    const result = getNearestVertices(node)
    expect(result.includes(edge2.vertices[0])).toBe(true)
    expect(result).toMatchObject([vertices[0], vertices[1], vertices[2], vertices2[2]])
  })
})
