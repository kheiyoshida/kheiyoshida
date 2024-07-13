import { Geometry } from 'p5'
import { ObjectAlignmentValue } from '../../../../../domain/translate'
import { createOcta } from './geometries/octahedron'
import { createPole, createTile } from './geometries/pole'

export type CreateGeometry = (alignment: ObjectAlignmentValue, randomAdjustValue: number) => Geometry[]

export type GeometryCollection = ReturnType<typeof makeGeometryCollection>

type _Collection = Record<ObjectAlignmentValue, Geometry[]>

const makeGeometryCollection = (createGeometry: CreateGeometry) => {
  const random = Math.random()
  const collection = {} as _Collection
  return {
    getGeometries: (alignment: ObjectAlignmentValue) => {
      if (!collection[alignment]) {
        collection[alignment] = createGeometry(alignment, random)
      }
      return collection[alignment]
    }
  }
}

export const octaCollection = () => makeGeometryCollection(createOcta)

export const poleCollection = () => makeGeometryCollection(createPole)

export const tileCollection = () => makeGeometryCollection(createTile)
