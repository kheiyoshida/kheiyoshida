import { getGL, resizeCanvas } from '../webgl'
import { buildGeometrySpecFromObj, ColorMaterial, GeometrySpec, Mesh, Shader } from '../'

import vertShaderSource from './dev.vert?raw'
import fragShaderSource from './dev.frag?raw'
import fragShaderSource2 from './dev2.frag?raw'
import objUrl from './cube.obj?url'
import { mat4, vec3 } from 'gl-matrix'

const objSpec = await buildGeometrySpecFromObj(objUrl)

const spec: GeometrySpec = {
  faces: [
    {
      vertexIndices: [0, 1, 2],
      normalIndices: [0, 1, 2],
    },
  ],
  normals: [
    [1.0, 0.0, 0.0],
    [-1.0, 0.0, 0.0],
    [0.0, 1.0, 0.0],
  ],
  vertices: [
    [1.0, 0.0, 1.0],
    [-1.0, 0.0, 1.0],
    [0.0, 1.0, 1.1],
  ],
}

const spec2: GeometrySpec = {
  faces: [
    {
      vertexIndices: [0, 1, 2],
      normalIndices: [0, 1, 2],
    },
  ],
  normals: [
    [1.0, 0.0, 0.0],
    [-1.0, 0.0, 0.0],
    [0.0, 1.0, 0.0],
  ],
  vertices: [
    [1.0, 0.0, 1.0],
    [-1.0, 0.0, 1.1],
    [0.0, -1.0, 1.0],
  ],
}

const gl = getGL()
gl.enable(gl.DEPTH_TEST)
resizeCanvas(800, 800, 800, 800)

const shader = new Shader(vertShaderSource, fragShaderSource)
const shader2 = new Shader(vertShaderSource, fragShaderSource2)

const material1 = new ColorMaterial(shader, {
  diffuse: [0.0, 1.0, 1.0],
  specular: [1.0, 0.0, 0.0],
  shininess: 0.0,
})
const material2 = new ColorMaterial(shader2, {
  diffuse: [0.0, 1.0, 0.0],
  specular: [0.0, 1.0, 0.0],
  shininess: 0.0,
})

const mesh1 = new Mesh(material1, objSpec)
const mesh2 = new Mesh(material2, spec2)

const view = mat4.create()
const position = vec3.fromValues(0, 0, 5)
const lookAtTarget = vec3.fromValues(0, 0, 0)
const up = vec3.fromValues(0, 1, 0)
mat4.lookAt(view, position, lookAtTarget, up);

const projection = mat4.create();
mat4.perspective(projection, Math.PI / 4, gl.canvas.width / gl.canvas.height, 0.1, 60.0);

const ubo = gl.createBuffer()
gl.bindBuffer(gl.UNIFORM_BUFFER, ubo)
const uboData = new Float32Array([
  ...projection,
  ...view,
])
gl.bufferData(gl.UNIFORM_BUFFER, uboData, gl.STATIC_DRAW);

const bindingPoint = Shader.reserveBindingPoint()
shader.bindUniformBlock('Matrices', bindingPoint)
shader2.bindUniformBlock('Matrices', bindingPoint)
Shader.bindPointToUBO(ubo, bindingPoint)

const ubo2 = gl.createBuffer()
gl.bindBuffer(gl.UNIFORM_BUFFER, ubo2)
const uboData2 = new Float32Array([...mat4.create(), ...mat4.create()])
gl.bufferData(gl.UNIFORM_BUFFER, uboData2, gl.STATIC_DRAW);

const bp2 = Shader.reserveBindingPoint()

shader2.bindUniformBlock('DeformedBox', bp2)
Shader.bindPointToUBO(ubo2, bp2)

function render() {
  gl.clearColor(0.1, 0.1, 0.1, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  mesh1.uniforms.rotateY = performance.now() * 0.05
  // mesh2.uniforms.rotateY = performance.now() * 0.05
  mesh1.render()
  mesh2.render()

  requestAnimationFrame(render)
}

requestAnimationFrame(render)
