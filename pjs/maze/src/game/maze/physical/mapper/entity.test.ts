import { ModelEntityEmitter, modelTypeMap } from './entity.ts'

describe(`${ModelEntityEmitter.name}`, () => {
  it(`emits model entity`, () => {
    const emitter = new ModelEntityEmitter(0.5, 0.5)
    const entity = emitter.emit('stacked', 3)

    if (entity) {
      expect(modelTypeMap[entity!.modelClass]).not.toBe('stacked')
      expect(entity.verticalLength).toBeLessThanOrEqual(3)
      console.log(entity.getModelCode('normal'))
    }
  })
})
