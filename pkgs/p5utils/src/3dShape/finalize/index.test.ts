import { finalizeGeometry, pExtended } from ".";
import { createShapeNode } from "../tools";
import * as node from './node'

describe(`${finalizeGeometry.name}`, () => {
  it(`should create surfaces for the shape graph`, () => {
    const spyBeginGeometry = jest.spyOn((p as pExtended), 'beginGeometry').mockImplementation()
    const spyEndGeometry = jest.spyOn((p as pExtended), 'endGeometry').mockImplementation()
    const spyFinalizeNodeSurface = jest.spyOn(node, 'finalizeNodeSurfaces')
    const graph = [createShapeNode(), createShapeNode()]
    finalizeGeometry(graph)
    expect(spyFinalizeNodeSurface).toHaveBeenCalledTimes(2)
    expect(spyBeginGeometry).toHaveBeenCalled()
    expect(spyEndGeometry).toHaveBeenCalled()
  })
})