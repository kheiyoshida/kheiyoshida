import type { Geometry, Vector } from 'p5'

export type ShapeGraph = ShapeNode[]

export type ShapeNode = {
  position: Vector
  vertices: Vector[]
  edges: ShapeNode[]
}

export type CreateShape = () => ShapeGraph
export type GenerateGeometry = (graph: ShapeGraph) => Geometry
