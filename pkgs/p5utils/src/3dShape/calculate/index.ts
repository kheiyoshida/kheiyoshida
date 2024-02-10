import { ShapeGraph, ShapeNode } from '../types'
import { collectEdgesVertices } from './collect'
import { calcNewVertices } from './calculate'

export const calculateVerticesForShapeGraph = (graph: ShapeGraph): void => {
  graph.forEach(calcVerticesAroundNode)
}

export const calcVerticesAroundNode = (node: ShapeNode): void => {
  const edgesVertices = collectEdgesVertices(node)
  const newVertices = calcNewVertices(node, edgesVertices)
  node.vertices = [...edgesVertices, ...newVertices]
}
