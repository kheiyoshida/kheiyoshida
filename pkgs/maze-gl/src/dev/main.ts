import { getGL, resizeCanvas } from '../webgl'
import {
  buildGeometrySpecFromObj,
  ColorMaterial,
  Mesh,
  renderScene,
  RenderUnit,
  Scene,
  Shader,
  Vector,
} from '../'

import vertShaderSource from './dev.vert?raw'
import fragShaderSource from './dev.frag?raw'
import fragShaderSource2 from './dev2.frag?raw'
import objUrl from './cube.obj?url'
import {
  gameSizeDeformedBox2,
  gameSizeDeformedBox3,
  triangleSpec,
  triangleSpec2,
} from './geometries'
import { vec3 } from 'gl-matrix'
import { makeRenderer } from '../frame'

const objSpec = await buildGeometrySpecFromObj(objUrl)

const gl = getGL()
gl.enable(gl.DEPTH_TEST)
resizeCanvas(window.innerWidth, window.innerHeight, window.innerWidth, window.innerHeight)

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

const boxMesh = new Mesh(material1, objSpec)
const triangleMesh = new Mesh(material2, triangleSpec)
const triangleMesh2 = new Mesh(material2, triangleSpec2)

const unit1: RenderUnit = {
  meshes: [boxMesh],
  box: gameSizeDeformedBox3,
}

const unit2: RenderUnit = {
  meshes: [boxMesh],
  box: gameSizeDeformedBox2,
}

function frame() {
  gl.clearColor(0.1, 0.1, 0.1, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  const direction = vec3.fromValues(0, 0, -1)
  // vec3.rotateY(direction, vec3.fromValues(0, 0, 1), direction, performance.now() * 0.001 * Math.PI)

  const scene: Scene = {
    units: [unit1, unit2],
    eye: {
      sight: 60.0,
      fov: 4 / Math.PI,
      position: [0, 0, 500 / 1000], // TODO: pass in-game position, not NDC
      direction: direction as Vector,
    },
  }

  renderScene(scene)
}

const renderer = makeRenderer(30)
renderer.start(frame)
