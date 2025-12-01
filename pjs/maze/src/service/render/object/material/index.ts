import { getShader, MaterialShaderType, RenderingModeShaderTypeMap } from './shaders'
import { getGL } from 'maze-gl/src/webgl'
import { DefaultMaterial, DistinctMaterial, MeshMaterial } from './materials.ts'
import { randomFloatBetween } from 'utils'
import { Atmosphere } from '../../../../game/world'

export type MaterialType = 'default' | 'distinct'

export type CompositeMaterialKey = `${MaterialShaderType}:${MaterialType}`

export const MaterialMap = new Map<CompositeMaterialKey, MeshMaterial>()

export const initMaterialMap = () => {
  const shaderTypes: MaterialShaderType[] = ['litFog', 'unlitFog', 'edgeRendering']
  shaderTypes.forEach((shaderType: MaterialShaderType) => {
    MaterialMap.set(`${shaderType}:default`, new DefaultMaterial(shaderType))
    MaterialMap.set(`${shaderType}:distinct`, new DistinctMaterial(shaderType))
  })
}

export const getMeshMaterial = (type: MaterialType, mode: Atmosphere): MeshMaterial => {
  const shaderType: MaterialShaderType = RenderingModeShaderTypeMap[mode]
  const key: CompositeMaterialKey = `${shaderType}:${type}`
  if (!MaterialMap.has(key)) {
    throw Error(`material map was not initialized: ${key} is missing`)
  }
  return MaterialMap.get(key) as MeshMaterial
}

export const updateRandomValues = () => {
  const shader = getShader('litFog')
  shader.use()
  shader.setUniformFloat('uTime', randomFloatBetween(0.0, 1.0))
  const gl = getGL()
  shader.setUniformVec3('resolution', [gl.canvas.width, gl.canvas.height, 0])
}
