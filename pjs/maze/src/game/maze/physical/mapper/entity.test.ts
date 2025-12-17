import { ModelEntityEmitter, modelTypeMap } from './entity.ts'

describe(`${ModelEntityEmitter.name}`, () => {
  it(`emits model entity`, () => {
    const emitter = new ModelEntityEmitter(0.5, 0.5)

    for (let i = 0; i < 10; i++) {
      const entity = emitter.emitNullable('stacked', 3)
      if (entity) {
        expect(modelTypeMap[entity!.modelClass]).not.toBe('stacked')
        expect(entity.verticalLength).toBeLessThanOrEqual(3)
      }
    }

    const classes = []
    for (let i = 0; i < 10; i++) {
      const entity2 = emitter.emitNullable()
      if (entity2) {
        classes.push(entity2!.modelClass)
      }
    }
    expect(classes.includes('stackedBox')).toBe(true)
    expect(classes.includes('floatingBox')).toBe(true)


    for (let i = 0; i < 10; i++) {
      const entity3 = emitter.emitEnsured()
      expect(entity3).not.toBeNull()
    }
  })
})
