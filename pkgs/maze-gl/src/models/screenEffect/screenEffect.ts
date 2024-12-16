import { Shader } from '../index'
import { getGL } from '../../webgl'
import { ColorTexture, DepthTexture, NormalTexture } from './texture'
import { FrameBuffer, NormalColorDepthFrameBuffer } from './frameBuffer'

type EffectParams = Record<string, unknown>

export abstract class ScreenEffect<P extends EffectParams = EffectParams> {
  private readonly gl: WebGL2RenderingContext
  private readonly frameBuffer: FrameBuffer
  private readonly screenPlaneVAO: WebGLVertexArrayObject

  protected effectParams: P

  protected constructor(readonly screenShader: Shader, defaultParams: P) {
    this.gl = getGL()
    this.screenPlaneVAO = setupPlaneVAO(this.gl, this.screenShader)

    const colorTexture = new ColorTexture(this.gl)
    const normalTexture = new NormalTexture(this.gl)
    const depthTexture = new DepthTexture(this.gl)
    this.frameBuffer = new NormalColorDepthFrameBuffer(this.gl, normalTexture, colorTexture, depthTexture)
    this.frameBuffer.initialize()

    this.effectParams = defaultParams
  }

  startDraw() {
    this.frameBuffer.startDrawToBuffer()

    const gl = this.gl
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      throw Error(`Framebuffer incomplete after rendering: ${status}`);
    }
  }

  endDraw() {
    this.frameBuffer.endDrawToBuffer()
  }

  /**
   * render the drawn framebuffer to the screen
   */
  applyToScreen() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    this.screenShader.use()
    this.applyParameters()
    this.frameBuffer.drawOffscreenFrame(this.screenShader, () => {
      this.gl.bindVertexArray(this.screenPlaneVAO)
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
      this.gl.bindVertexArray(null)
    })
  }

  setParameters(params: Partial<P>) {
    Object.assign(this.effectParams, params)
  }

  abstract applyParameters(): void
}

const setupPlaneVAO = (gl: WebGL2RenderingContext, screenShader: Shader): WebGLVertexArrayObject => {
  // set up buffer for quad plane screen
  const quadVertices = new Float32Array([
    // positions   // texCoords
    -1.0, 1.0, 0.0, 1.0,
    -1.0, -1.0, 0.0, 0.0,
    1.0, -1.0, 1.0, 0.0,

    -1.0, 1.0, 0.0, 1.0,
    1.0, -1.0, 1.0, 0.0,
    1.0, 1.0, 1.0, 1.0
  ])

  const planeVAO = gl.createVertexArray();
  const planeVBO = gl.createBuffer();
  gl.bindVertexArray(planeVAO);

  gl.bindBuffer(gl.ARRAY_BUFFER, planeVBO);
  gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

  const positionAttribLocation = screenShader.getAttribLoc("aPosition");
  gl.enableVertexAttribArray(positionAttribLocation);
  gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0);

  const texCoordsLoc = screenShader.getAttribLoc("aTexCoords");
  gl.enableVertexAttribArray(texCoordsLoc);
  gl.vertexAttribPointer(texCoordsLoc, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

  gl.bindVertexArray(null);

  if (!planeVAO) throw Error(`could not create plane vao`)
  return planeVAO;
}
