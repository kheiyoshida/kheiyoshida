import { MazeModel } from 'maze-gl'
import { getMaterial } from './material'
import { getGeometry, ModelEntity, GeometryId } from 'maze-models'

export enum MaterialId {
  Default = 0,
}

type CompositeModelKey = `${GeometryId}_${MaterialId}`

const modelMap = new Map<CompositeModelKey, MazeModel>()

export const getModel = (model: ModelEntity): MazeModel => {
  // just one material for now
  const materialId = MaterialId.Default

  const key: CompositeModelKey = `${model.id}_${materialId}`

  if (!modelMap.has(key)) {
    const material = getMaterial()
    const geometry = getGeometry(model)
    const mesh = new MazeModel(material, geometry)
    modelMap.set(key, mesh)
  }

  return modelMap.get(key)!
}
