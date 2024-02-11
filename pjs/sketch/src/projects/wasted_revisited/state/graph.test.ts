import { init, reducers } from './graph'
import * as geo from '../primitives/edgeGeometry'
import p5 from 'p5'

describe(`graph tree`, () => {
  it(`can grow based on the previous tree node`, () => {
    const state = init()
    const node = state.graph[0]
    const spyEmitEdges = jest.spyOn(node, 'emitEdges')
    reducers.setGrowOptions(state)({numOfGrowEdges: 3, thetaDelta: 10, growAmount: 100})
    const grow = reducers.grow(state)
    grow()
    expect(spyEmitEdges).toHaveBeenCalledWith(3, 10, 100, expect.any(Function))
    expect(state.graph).toHaveLength(4)
    expect(node.hasGrown).toBe(true)

    grow()
    expect(state.graph).toHaveLength(4 + 3 * 3) 
  })
  it(`can calculate geometries for each edge from node`, () => {
    const state = init()
    reducers.setGrowOptions(state)({numOfGrowEdges: 3, thetaDelta: 10, growAmount: 100})
    reducers.grow(state)()
    expect(state.graph).toHaveLength(4)
    jest.spyOn(geo, 'createEdgeGeometry').mockImplementation((size) => size as unknown as p5.Geometry)
    reducers.calculateGeometries(state)()
    expect(state.geometries).toHaveLength(4) // for each node
    expect(state.geometries[0]).toHaveLength(3) // for each edge
    expect(state.geometries[1]).toBe(null) // doesn't have edges yet
  })
})
