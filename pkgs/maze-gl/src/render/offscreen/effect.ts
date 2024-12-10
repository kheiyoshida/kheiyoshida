import { Shader } from '../../models'
import { getGL } from '../../webgl'
import { DepthTexture, NormalTexture } from './texture'
import { FrameBuffer } from './frameBuffer'

export class ScreenEffect {
  private readonly gl: WebGL2RenderingContext
  private readonly frameBuffer: FrameBuffer
  private readonly screenPlaneVAO: WebGLVertexArrayObject

  constructor(private screenShader: Shader) {
    this.gl = getGL()
    this.screenPlaneVAO = setupPlaneVAO(this.gl, this.screenShader)

    const depthTexture = new DepthTexture(this.gl)
    const normalTexture = new NormalTexture(this.gl)
    this.frameBuffer = new FrameBuffer(this.gl, normalTexture, depthTexture)
  }

  enable() {
    this.frameBuffer.startDrawToBuffer()
  }

  disable() {
    this.frameBuffer.endDrawToBuffer()
  }

  /**
   * render the drawn framebuffer to the screen
   */
  applyToScreen() {
    this.frameBuffer.drawOffscreenFrame(this.screenShader, () => {
      this.gl.bindVertexArray(this.screenPlaneVAO)
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
      this.gl.bindVertexArray(null)
    })
  }
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
