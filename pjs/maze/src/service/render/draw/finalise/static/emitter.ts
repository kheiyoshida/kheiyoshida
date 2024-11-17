import { averagePosition3ds } from 'p5utils/src/3d'
import { randomIntInclusiveBetween } from 'utils'
import { ObjectAlignmentValue } from '../../../../../domain/translate'
import { getBlockCenter, RenderBlockCoords } from '../../../scaffold'
import { makeRotate } from '../geometry/rotate'
import { DrawableObject } from '../types'
import { GeometryCollection } from './collection'

export type EmitterMaker = (collection: GeometryCollection) => DrawableObjectEmitter
export type DrawableObjectEmitter = (
  blockcoords: RenderBlockCoords,
  alignment: ObjectAlignmentValue
) => DrawableObject[]

export const makeSimpleEmitter: EmitterMaker = (collection) => {
  const placement = (block: RenderBlockCoords) =>
    averagePosition3ds([block.front.bl, block.front.br, block.rear.bl, block.rear.br])
  return (blockcoords, alignment) => {
    const geometries = collection.getGeometries(alignment)
    const position = placement(blockcoords)
    return geometries.map((geometry) => ({
      geometry,
      position,
    }))
  }
}

export const makeOctaEmitter: EmitterMaker = (collection) => {
  const rotate = makeRotate(0, 360)
  return (blockcoords, alignment) => {
    const geometries = collection.getGeometries(alignment)
    rotate.increment(randomIntInclusiveBetween(0, 10))
    return geometries.map((geometry) => ({
      geometry,
      position: getBlockCenter(blockcoords),
      rotation: {
        theta: rotate.current,
        phi: 0,
      },
    }))
  }
}
