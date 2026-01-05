import { MazeModel } from 'maze-gl'
import { getMaterial } from './material'
import { generateGeometry, ModelCode } from 'maze-models'
import { ModelEntity } from '../../../game/maze/physical/mapper/entity.ts'

type CompositeModelKey = `${ModelCode}_${number}`

const modelMap = new Map<CompositeModelKey, MazeModel>()

export const getModel = (model: ModelEntity): MazeModel => {
  const { code } = model

  const variant = 0 // TODO: implement variants in entity

  const key: CompositeModelKey = `${code}_${variant ?? 0}`

  if (!modelMap.has(key)) {
    const material = getMaterial()
    const geometry = generateGeometry(code, length)
    const mesh = new MazeModel(material, geometry)
    modelMap.set(key, mesh)
  }

  return modelMap.get(key)!
}
