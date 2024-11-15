import { getGL, resizeCanvas } from '../webgl'
import { buildGeometrySpecFromObj, ColorMaterial, GeometrySpec, loadMesh, Mesh, renderMesh, Shader } from '../'

import vertShaderSource from './dev.vert?raw'
import fragShaderSource from './dev.frag?raw'
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
    [1.0, 0.0, 0.0],
    [-1.0, 0.0, 0.0],
    [0.0, 1.0, 0.0],
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
    [1.0, 0.0, 0.0],
    [-1.0, 0.0, 0.0],
    [0.0, -1.0, 0.0],
  ],
}

const gl = getGL()
resizeCanvas(800, 800, 800, 800)

const shader = new Shader(vertShaderSource, fragShaderSource)
const material1 = new ColorMaterial(shader, {
  diffuse: [0.0, 1.0, 1.0],
  specular: [1.0, 0.0, 0.0],
  shininess: 0.0,
})
const material2 = new ColorMaterial(shader, {
  diffuse: [0.0, 1.0, 0.0],
  specular: [0.0, 1.0, 0.0],
  shininess: 0.0,
})

const mesh1: Mesh = {
  geometry: objSpec,
  material: material1,
}
const mesh2: Mesh = {
  geometry: spec2,
  material: material2,
}

const ref1 = loadMesh(mesh1)
const ref2 = loadMesh(mesh2)

const view = mat4.create()
const position = vec3.fromValues(0, 0, 10)
const lookAtTarget = vec3.fromValues(0, 0, 0)
const up = vec3.fromValues(0, 1, 0)
mat4.lookAt(view, position, lookAtTarget, up);

const model = mat4.create();
mat4.fromRotation(model, performance.now() * 0.05 * (Math.PI / 180), vec3.fromValues(1, 0.5, 0))

const projection = mat4.create();
mat4.perspective(projection, Math.PI / 4, gl.canvas.width / gl.canvas.height, 0.1, 60.0);

shader.use()
shader.setMat4('view', view)
shader.setMat4('model', model)
shader.setMat4('projection', projection)

function render() {
  gl.clearColor(0.1, 0.1, 0.1, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  renderMesh(ref1)
  renderMesh(ref2)

  requestAnimationFrame(render)
}

requestAnimationFrame(render)
