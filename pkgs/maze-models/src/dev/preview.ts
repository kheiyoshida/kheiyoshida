import { mat4, vec3 } from 'gl-matrix'
import { GeometrySpec } from 'maze-gl'

export class GeometryPreviewer {
  private canvas: HTMLCanvasElement
  private gl: WebGL2RenderingContext
  private geometry: GeometrySpec
  private program!: WebGLProgram
  private wireframe = false
  private showNormals = true
  private cameraPos = vec3.fromValues(3, 3, 3)
  private cameraTarget = vec3.fromValues(0, 0, 0)
  private viewMat = mat4.create()
  private projMat = mat4.create()
  private modelMat = mat4.create()
  private lastX = 0
  private lastY = 0
  private rotating = false

  constructor(geometry: GeometrySpec) {
    this.geometry = geometry
    this.canvas = document.createElement('canvas')
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    document.body.appendChild(this.canvas)
    this.gl = this.canvas.getContext('webgl2')!

    this.setupGL()
    this.bindInputs()
    this.renderLoop()
  }

  private setupGL() {
    const gl = this.gl
    const vsSource = `#version 300 es
    layout(location=0) in vec3 position;
    layout(location=1) in vec3 normal;
    uniform mat4 uModel, uView, uProj;
    out vec3 vNormal;
    void main(){
      vNormal = mat3(uModel) * normal;
      gl_Position = uProj * uView * uModel * vec4(position,1.0);
    }`
    const fsSource = `#version 300 es
    precision highp float;
    in vec3 vNormal;
    out vec4 outColor;
    uniform bool uShowNormals;
    void main(){
      if(uShowNormals){
        outColor = vec4(normalize(vNormal)*0.5+0.5,1.0);
      } else {
        outColor = vec4(0.9,0.9,0.9,1.0);
      }
    }`
    this.program = this.createProgram(vsSource, fsSource)

    const { vertices, normals, faces } = this.geometry
    const flatVerts = faces.flatMap(f => f.vertexIndices.map(i => vertices[i])).flat()
    const flatNormals = faces.flatMap(f => f.normalIndices.map(i => normals[i])).flat()
    const vao = gl.createVertexArray()!
    gl.bindVertexArray(vao)

    const vbo = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatVerts), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)

    const nbo = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, nbo)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatNormals), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(1)
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0)

    gl.bindVertexArray(null)
    ;(this as any).vao = vao
    ;(this as any).vertexCount = flatVerts.length / 3
  }

  private bindInputs() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'w') this.wireframe = !this.wireframe
      if (e.key === 'n') this.showNormals = !this.showNormals
    })
    this.canvas.addEventListener('mousedown', e => {
      this.rotating = true
      this.lastX = e.clientX
      this.lastY = e.clientY
    })
    window.addEventListener('mouseup', () => this.rotating = false)
    window.addEventListener('mousemove', e => {
      if (this.rotating) {
        const dx = e.clientX - this.lastX
        const dy = e.clientY - this.lastY
        this.lastX = e.clientX
        this.lastY = e.clientY
        const rot = mat4.create()
        mat4.rotateY(rot, rot, dx * -0.01)
        mat4.rotateX(rot, rot, dy * -0.01)
        vec3.transformMat4(this.cameraPos, this.cameraPos, rot)
      }
    })
  }

  private renderLoop = () => {
    this.render()
    requestAnimationFrame(this.renderLoop)
  }

  private render() {
    const gl = this.gl
    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(0.1, 0.1, 0.1, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    const aspect = this.canvas.width / this.canvas.height
    mat4.lookAt(this.viewMat, this.cameraPos, this.cameraTarget, [0, 1, 0])
    mat4.perspective(this.projMat, Math.PI / 4, aspect, 0.1, 100)

    gl.useProgram(this.program)
    gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'uModel'), false, this.modelMat)
    gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'uView'), false, this.viewMat)
    gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'uProj'), false, this.projMat)
    gl.uniform1i(gl.getUniformLocation(this.program, 'uShowNormals'), this.showNormals ? 1 : 0)
    gl.bindVertexArray((this as any).vao)

    const mode = this.wireframe ? gl.LINES : gl.TRIANGLES
    gl.drawArrays(mode, 0, (this as any).vertexCount)

    this.drawGizmos()
  }

  private drawGizmos() {
    const gl = this.gl

    // Fixed reference box (8 corners)
    const points = new Float32Array([
      -1, -1, -1,
      -1, -1,  1,
      -1,  1, -1,
      -1,  1,  1,
       1, -1, -1,
       1, -1,  1,
       1,  1, -1,
       1,  1,  1,
    ])

    const prevVAO = gl.getParameter(gl.VERTEX_ARRAY_BINDING)

    const vao = gl.createVertexArray()!
    gl.bindVertexArray(vao)

    const vbo = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)

    const prog = this.createProgram(
      `#version 300 es
      layout(location=0) in vec3 position;
      uniform mat4 uView, uProj;
      void main(){
        gl_PointSize = 6.0;
        gl_Position = uProj * uView * vec4(position,1.0);
      }`,
      `#version 300 es
      precision highp float;
      out vec4 outColor;
      void main(){ outColor = vec4(1.0, 0.2, 0.2, 1.0); }`
    )

    gl.useProgram(prog)
    gl.uniformMatrix4fv(gl.getUniformLocation(prog, 'uView'), false, this.viewMat)
    gl.uniformMatrix4fv(gl.getUniformLocation(prog, 'uProj'), false, this.projMat)

    gl.drawArrays(gl.POINTS, 0, 8)

    gl.deleteBuffer(vbo)
    gl.deleteVertexArray(vao)
    gl.deleteProgram(prog)
    gl.bindVertexArray(prevVAO)
  }

  private createProgram(vs: string, fs: string) {
    const gl = this.gl
    const compile = (src: string, type: number) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(s)!)
      return s
    }
    const vsObj = compile(vs, gl.VERTEX_SHADER)
    const fsObj = compile(fs, gl.FRAGMENT_SHADER)
    const prog = gl.createProgram()!
    gl.attachShader(prog, vsObj)
    gl.attachShader(prog, fsObj)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(prog)!)
    return prog
  }
}
