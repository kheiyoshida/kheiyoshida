import { getGL } from '../../webgl'
import { DepthTexture, NormalTexture } from './texture'
import { FrameBuffer } from './frameBuffer'
import { Shader } from '../../models'

let frameBuffer: FrameBuffer | null = null

export const setupOffscreenFrameBuffer = () => {
  const gl = getGL()

  // frame buffer
  const depthTexture = new DepthTexture(gl, gl.canvas.width, gl.canvas.height)
  const normalTexture = new NormalTexture(gl, gl.canvas.width, gl.canvas.height)
  frameBuffer = new FrameBuffer(gl, normalTexture, depthTexture)
}

export const applyEdgeRenderingMode = (screenShader: Shader) => {
  if (!frameBuffer) throw Error(`frameBuffer is not initialized`)

  screenShader.use()

}
