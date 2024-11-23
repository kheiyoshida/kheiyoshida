import { Shader } from 'maze-gl'

// swap import statement when deploying
import vert from './default.vert?raw'
import frag from './default.frag?raw'
// import vert from './default.vert'
// import frag from './default.frag'

export type ShaderType = 'default'

export const ShaderMap = new Map<ShaderType, Shader>()

export const initShaders = () => {
  ShaderMap.set('default', new Shader(vert, frag))
}

export const getShader = (type: ShaderType) => {
  if (!ShaderMap.has(type)) {
    throw Error(`shader map was not initialized`)
  }
  return ShaderMap.get(type) as Shader
}
