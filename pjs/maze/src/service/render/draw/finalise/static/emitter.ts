import { averagePosition3ds } from 'p5utils/src/3d'
import { ObjectAlignmentValue } from '../../../../../domain/translate'
import { getBlockCenter, RenderBlockCoords } from '../../scaffold'
import { DrawableObject } from '../types'
import { GeometryCollection } from './collection'
import { ObjectSkinFactory } from '../geometry/texture'

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
  return (blockcoords, alignment) => {
    const geometries = collection.getGeometries(alignment)
    return geometries.map((geometry) => ({
      geometry,
      position: getBlockCenter(blockcoords),
      texture: ObjectSkinFactory.getSkin(),
    }))
  }
}
