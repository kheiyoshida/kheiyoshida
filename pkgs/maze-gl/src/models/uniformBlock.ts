import { getGL } from '../webgl'

const NUM_OF_BP = 2

export enum BindingPoint {
  DeformedBox,
  Eye,
}

/**
 * key: the shared uniform block name in shaders
 * value: binding point index
 */
export const UniformNameBPMap: Record<string, BindingPoint> = {
  DeformedBox: BindingPoint.DeformedBox,
  Eye: BindingPoint.Eye,
}

/**
 * prepare UBOs we need w/ fixed binding points
 */
const initUBOMap = () => {
  const gl = getGL()

  const uboMap = new Map<BindingPoint, WebGLBuffer>()
  for (let bp = 0; bp < NUM_OF_BP; bp++) {
    const ubo = gl.createBuffer()
    if (!ubo) throw Error(`ubo is null`)
    gl.bindBufferBase(gl.UNIFORM_BUFFER, bp, ubo)
    uboMap.set(bp, ubo)
  }

  return uboMap
}

export const setUBOValue = (() => {
  const uboMap = initUBOMap()
  const gl = getGL()

  return (bp: BindingPoint, data: Float32Array) => {
    const ubo = uboMap.get(bp)
    if (!ubo) throw Error(`ubo is null`)
    gl.bindBuffer(gl.UNIFORM_BUFFER, ubo)
    gl.bufferData(gl.UNIFORM_BUFFER, data, gl.STATIC_DRAW);
  }
})()
