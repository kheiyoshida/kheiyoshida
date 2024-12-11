import { Texture } from '../texture'

// for texture specification,
// see OpenGL docs: https://registry.khronos.org/OpenGL-Refpages/es3.0/html/glTexImage2D.xhtml

// *important*
// note that internal format must meet with other textures when used together
// i.e. both normal and color texture should have RGBA or RGBA32 for internal format

export class ColorTexture extends Texture {
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
