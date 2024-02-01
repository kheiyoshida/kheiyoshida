import { init, reducers } from './graph'

describe(`graph tree`, () => {
  it(`can initiate a tree from the bottom`, () => {
    const initial = init()
    expect(initial.graph).toHaveLength(1)
    expect(initial.graph[0].position).toMatchObject([0, -1000, 0])
  })
  it(`can grow based on the previous tree node`, () => {
    const state = init()
    const node = state.graph[0]
    const spyEmitEdges = jest.spyOn(node, 'emitEdges')
    const grow = reducers.grow(state)
    grow(3, 10, 100)
    expect(spyEmitEdges).toHaveBeenCalledWith(3, 10, 100)
    expect(state.graph).toHaveLength(4)
    expect(node.hasGrown).toBe(true)

    grow(3, 10, 100)
    expect(state.graph).toHaveLength(4 + 3 * 3)
  })
})
