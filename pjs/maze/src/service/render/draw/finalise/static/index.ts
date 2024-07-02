import { Geometry } from 'p5'
import { averagePosition3ds } from 'p5utils/src/3d'
import { StaticModel, StaticModelCode } from '../../model'
import { RenderBlockCoords, Scaffold, getRenderBlock } from '../../scaffold'
import { DrawableObject } from '../types'
import { makeOctaEmitter } from './octahedron'
import { createPole, createTile } from './pole'
import { clamp } from 'utils'

export type StaticModelEmitter = (blockcoords: RenderBlockCoords) => DrawableObject[]

export const makeSimpleEmitter = (
  createGeometry: (w?: number, h?: number) => Geometry[],
  w?: number,
  h?: number
): StaticModelEmitter => {
  const geometries = createGeometry(w, h)
  const placement = (block: RenderBlockCoords) =>
    averagePosition3ds([block.front.bl, block.front.br, block.rear.bl, block.rear.br])
  return (blockcoords) =>
    geometries.map((geometry) => ({
      geometry,
      position: placement(blockcoords),
    }))
}

type ModelEmitters = Record<StaticModelCode, StaticModelEmitter>

export const staticObjectEmitterPool = (() => {
  let modelEmitters: ModelEmitters = {} as ModelEmitters
  let level = 1
  const initMap: Record<StaticModelCode, () => StaticModelEmitter> = {
    [StaticModelCode.Pole]: () => makeSimpleEmitter(createPole),
    [StaticModelCode.Tile]: () => makeSimpleEmitter(createTile),
    [StaticModelCode.Octahedron]: () => makeOctaEmitter(level),
  }
  const lazyInit = (code: StaticModelCode) => {
    modelEmitters[code] = initMap[code]()
  }
  return {
    get: (code: StaticModelCode) => {
      if (!modelEmitters[code]) {
        lazyInit(code)
      }
      return modelEmitters[code]
    },
    updateLevel: (levelDelta: number) => {
      level = clamp(level + levelDelta, 0.5, 1.5)
    },
    recalculate: () => {
      Object.keys(modelEmitters).forEach((code) => {
        lazyInit(code as StaticModelCode)
      })
    },
    reset: () => {
      modelEmitters = {} as typeof modelEmitters
    },
  }
})()

export const convertStaticModelsToDrawables = (
  model: StaticModel,
  scaffold: Scaffold
): DrawableObject[] => {
  const emitter = staticObjectEmitterPool.get(model.code)
  const block = getRenderBlock(scaffold, model.position)
  return emitter(block)
}
