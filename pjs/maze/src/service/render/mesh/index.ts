import { Mesh } from 'maze-gl'
import { GeometrySpecDict } from './geometry'
import { GeometryCode } from '../unit'
import { getMeshMaterial, MaterialType } from './material'
import { randomFloatBetween } from 'utils'
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

    // set initial state
    if (code === 'Octahedron') {
      mesh.state.scale = 0.3
    }
    if (code === 'Pole') {
      mesh.state.scale = 0.7
    }
    if (code === 'Tile') {
      mesh.state.scale = 0.9
    }

    meshMap.set(key, mesh)
  }

  const mesh = meshMap.get(key)!

  sideEffects(code, mesh)

  return mesh
}

const sideEffects = (code: GeometryCode, mesh: Mesh): void => {
  if (code === 'Octahedron') {
    mesh.state.scale = randomFloatBetween(0.2, 0.4)
    // mesh.state.incrementRotation(randomFloatBetween(0.2, 3.0))
  }
}
