import { ColorMaterial, Shader } from 'maze-gl'
import defaultVert from './shader/default.vert?raw'
import defaultFrag from './shader/default.frag?raw'

let defaultMaterial: ColorMaterial

export const getMaterial = (): ColorMaterial => {
  if (!defaultMaterial) {
    defaultMaterial = new ColorMaterial(new Shader(defaultVert, defaultFrag))
  }
  return defaultMaterial
}
