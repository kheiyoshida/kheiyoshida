import { MaterialShader } from 'maze-gl'
import vert from './default.vert?raw'
import litFogFrag from './default.frag?raw'
import unlitFogFrag from './unlitFog.frag?raw'
import edgeRenderingFrag from './edgeRendering.frag?raw'
import { RenderingMode } from '../../../../../domain/entities/maze/stages'

export type MaterialShaderType = 'litFog' | 'unlitFog' | 'edgeRendering'

export const RenderingModeShaderTypeMap: Record<RenderingMode, MaterialShaderType> = {
  [RenderingMode.atmospheric]: 'litFog',
  [RenderingMode.smooth]: 'unlitFog',
  [RenderingMode.ambient]: 'unlitFog',
  [RenderingMode.digital]: 'edgeRendering',
  [RenderingMode.abstract]: 'edgeRendering',
}

export const ShaderMap = new Map<MaterialShaderType, MaterialShader>()

export const initShaders = () => {
  ShaderMap.set('litFog', new MaterialShader(vert, litFogFrag))
  ShaderMap.set('unlitFog', new MaterialShader(vert, unlitFogFrag))
  ShaderMap.set('edgeRendering', new MaterialShader(vert, edgeRenderingFrag))
}

export const getShader = (type: MaterialShaderType) => {
  if (!ShaderMap.has(type)) {
    throw Error(`shader map was not initialized`)
  }
  return ShaderMap.get(type) as MaterialShader
}
