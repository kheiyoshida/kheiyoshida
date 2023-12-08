import p5 from 'p5'
import {
  collectEdgeVertices,
  createInitialNode,
  createPerpendicularVertex,
  createTetraVertices,
} from './create'
import { ShapeNode } from './types'

const createDefaultNode = () =>
  createInitialNode(
    {
      position: new p5.Vector(),
      move: new p5.Vector(),
      angles: {
        theta: 0,
        phi: 0,
      },
    },
    { distanceFromNode: 50 }
  )

const PI = 3.14159265359
const radToDegrees = (rad: number) => ((2 * rad) / PI) * 360

describe('calculateVertices', () => {
  it.todo(
    'should map vertices to each node and create a node list for the entire graph'
  )
})

describe('collectEdgeVertices', () => {
  const createShapeNode = (
    excerpt: Pick<ShapeNode, 'position' | 'vertices' | 'edges'>
  ): ShapeNode => ({
    ...excerpt,
    move: new p5.Vector(),
    angles: {
      theta: 0,
      phi: 0,
    },
    option: { distanceFromNode: 50 },
  })
  it("should collect node's edge's 3 nearest vertices if one edge connected", () => {
    const edge: ShapeNode = createShapeNode({
      position: new p5.Vector(150, 0, 0),
      vertices: [
        { position: new p5.Vector(200, 0, -100) },
        { position: new p5.Vector(100, 0, -100) },
        { position: new p5.Vector(150, 100, 100) },
        { position: new p5.Vector(150, -100, 100) },
      ],
      edges: [],
    })
    const node: ShapeNode = createShapeNode({
      position: new p5.Vector(0, 0, 0),
      vertices: [],
      edges: [edge],
    })
    const result = collectEdgeVertices(node)
    expect(result).toHaveLength(3)
    expect(result.map((v) => v.position.array())).toMatchInlineSnapshot(`
      [
        [
          100,
          0,
          -100,
        ],
        [
          150,
          100,
          100,
        ],
        [
          150,
          -100,
          100,
        ],
      ]
    `)
  })
  it("should collect node's edges' but up to 3 from each edge", () => {
    const edge: ShapeNode = createShapeNode({
      position: new p5.Vector(200, 0, 0),
      vertices: [
        { position: new p5.Vector(200, 0, -100) },
        { position: new p5.Vector(100, 0, -100) },
        { position: new p5.Vector(150, 100, 100) },
        { position: new p5.Vector(150, -100, 100) },
      ],
      edges: [],
    })
    const edge2: ShapeNode = createShapeNode({
      position: new p5.Vector(-200, 0, 0),
      vertices: [
        { position: new p5.Vector(-500, 0, -100) },
        { position: new p5.Vector(-200, 0, -100) },
        { position: new p5.Vector(-300, 100, 100) },
        { position: new p5.Vector(-300, -100, 100) },
      ],
      edges: [],
    })
    const node: ShapeNode = createShapeNode({
      position: new p5.Vector(0, 0, 0),
      vertices: [],
      edges: [edge, edge2],
    })
    const result = collectEdgeVertices(node)
    expect(result).toHaveLength(4)
    expect(result.map((v) => v.position.array())).toMatchInlineSnapshot(`
      [
        [
          100,
          0,
          -100,
        ],
        [
          -200,
          0,
          -100,
        ],
        [
          150,
          100,
          100,
        ],
        [
          -300,
          100,
          100,
        ],
      ]
    `)
  })
  it.skip('should collect nearest ones', () => {
    //
  })
  it.skip("should merge node's edges' vertices when 2+ edges detected", () => {
    // next scope
  })
})

describe('calculateNodeVertices', () => {
  //
})

describe('createTetraVertices', () => {
  it('should evenly map vertices for a node', () => {
    const result = createTetraVertices(50, 0)
    expect(result.map((v) => v.array())).toMatchInlineSnapshot(`
      [
        [
          0,
          -50,
          0,
        ],
        [
          40.8174589268032,
          16.690341503714805,
          -23.566237443599444,
        ],
        [
          -40.81780517689194,
          16.690341503714805,
          -23.565637717462018,
        ],
        [
          0.0006925031146618199,
          16.690341503714805,
          47.13207506581706,
        ],
      ]
    `)
    const center = new p5.Vector()
    result.forEach((vector) => {
      expect(Math.round(center.dist(vector))).toBe(50)
    })
  })
  it('should add a single node in the opposite of others when just one required', () => {
    //
  })
})

describe('createPerpendicularVertex', () => {
  it('should create a vertex that is perpendicular against the surface', () => {
    const node = createDefaultNode()
    const result = createPerpendicularVertex(node, [
      { position: new p5.Vector(100, 100, 100) },
      { position: new p5.Vector(-100, 100, 100) },
      { position: new p5.Vector(0, 100, -100) },
    ])
    expect(result.position.array()).toMatchInlineSnapshot(`
      [
        0,
        -50,
        0,
      ]
    `)
  })
})
