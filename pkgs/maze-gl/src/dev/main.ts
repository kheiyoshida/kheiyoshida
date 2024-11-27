import { getGL, resizeCanvas } from '../webgl'
import {
  buildGeometrySpecFromObj,
  ColorMaterial,
  Mesh,
  renderScene,
  RenderUnit,
  Scene,
  Shader,
  Vec3,
  Vector3D,
} from '../'

import vertShaderSource from './dev.vert?raw'
import fragShaderSource from './dev.frag?raw'
import objUrl from './cube.obj?url'
import { boxSize, getDeformedBox, halfBox } from './geometries'
import { makeRenderer } from '../frame'
import { PointLightValues, SpotLightValues } from '../models'
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
  box: getDeformedBox(boxSize, 0, 0),
}

const unit2: RenderUnit = {
  meshes: [boxMesh],
  box: getDeformedBox(boxSize, 0, boxSize),
}

const pointLight1: PointLightValues = {
  position: [0.0, 0.0, halfBox + halfBox],

  ambient: Vec3.create(0.3),
  diffuse: Vec3.create(0.3),
  specular: Vec3.create(0.1),

  constant: 0.3,
  linear: 0.0003,
  quadratic: 0.0003,
}

const pointLight2: PointLightValues = {
  ...pointLight1,
  position: [200000, 0, 80000], // Change position for the second light
}

const calcDirectionalVector = (delta: number): Vector3D => {
  const theta = Math.PI / 2 - toRadians(delta)
  return [Math.cos(theta), 0, -Math.sin(theta)]
}

const spotLight: SpotLightValues = {
  position: [-400.0, 0.0, halfBox * 12.01], // forget spotlight for now
  direction: calcDirectionalVector(180), // I don't know why this is inverted only in dev environment

  ambient: [0.1, 0.1, 0.1],
  diffuse: [0.8, 0.8, 0.8],
  specular: Vec3.create(1.0),

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
    units: [
      unit1,
      unit2
    ],
    eye: {
      sight: 8000,
      fov: toRadians(60),
      position: [0, 0, 3000],
      direction: 0,
      aspectRatio: window.innerWidth / window.innerHeight,
    },
  }

  renderScene(scene)
}

const renderer = makeRenderer(30)
renderer.start(frame)
