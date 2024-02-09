import type { Geometry, Vector } from 'p5'
import { VectorAngles } from '../3d/types'

export type ShapeCreateOptions = {
  distanceFromNode: number
}

export type ShapeGraph = ShapeNode[]

export type ShapeNode = {
  position: Vector
  vertices: ShapeVertex[]
  edges: ShapeNode[]
  rotate?: VectorAngles
}

export type ShapeVertex = Vector

export type CreateShape = () => ShapeGraph
export type GenerateGeometry = (graph: ShapeGraph) => Geometry
