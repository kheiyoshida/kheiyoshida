import { getModelWeight, ModelClassEmitter, RandomRatioPicker } from './class'

describe(`${getModelWeight.name}`, () => {
  test(`density and gravity should affect the ratio of model classes`, () => {
    const r1 = getModelWeight(1, 0.5)
    expect(r1.floatingBox).toBe(r1.stackedBox)
    expect(r1.pole).toBe(0)
    expect(r1.tile).toBe(0)

    const r2 = getModelWeight(0.8, 0.5)
    expect(r2.pole).toBe(0)
    expect(r2.tile).toBe(0)

    const r3 = getModelWeight(0.4, 0.5)
    expect(r3.pole).toBeGreaterThan(0)
    expect(r3.tile).toBeGreaterThan(0)

    const r4 = getModelWeight(0.4, 0.8)
    expect(r4.pole).toBeGreaterThan(r4.tile)
    expect(r4.tile).toBeGreaterThan(0)
  })
})

describe(`${ModelClassEmitter.name}`, () => {
  test(`emit random model classes based on weight`, () => {
    const emitter = new ModelClassEmitter({
      floatingBox: 0.5,
      stackedBox: 0.5,
      pole: 0,
      tile: 0,
    })

    // console.log((emitter as any).thresholds!)
    for (let i = 0; i < 100; i++) {
      expect(emitter.emitModelClass()).not.toBe('pole')
      expect(emitter.emitModelClass()).not.toBe('tile')
    }
  })

  it(`can avoid specified classes`, () => {
    const emitter = new ModelClassEmitter({
      floatingBox: 0.3,
      stackedBox: 0.3,
      pole: 0.2,
      tile: 0.2,
    })

    // console.log((emitter as any).thresholds!)
    for (let i = 0; i < 100; i++) {
      const modelClass = emitter.emitModelClass('stacked')
      expect(modelClass).not.toBe('stackedBox')
      expect(modelClass).not.toBe('pole')
    }
  })

  it(`can ensure a concrete class to be emitted`, () => {
    const emitter = new ModelClassEmitter({
      floatingBox: 0.3,
      stackedBox: 0.3,
      pole: 0.2,
      tile: 0.2,
    })

    for (let i = 0; i < 100; i++) {
      const modelClass = emitter.emitModelClassEnsured('stacked')
      expect(modelClass).not.toBe('stackedBox')
      expect(modelClass).not.toBe('pole')
      expect(modelClass).not.toBeNull()
    }

    for (let i = 0; i < 100; i++) {
      const modelClass = emitter.emitModelClassEnsured('floating')
      expect(modelClass).not.toBe('floatingBox')
      expect(modelClass).not.toBe('tile')
      expect(modelClass).not.toBeNull()
    }
  })
})

describe(`${RandomRatioPicker.name}`, () => {
  it(`can pick a value randomly by given ratio`, () => {
    const picker = new RandomRatioPicker({
      a: 0.2,
      b: 0.2,
      c: 0,
      d: 0.8,
    })

    const result = {a: 0, b: 0, c: 0, d: 0}
    for(let i = 0; i < 100; i++) {
      result[picker.pickValue()] += 1
    }

    expect(result.d).toBeGreaterThan(result.a)
    expect(result.d).toBeGreaterThan(result.b)
    expect(result.c).toBe(0)
  })
})
