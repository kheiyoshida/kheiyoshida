import { MazeModel } from 'maze-gl'
import { getMeshMaterial, MaterialType } from './material'
import { generateGeometry, ModelCode } from 'maze-models'
import { ModelId } from '../../../game/maze/physical/models.ts'
import { Atmosphere } from '../../../game/world/types.ts'

type CompositeMeshKey = `${Atmosphere}:${ModelCode}_${number}`

const meshMap = new Map<CompositeMeshKey, MazeModel>()

const materialSpecificationMap: Partial<Record<ModelCode, MaterialType>> = {
  Warp: 'distinct',
  StairTile: 'distinct',
}

export const getMesh = (model: ModelId, mode: Atmosphere): MazeModel => {
  const { code, variant, length } = model

  const key: CompositeMeshKey = `${mode}:${code}_${variant ?? 0}`

  if (!meshMap.has(key)) {
    const materialType = materialSpecificationMap[code] || 'default'
    const material = getMeshMaterial(materialType, mode)
    const geometry = generateGeometry(code, length)
    const mesh = new MazeModel(material, geometry)
    meshMap.set(key, mesh)
  }

  return meshMap.get(key)!
}
