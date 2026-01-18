import { DirectedValue, IWorldState, RandomValue, WorldState } from './state.ts'
import { Structure } from './types.ts'
import { describe } from 'node:test'

describe(`${WorldState.name}`, () => {
  it(`provides structure for the state`, () => {
    expect(new WorldState({ order: 0.82, gravity: 0.5 }).structure).toBe('classic')
    expect(new WorldState({ order: 0.55, gravity: 0.23 }).structure).toBe('floatingBoxes' as Structure)
    expect(new WorldState({ order: 0.55, gravity: 0.83 }).structure).toBe('stackedBoxes' as Structure)
    expect(new WorldState({ order: 0.33, gravity: 0.23 }).structure).toBe('tiles' as Structure)
    expect(new WorldState({ order: 0.33, gravity: 0.88 }).structure).toBe('poles' as Structure)
  })

  it(`can update state until it gets different world structure`, () => {
    const state = new WorldState()

    state.update(0.1, 'classic')

    expect(state.structure).not.toBe('classic')
  })

  it(`provides ambience conversion`, () => {
    expect(new WorldState({ gravity: 0 }).ambience).toBe(9)
    expect(new WorldState({ gravity: 1 }).ambience).toBe(1)
  })

  it(`updates state over time`, () => {
    const state = new WorldState()
    const snapshots: IWorldState[] = []
    for (let i = 0; i < 30; i++) {
      state.update(0.1)
      snapshots.push(state.getSnapShot())
    }

    console.log(
      'density gravity order scale\n======================\n' +
      snapshots
        .map(
          (s, i) =>
            `${i + 1}: ${s.density.toFixed(2)}, ${s.gravity.toFixed(2)}, ${s.order.toFixed(
              2
            )}, ${s.scale.toFixed(2)}`
        )
        .join('\n')
    )
  })
})

describe(`sate values`, () => {
  test(`${DirectedValue.name} should update values but retain sign until it hits the end`, () => {
    const state = new DirectedValue(0.5, false)

    let previousValue = 0.5
    let expectIncrease = false
    for (let i = 0; i < 100; i++) {
      const value = state.update(0.1)
      if (expectIncrease) {
        expect(value).toBeGreaterThanOrEqual(previousValue)
      } else {
        expect(value).toBeLessThanOrEqual(previousValue)
      }
      if (value === 1 || value === 0) expectIncrease = !expectIncrease

      previousValue = value
    }
  })

  test(`${RandomValue.name} should update values randomly`, () => {
    const state = new RandomValue(0.5)
    let prev = 0.5
    for (let i = 0; i < 100; i++) {
      state.update(0.1)
      expect(state.value).not.toBe(prev)
      expect(Math.abs(state.value - prev)).toBeLessThanOrEqual(0.1)
      prev = state.value
    }
  })
})
