import { calculateVerticesForShapeGraph } from '.'
import { createShapeNode } from '../tools'
import * as vertices from './vertices'

describe(`${calculateVerticesForShapeGraph.name}`, () => {
  it(`should calculate vertices for all the nodes in the graph`, () => {
    const calcNode = jest.spyOn(vertices, 'calculateVerticesAroundNode')
    const node = createShapeNode()
    const graph = [node]
    const createOptions = { distanceFromNode: 10 }
    calculateVerticesForShapeGraph(graph, createOptions)
    expect(calcNode).toHaveBeenCalledWith(node, createOptions.distanceFromNode)
  })
})
