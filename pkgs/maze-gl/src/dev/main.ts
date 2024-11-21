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
import objUrl from './cube.obj?url'
import { gameSizeDeformedBox, gameSizeDeformedBox2 } from './geometries'
import { makeRenderer } from '../frame'
import { PointLightValues, SpotLightValues } from '../models/light'
import { toRadians } from '../utils/calc'

const objSpec = await buildGeometrySpecFromObj(objUrl)

const gl = getGL()
gl.enable(gl.DEPTH_TEST)
resizeCanvas(window.innerWidth, window.innerHeight, window.innerWidth, window.innerHeight)

const shader = new Shader(vertShaderSource, fragShaderSource)

const material1 = new ColorMaterial(shader, {
  diffuse: [0.1, 0.1, 0.1],
  specular: [0.1, 0.1, 0.1],
  shininess: 1.0,
})

const boxMesh = new Mesh(material1, objSpec)

const unit1: RenderUnit = {
  meshes: [boxMesh],
  box: gameSizeDeformedBox,
}

const unit2: RenderUnit = {
  meshes: [boxMesh],
  box: gameSizeDeformedBox2,
}

// TODO: pass the light positions in logical values

const pointLight1: PointLightValues = {
  position: [0.0, 0.0, 1000],

  ambient: [0.3, 0.3, 0.3],
  diffuse: [1.0, 1.0, 1.0],
  specular: [0.1, 0.1, 0.1],

  constant: 0.5,
  linear: 0.03,
  quadratic: 0.0001,
}

const pointLight2: PointLightValues = {
  ...pointLight1,
  position: [0, 2000, 1000], // Change position for the second light
}

const spotLight: SpotLightValues = {
  position: [0.0, 0.0, 530],
  direction: [0.0, 0.0, -1.0],

  ambient: [0.1, 0.1, 0.1],
  diffuse: [0.8, 0.8, 0.8],
  specular: [0.8, 0.8, 0.8],

  cutOff: 19, // 0.0
  outerCutOff: 30, // 1.0

  constant: 0.4, // Constant attenuation
  linear: 0.007, // Linear attenuation
  quadratic: 0.32, // Quadratic attenuation
}

function frame(frameCount: number) {

  const scene: Scene = {
    lights: {
      pointLights: [pointLight1, pointLight2],
      spotLight,
    },
    units: [unit1, unit2],
    eye: {
      sight: 8000,
      fov: toRadians(60),
      position: [0, 0,3000],
      direction: 0,
      aspectRatio: window.innerWidth / window.innerHeight,
    },
  }

  renderScene(scene)
}

const renderer = makeRenderer(30)
renderer.start(frame)
