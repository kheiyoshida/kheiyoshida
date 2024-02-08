import p5 from 'p5'
import { extractNodeSurfaceVertices, finalizeNodeSurfaces } from './node'
import { ShapeNode } from '../types'
import * as surface from './surface'

const prepare = () => {
  const vertices = [
    p5.Vector.fromAngles(0, 0, 50),
    p5.Vector.fromAngles(109, 0, 50),
    p5.Vector.fromAngles(109, 120, 50),
    p5.Vector.fromAngles(109, 240, 50),
  ]
  const node: ShapeNode = {
    position: new p5.Vector(),
    edges: [],
    vertices,
  }
  return { vertices, node }
}

describe(`${finalizeNodeSurfaces.name}`, () => {
  it(`should finalize the shape for each surface of tetra node`, () => {
    const { node } = prepare()
    const spyFinalizeSurface = jest.spyOn(surface, 'finalizeSurface')
    finalizeNodeSurfaces(node)
    expect(spyFinalizeSurface).toHaveBeenCalledTimes(4)
  })
})

test(`${extractNodeSurfaceVertices.name}`, () => {
  const { vertices, node } = prepare()
  const surfaces = extractNodeSurfaceVertices(node)
  expect(surfaces[0]).toMatchObject([vertices[1], vertices[2], vertices[3]])
})
