import { MaterialShader } from 'maze-gl'
import vert from './default.vert?raw'
import frag from './default.frag?raw'

export type ShaderType = 'default'

export const ShaderMap = new Map<ShaderType, MaterialShader>()

export const initShaders = () => {
  ShaderMap.set('default', new MaterialShader(vert, frag))
}

export const getShader = (type: ShaderType) => {
  if (!ShaderMap.has(type)) {
    throw Error(`shader map was not initialized`)
  }
  return ShaderMap.get(type) as MaterialShader
}
