import { ColorMaterial, Material } from 'maze-gl'
import { getShader } from './shaders'

export type MaterialType = 'default'

export const MaterialMap = new Map<MaterialType, Material>()

export const initMaterialMap = () => {
  MaterialMap.set(
    'default',
    new ColorMaterial(getShader('default'), {
      diffuse: [0.3, 0.3, 0.3],
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
