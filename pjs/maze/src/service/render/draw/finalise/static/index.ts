import { Geometry } from 'p5'
import { averagePosition3ds } from 'p5utils/src/3d'
import { StaticModel, StaticModelCode } from '../../model'
import { Scaffold, getRenderBlock } from '../../scaffold'
import { DrawableObject } from '../types'
import { createPole, createTile } from './pole'

const geometrieCollection = (() => {
  let geometries: Record<StaticModelCode, Geometry[]>
  const init = () => {
    geometries = {
      [StaticModelCode.Pole]: createPole(),
      [StaticModelCode.Tile]: createTile()
    }
  }
  return {
    get: (code: StaticModelCode) => {
      if (!geometries) {
        init()
      }
      return geometries[code]
    },
  }
})()

export const convertStaticModelsToDrawables = (
  model: StaticModel,
  scaffold: Scaffold
): DrawableObject[] => {
  const geometries = geometrieCollection.get(model.code)
  const block = getRenderBlock(scaffold, model.position)
  return geometries.map((geo) => ({
    geometry: geo,
    position: averagePosition3ds([block.front.bl, block.front.br, block.rear.bl, block.rear.br]),
  }))
}
