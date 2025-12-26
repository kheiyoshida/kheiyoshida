import { getGL } from './gl'
import { ImageResolution } from '../graph'

export type TextureParams = {
  yFlip?: boolean
  repeat?: boolean
  unit?: TextureUnit
  size?: ImageResolution
  internalFormat?: number
  format?: number
  type?: number
  filter?: number
}

export enum TextureUnit {
  Color = 0,
  Normal = 1,
  Depth = 2,
}

// TODO: make this abstract and use specific type of texture
export class Texture {
  public readonly tex: WebGLTexture

  public yFlip: boolean = false

  constructor({ yFlip, repeat, unit, size, internalFormat, format, type, filter }: TextureParams = {}) {
    const gl = getGL()
    this.tex = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, this.tex)

    if (size && internalFormat && format && type) {
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, size.width, size.height, 0, format, type, null)
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter ?? gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter ?? gl.LINEAR)

    const wrap = repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    this.unit = unit ?? TextureUnit.Color
    this.yFlip = yFlip ?? false
  }

  /**
   * use this unit to set texture uniform
   * ```ts
   * const uTexture = gl.getUniformLocation(this.program, 'uTexture')
   * gl.uniform1i(uTexture, texture.unit)
   * ```
   */
  readonly unit: number

  get gl() {
    return getGL()
  }

  public setTextureImage(source: TexImageSource) {
    this.gl.activeTexture(this.gl.TEXTURE0 + this.unit)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex)

    if (this.yFlip) {
      this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true)
    }

    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, source)
  }
}

export class ImageTexture extends Texture {
  constructor(params: Omit<TextureParams, 'type' | 'size' | 'format' | 'internalFormat' | 'unit'>) {
    const gl = getGL()
    super({
      ...params,
      type: gl.UNSIGNED_BYTE,
      format: gl.RGBA,
      internalFormat: gl.RGBA,
      unit: TextureUnit.Color,
    })
  }
}

export type FrameBufferTextureParams = Omit<TextureParams, 'unit'> & Required<Pick<TextureParams, 'size'>>

export class FrameBufferTexture extends Texture {
  constructor(
    params: TextureParams & Required<Pick<TextureParams, 'size' | 'type' | 'internalFormat' | 'format'>>
  ) {
    super(params)
  }
}

export class FrameBufferColorTexture extends FrameBufferTexture {
  constructor(params: FrameBufferTextureParams) {
    const gl = getGL()
    super({
      ...params,
      unit: TextureUnit.Color,
      internalFormat: params.internalFormat ?? gl.RGBA,
      format: params.format ?? gl.RGBA,
      type: params.type ?? gl.UNSIGNED_BYTE,
    })
  }
}

export class FrameBufferNormalTexture extends FrameBufferTexture {
  constructor(params: FrameBufferTextureParams) {
    const gl = getGL()
    super({
      ...params,
      unit: TextureUnit.Normal,
      internalFormat: params.internalFormat ?? gl.RGBA,
      format: params.format ?? gl.RGBA,
      type: params.type ?? gl.UNSIGNED_BYTE,
    })
  }
}

export class FrameBufferDepthTexture extends FrameBufferTexture {
  constructor(params: FrameBufferTextureParams) {
    const gl = getGL()
    super({
      ...params,
      unit: TextureUnit.Depth,
      internalFormat: params.internalFormat ?? gl.DEPTH_COMPONENT24,
      format: params.format ?? gl.DEPTH_COMPONENT,
      type: params.type ?? gl.UNSIGNED_INT,
      filter: gl.NEAREST,
    })
  }
}
