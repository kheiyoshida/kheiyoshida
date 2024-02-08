import p5 from 'p5'
import { ShapeNode } from '../types'
import { Position3D } from '../../camera/types'
import { VectorAngles } from '../../3d/types'
import { sumVectorAngles } from '../../3d'
import { TETRAHEDRAL_DEGREE } from '../../constants'

export const createShapeNode = (position: Position3D = [0, 0, 0]): ShapeNode => ({
  position: new p5.Vector(...position),
  edges: [],
  vertices: [],
})

export const connectShapeNodes = (node1: ShapeNode, node2: ShapeNode): void => {
  node1.edges = [...node1.edges, node2]
  node2.edges = [...node2.edges, node1]
}

export const createTetraAngles = (baseAngles: VectorAngles): VectorAngles[] => {
  return [
    baseAngles,
    ...[...Array(3)].map((_, i) =>
      sumVectorAngles(baseAngles, { theta: TETRAHEDRAL_DEGREE, phi: i * 120 })
    ),
  ]
}

