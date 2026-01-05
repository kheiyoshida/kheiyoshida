import { GeometrySpec } from '../pipeline/types'
import { generateGeometry } from './generate'
import { ModelEntity, GeometryId } from './entity'

export type { ModelCode } from './code'
export * from './entity'

const geometryCache = new Map<GeometryId, GeometrySpec>()

export const getGeometry = (modelEntity: ModelEntity): GeometrySpec => {
  const modelCode = modelEntity.code

  const id = modelEntity.id
  if (!geometryCache.has(id)) {
    geometryCache.set(id, generateGeometry(modelCode))
  }

  return geometryCache.get(id)!
}
