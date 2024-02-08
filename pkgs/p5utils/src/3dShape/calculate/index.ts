import { ShapeCreateOptions, ShapeGraph } from '../types'
import { calculateVerticesAroundNode } from './vertices'

export const calculateVerticesForShapeGraph = (
  graph: ShapeGraph,
  options: ShapeCreateOptions
): void => {
  graph.forEach((node) => calculateVerticesAroundNode(node, options.distanceFromNode))
}
