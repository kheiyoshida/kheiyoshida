import { ShapeGraph, ShapeNode } from '../types'
import { calcNewVertices } from './calculate'
import { collectEdgesVertices } from './collect'

export const calculateVerticesForShapeGraph = (graph: ShapeGraph): void => {
  graph.forEach(calcVerticesAroundNode)
}

export const calcVerticesAroundNode = (node: ShapeNode): void => {
  if (node.vertices.length) return
  const edgesVertices = collectEdgesVertices(node)
  const newVertices = calcNewVertices(node, edgesVertices)
  node.vertices = [...edgesVertices, ...newVertices]
}
