import { Mesh } from 'maze-gl'
import { GeometrySpecDict } from './geometry'
import { GeometryCode } from '../../../integration/query/structure/unit'
import { getMeshMaterial, MaterialType } from './material'
import { RenderingMode } from '../../../game/stage'

type CompositeMeshKey = `${RenderingMode}:${GeometryCode}`

const meshMap = new Map<CompositeMeshKey, Mesh>()

const materialSpecificationMap: Partial<Record<GeometryCode, MaterialType>> = {
  Octahedron: 'distinct',
  StairTile: 'distinct',
}

export const getMesh = (code: GeometryCode, mode: RenderingMode): Mesh => {
  const key: CompositeMeshKey = `${mode}:${code}`

  if (!meshMap.has(key)) {
    const materialType = materialSpecificationMap[code] || 'default'
    const material = getMeshMaterial(materialType, mode)
    const mesh = new Mesh(material, GeometrySpecDict[code])
    meshMap.set(key, mesh)
  }

  return meshMap.get(key)!
}
