import { getGL, resizeCanvas } from '../webgl'
import {
  buildGeometrySpecFromObj,
  ColorMaterial,
  GeometrySpec,
  Mesh,
  renderScene,
  Shader,
} from '../'

import vertShaderSource from './dev.vert?raw'
import fragShaderSource from './dev.frag?raw'
import fragShaderSource2 from './dev2.frag?raw'
import objUrl from './cube.obj?url'
import { RenderUnit } from '../models/unit'
import { Scene } from '../models/scene'

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

const unit1: RenderUnit = {
  meshes: [mesh1],
  box: {
    FBL: [0.0, 1.0, 0.0],
    FBR: [0.0, 1.0, 0.0],
  },
}

const unit2: RenderUnit = {
  meshes: [mesh2],
  box: {
    FBL: [1.0, 1.0, 0.0],
    FBR: [1.0, 1.0, 0.0],
  },
}

function render() {
  gl.clearColor(0.1, 0.1, 0.1, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const scene: Scene = {
    units: [unit1, unit2],
    eye: {
      sight: 60.0,
      fov: 4 / Math.PI,
      position: [0, 0, Math.sin(performance.now() * 0.0005) * 10],
      direction: [0, 0, -1],
    },
  }

  mesh1.uniforms.rotateY = performance.now() * 0.05
  mesh2.uniforms.rotateY = performance.now() * 0.05

  renderScene(scene)

  requestAnimationFrame(render)
}

requestAnimationFrame(render)
