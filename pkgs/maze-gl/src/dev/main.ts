import { getGL, resizeCanvas } from '../webgl'
import {
  buildGeometrySpecFromObj,
  ColorMaterial,
  Mesh,
  renderScene,
  RenderUnit,
  Scene,
  Shader,
} from '../'

import vertShaderSource from './dev.vert?raw'
import fragShaderSource from './dev.frag?raw'
import fragShaderSource2 from './dev2.frag?raw'
import objUrl from './cube.obj?url'
import { gameSizeDeformedBox2, gameSizeDeformedBox3 } from './geometries'
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

const unit1: RenderUnit = {
  meshes: [boxMesh],
  box: gameSizeDeformedBox3,
}

const unit2: RenderUnit = {
  meshes: [boxMesh],
  box: gameSizeDeformedBox2,
}

function frame(frameCount: number) {
  gl.clearColor(0.1, 0.1, 0.1, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  const scene: Scene = {
    units: [unit1, unit2],
    eye: {
      sight: 8000,
      fov: 5 / Math.PI,
      position: [0, 0, 1000],
      direction: frameCount,
      aspectRatio: window.innerWidth / window.innerHeight,
    },
  }

  renderScene(scene)
}

const renderer = makeRenderer(30)
renderer.start(frame)
