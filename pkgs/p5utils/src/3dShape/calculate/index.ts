import { ShapeCreateOptions, ShapeGraph } from '../types'
import { calcVerticesAroundNode } from './vertices'

export const calculateVerticesForShapeGraph = (
  graph: ShapeGraph,
  options: ShapeCreateOptions
): void => {
  graph.forEach((node) => calcVerticesAroundNode(node, options.distanceFromNode))
}
