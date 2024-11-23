import { Mesh } from 'maze-gl'
import { GeometrySpecDict } from './geometry'
import { GeometryCode } from '../unit'
import { getMaterial } from './material'

const meshMap = new Map()

export const getMesh = (code: GeometryCode) => {
  if (!meshMap.has(code)) {
    meshMap.set(code, new Mesh(getMaterial('default'), GeometrySpecDict[code]))
  }
  return meshMap.get(code)
}
