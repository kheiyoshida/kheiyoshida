import { ColorMaterial, Material } from 'maze-gl'
import { getShader } from './shaders'
import { getGL } from 'maze-gl/src/webgl'
import { DefaultMaterial, DistinctMaterial } from './materials.ts'

export type MaterialType = 'default' | 'octahedron'

export const MaterialMap = new Map<MaterialType, Material>()

export const initMaterialMap = () => {
  MaterialMap.set('default', new DefaultMaterial())
  MaterialMap.set('octahedron', new DistinctMaterial())
}

export const getColorMaterial = (type: MaterialType): ColorMaterial => {
  if (!MaterialMap.has(type)) {
    throw Error(`material map was not initialized`)
  }
  return MaterialMap.get(type) as ColorMaterial
}

export const updateRandomValues = () => {
  const shader = getShader('default')
  shader.use()
  shader.setFloat('uTime', performance.now())
  const gl = getGL()
  shader.setVec3('resolution', [gl.canvas.width, gl.canvas.height, 0])
}
