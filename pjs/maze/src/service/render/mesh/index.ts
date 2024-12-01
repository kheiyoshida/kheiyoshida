import { Mesh } from 'maze-gl'
import { GeometrySpecDict } from './geometry'
import { GeometryCode } from '../unit'
import { getColorMaterial } from './material'
import { randomFloatBetween } from 'utils'

const meshMap = new Map<GeometryCode, Mesh>()

export const getMesh = (code: GeometryCode): Mesh => {
  if (!meshMap.has(code)) {
    const material = code === GeometryCode.Octahedron ? getColorMaterial('octahedron') : getColorMaterial('default')
    const mesh = new Mesh(material, GeometrySpecDict[code])

    // set initial state
    if (code === GeometryCode.Octahedron) {
      mesh.state.scale = 0.3
    }
    if (code === GeometryCode.Pole) {
      mesh.state.scale = 0.7
    }
    if (code === GeometryCode.Tile) {
      mesh.state.scale = 0.9
    }

    meshMap.set(code, mesh)
  }

  const mesh = meshMap.get(code)!

  sideEffects(code, mesh)

  return mesh
}

const sideEffects = (code: GeometryCode, mesh: Mesh): void => {
  if (code === GeometryCode.Octahedron) {
    mesh.state.scale = randomFloatBetween(0.2, 0.4)
    // mesh.state.incrementRotation(randomFloatBetween(0.2, 3.0))
  }
}
