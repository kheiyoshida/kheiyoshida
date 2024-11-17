import { ObjectAlignmentValue } from '../../../../../domain/translate'
import { StaticModel, StaticModelCode } from '../../../unit'
import { Scaffold, getRenderBlock } from '../../../scaffold'
import { DrawableObject } from '../types'
import { octaCollection, poleCollection, tileCollection } from './collection'
import { DrawableObjectEmitter, makeOctaEmitter, makeSimpleEmitter } from './emitter'

type DrawableEmitters = Record<StaticModelCode, DrawableObjectEmitter>

export const staticObjectEmitterPool = (() => {
  const init = (): DrawableEmitters => ({
    [StaticModelCode.Pole]: makeSimpleEmitter(poleCollection()),
    [StaticModelCode.Tile]: makeSimpleEmitter(tileCollection()),
    [StaticModelCode.Octahedron]: makeOctaEmitter(octaCollection()),
  })
  let emitters: DrawableEmitters = init()
  return {
    get: (code: StaticModelCode) => emitters[code],
    reset: () => {
      emitters = init()
    },
  }
})()

export const convertStaticModelsToDrawables = (
  model: StaticModel,
  scaffold: Scaffold,
  alignment: ObjectAlignmentValue
): DrawableObject[] => {
  const emitter = staticObjectEmitterPool.get(model.code)
  const block = getRenderBlock(scaffold, model.position)
  return emitter(block, alignment)
}
