import { Material, Mesh } from '../models'
import { DrawRef, loadGeometry } from './geometry'

export type MeshRef = {
  material: Material
  drawRef: DrawRef
}

export const loadMesh = ({material, geometry}: Mesh):MeshRef  => {
  const drawRef = loadGeometry(geometry)
  return {
    material,
    drawRef,
  }
}
