import { Mesh } from 'maze-gl'
import { getMeshMaterial, MaterialType } from './material'
import { RenderingMode } from '../../../game/stage'
import { generateGeometry, ModelCode } from 'maze-models'
import { ModelId } from '../../../game/maze/physical/models.ts'

type CompositeMeshKey = `${RenderingMode}:${ModelCode}_${number}`

const meshMap = new Map<CompositeMeshKey, Mesh>()

const materialSpecificationMap: Partial<Record<ModelCode, MaterialType>> = {
  Octahedron: 'distinct',
  StairTile: 'distinct',
}

export const getMesh = (model: ModelId, mode: RenderingMode): Mesh => {
  const {code, variant} = model

  const key: CompositeMeshKey = `${mode}:${code}_${variant ?? 0}`

  if (!meshMap.has(key)) {
    const materialType = materialSpecificationMap[code] || 'default'
    const material = getMeshMaterial(materialType, mode)
    const geometry = generateGeometry(code)
    const mesh = new Mesh(material, geometry)
    meshMap.set(key, mesh)
  }

  return meshMap.get(key)!
}
