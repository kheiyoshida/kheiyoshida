import { ColorMaterial, Material } from 'maze-gl'
import { getShader } from './shaders'
import { getGL } from 'maze-gl/src/webgl'

export type MaterialType = 'default'

export const MaterialMap = new Map<MaterialType, Material>()

export const initMaterialMap = () => {
  MaterialMap.set(
    'default',
    new ColorMaterial(getShader('default'), {
      diffuse: [0.25,0.24,0.25],
      shininess: 0.5,
      specular: [0.05, 0.05, 0.05],
    })
  )
}

export const getMaterial = (type: MaterialType) => {
  if(!MaterialMap.has(type)) {
    throw Error(`material map was not initialized`)
  }
  return MaterialMap.get(type) as Material
}

export const updateRandomValues = () => {
  const shader = getShader('default')
  shader.use()
  shader.setFloat('uTime', performance.now())
  const gl = getGL()
  shader.setVec3('resolution', [gl.canvas.width, gl.canvas.height, 0])
}
