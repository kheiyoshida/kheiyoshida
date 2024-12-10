import { Texture } from '../../models/texture'

export class DepthTexture extends Texture {
  constructor(
    gl: WebGL2RenderingContext,
    width: number = gl.canvas.width,
    height: number = gl.canvas.height
  ) {
    super(gl, width, height, gl.DEPTH_COMPONENT24, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, [
      [gl.TEXTURE_MIN_FILTER, gl.NEAREST],
      [gl.TEXTURE_MAG_FILTER, gl.NEAREST],
      [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE],
      [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE],
    ])
  }
}

export class NormalTexture extends Texture {
  constructor(
    gl: WebGL2RenderingContext,
    width: number = gl.canvas.width,
    height: number = gl.canvas.height
  ) {
    super(gl, width, height, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, [
      [gl.TEXTURE_MIN_FILTER, gl.NEAREST],
      [gl.TEXTURE_MAG_FILTER, gl.NEAREST],
    ])
  }
}
