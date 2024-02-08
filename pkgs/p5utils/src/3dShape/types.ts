import type { Geometry, Vector } from 'p5'

export type ShapeCreateOptions = {
  distanceFromNode: number
}

export type ShapeGraph = ShapeNode[]

export type ShapeNode = {
  position: Vector
  vertices: ShapeVertex[]
  edges: ShapeNode[]
}

export type ShapeVertex = Vector

export type CreateShape = () => ShapeGraph
export type GenerateGeometry = (graph: ShapeGraph) => Geometry
