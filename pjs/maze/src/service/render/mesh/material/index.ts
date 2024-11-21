import { ColorMaterial } from 'maze-gl'
import { defaultShader } from './shaders'

export const defaultMaterial = new ColorMaterial(defaultShader, {
  diffuse: [0.3, 0.3, 0.3],
  shininess: 0.5,
  specular: [0.01, 0.01, 0.01],
})
