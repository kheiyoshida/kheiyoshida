import { calcVerticesAroundNode, calculateVerticesForShapeGraph } from '.'
import { createShapeNode } from '../tools'

test(`${calculateVerticesForShapeGraph.name}`, () => {
  const graph = [createShapeNode(), createShapeNode()]
  calculateVerticesForShapeGraph(graph)
  graph.forEach((node) => {
    expect(node.vertices).toHaveLength(4)
  })
})

test(`${calcVerticesAroundNode.name}`, () => {
  const node = createShapeNode()
  calcVerticesAroundNode(node)
  expect(node.vertices).toHaveLength(4)
})
