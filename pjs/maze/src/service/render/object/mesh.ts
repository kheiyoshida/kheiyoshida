import { Mesh } from 'maze-gl'
import { GeometrySpecDict } from './geometry'
import { getMeshMaterial, MaterialType } from './material'
import { RenderingMode } from '../../../game/stage'
import { ModelCode } from '../../../game/maze/physical/models.ts'

type CompositeMeshKey = `${RenderingMode}:${ModelCode}`

const meshMap = new Map<CompositeMeshKey, Mesh>()

const materialSpecificationMap: Partial<Record<ModelCode, MaterialType>> = {
  Octahedron: 'distinct',
  StairTile: 'distinct',
}

export const getMesh = (code: ModelCode, mode: RenderingMode): Mesh => {
  const key: CompositeMeshKey = `${mode}:${code}`

  if (!meshMap.has(key)) {
    const materialType = materialSpecificationMap[code] || 'default'
    const material = getMeshMaterial(materialType, mode)
    const mesh = new Mesh(material, GeometrySpecDict[code])
    meshMap.set(key, mesh)
  }

  return meshMap.get(key)!
}
