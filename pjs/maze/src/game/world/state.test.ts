import { WorldState } from './state.ts'
import { Structure } from './types.ts'

describe(`${WorldState.name}`, () => {
  it(`changes values within normalised range`, () => {
    const worldState = new WorldState()

    for (let i = 0; i < 100; i++) {
      const density = Number(worldState.density)
      const gravity = Number(worldState.gravity)
      worldState.update(0.1)

      expect(worldState.density).toBeGreaterThanOrEqual(0)
      expect(worldState.density).toBeLessThanOrEqual(1)
      expect(worldState.gravity).toBeGreaterThanOrEqual(0)
      expect(worldState.gravity).toBeLessThanOrEqual(1)

      expect(Math.abs(worldState.density - density)).toBeLessThanOrEqual(0.1)
      expect(Math.abs(worldState.gravity - gravity)).toBeLessThanOrEqual(0.1)
    }
  })

  it(`provides structure for the state`, () => {
    expect(new WorldState(0.82, 0.5).structure).toBe('classic')
    expect(new WorldState(0.55, 0.23).structure).toBe('floatingBoxes' as Structure)
    expect(new WorldState(0.55, 0.83).structure).toBe('stackedBoxes' as Structure)
    expect(new WorldState(0.33, 0.23).structure).toBe('tiles' as Structure)
    expect(new WorldState(0.33, 0.88).structure).toBe('poles' as Structure)
  })

  it(`can update state until it gets different world structure`, () => {
    const state = new WorldState()

    state.update(0.1, 'classic')

    expect(state.structure).not.toBe('classic')
  })

  it(`provides ambience conversion`, () => {
    expect(new WorldState(1, 0).ambience).toBe(9)
    expect(new WorldState(1, 1).ambience).toBe(1)
  })
})
