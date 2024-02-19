import type { Geometry, Vector } from 'p5'
import { SphericalAngles } from '../3d/types'

export type ShapeGraph = ShapeNode[]

export type ShapeNode = {
  position: Vector
  vertices: ShapeVertex[]
  edges: ShapeNode[]
  distanceToEachVertex: number
  rotate?: SphericalAngles
  id?: string | number
}

export type ShapeVertex = Vector

export type CreateShape = () => ShapeGraph
export type GenerateGeometry = (graph: ShapeGraph) => Geometry
