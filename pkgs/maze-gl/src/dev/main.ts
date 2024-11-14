import { getGL, resizeCanvas } from '../webgl'
import { ColorMaterial, GeometrySpec, loadMesh, Mesh, renderMesh, Shader } from '../'

import vertShaderSource from './dev.vert?raw'
import fragShaderSource from './dev.frag?raw'

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
      vertexIndices: [0,1,2],
      normalIndices: [0,1,2],
    }
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

const main = () => {
  const gl = getGL()
  resizeCanvas(800, 800, 800, 800)

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  const shader = new Shader(gl, vertShaderSource, fragShaderSource)
  const material1 = new ColorMaterial(shader, {
    diffuse: [1.0, 0.0, 0.0],
    specular: [1.0, 0.0, 0.0],
    shininess: 0.0
  })
  const material2 = new ColorMaterial(shader, {
    diffuse: [0.0, 1.0, 0.0],
    specular: [0.0, 1.0, 0.0],
    shininess: 0.0
  })

  const mesh1: Mesh = {
    geometry: spec, material: material1,
  }
  const mesh2: Mesh = {
    geometry: spec2, material: material2,
  }

  const ref1 = loadMesh(mesh1)
  const ref2 = loadMesh(mesh2)

  function render() {
    gl.clearColor(0.1, 0.1, 0.1, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    renderMesh(ref1)
    renderMesh(ref2)

    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
}

main()
