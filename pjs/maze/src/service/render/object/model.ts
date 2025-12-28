import { MazeModel } from 'maze-gl'
import { getMaterial } from './material'
import { generateGeometry, ModelCode } from 'maze-models'
import { ModelId } from '../../../game/maze/physical/models.ts'

type CompositeModelKey = `${ModelCode}_${number}`

const modelMap = new Map<CompositeModelKey, MazeModel>()

export const getModel = (model: ModelId): MazeModel => {
  const { code, variant, length } = model

  const key: CompositeModelKey = `${code}_${variant ?? 0}`

  if (!modelMap.has(key)) {
    const material = getMaterial()
    const geometry = generateGeometry(code, length)
    const mesh = new MazeModel(material, geometry)
    modelMap.set(key, mesh)
  }

  return modelMap.get(key)!
}
