import { ColorMaterial } from 'maze-gl'
import { defaultShader } from './shaders'

export const defaultMaterial = new ColorMaterial(defaultShader, {
  diffuse: [1, 0, 0],
  shininess: 1,
  specular: [1, 0, 0],
})

