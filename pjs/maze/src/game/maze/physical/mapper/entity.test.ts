import { ModelEntityEmitter } from './entity.ts'

describe(`${ModelEntityEmitter.name}`, () => {
  it(`emits model entity`, () => {
    const emitter = new ModelEntityEmitter({
      gravity: 0.5,
      order: 0.5,
      scale: 0.5,
      density: 0.5,
    })

    for (let i = 0; i < 10; i++) {
      const entity = emitter.emitNullable({ avoidModelType: 'stacked', maxLength: 3 })
      if (entity) {
        expect(entity.modelType).not.toBe('stacked')
        expect(entity.verticalLength).toBeLessThanOrEqual(3)
      }
    }

    const classes = []
    for (let i = 0; i < 100; i++) {
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
