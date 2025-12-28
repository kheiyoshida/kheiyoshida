import { ColorMaterial, MaterialShader } from 'maze-gl'
import defaultVert from './shader/default.vert?raw'
import defaultFrag from './shader/default.frag?raw'

let defaultMaterial: ColorMaterial

export const getMaterial = (): ColorMaterial => {
  if (!defaultMaterial) {
    defaultMaterial = new ColorMaterial(new MaterialShader(defaultVert, defaultFrag))
  }
  return defaultMaterial
}
