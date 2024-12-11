import { getGL, resizeCanvas } from '../webgl'
import {
  buildGeometrySpecFromObj,
  ColorMaterial,
  Mesh,
  renderScene,
  RenderUnit,
  Scene,
  Vec3,
  Vector3D,
} from '../'

import vertShaderSource from './dev.vert?raw'
import fragShaderSource from './dev.frag?raw'

import screenVert from './screen.vert?raw'
import screenFrag from './screen.frag?raw'

import objUrl from './cube.obj?url'
import { boxSize, getDeformedBox, halfBox } from './geometries'
import { makeRenderer } from '../frame'
import { PointLightValues, SpotLightValues } from '../models'
import { toRadians } from '../utils/calc'
import { Color } from '../color'
import { MaterialShader, ScreenShader } from '../models/shader/shaders'
import { ScreenEffect } from '../models/screenEffect/screenEffect'

const objSpec = await buildGeometrySpecFromObj(objUrl)

const gl = getGL()
gl.enable(gl.DEPTH_TEST)
resizeCanvas(window.innerWidth, window.innerHeight, window.innerWidth, window.innerHeight)

const shader = new MaterialShader(vertShaderSource, fragShaderSource)

const baseColor = new Color(0, 0.0, 0.0)

const unlitColor = baseColor.clone()
unlitColor.lightness = 0.1

const lightColor = baseColor.clone()
lightColor.saturation = 0.0
lightColor.lightness = 0.5

const materialColor = baseColor.clone()
materialColor.lightness = 0.3

const material1 = new ColorMaterial(shader, {
  diffuse: materialColor.normalizedRGB,
  specular: materialColor.normalizedRGB,
  shininess: 1.0,
})

const boxMesh = new Mesh(material1, objSpec)

const unit1: RenderUnit = {
  meshes: [boxMesh],
  box: getDeformedBox(0, 0, 0),
}

const unit2: RenderUnit = {
  meshes: [boxMesh],
  box: getDeformedBox(boxSize, 0, boxSize),
}

//
// lights
//

const pointLight1: PointLightValues = {
  position: [0, 0, halfBox * 4],

  ambient: [0, 0, 0],
  diffuse: lightColor.normalizedRGB,
  specular: lightColor.normalizedRGB,

  constant: 1.0,
  linear: 0.000008,
  quadratic: 0.00000088,
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

//
// offscreen frame buffer
//

const screenShader = new ScreenShader(screenVert, screenFrag)
const effect = new ScreenEffect(screenShader)

if (!gl.getExtension('EXT_color_buffer_float')) {
  console.error('EXT_color_buffer_float not supported');
}
if (!gl.getExtension('OES_texture_float')) {
  console.error('OES_texture_float not supported');
}

function frame(frameCount: number) {
  const scene: Scene = {
    unlitColor: unlitColor,
    lights: {
      pointLights: [pointLight1, pointLight2],
      spotLight,
    },
    units: [unit1, unit2],
    eye: {
      sight: 8000,
      fov: toRadians(60),
      position: [0, 0, 3000],
      direction: 0,
      aspectRatio: window.innerWidth / window.innerHeight,
    },
    effect: {
      fogLevel: 0.0,
    },
    screenEffect: effect,
  }

  renderScene(scene)
}

const renderer = makeRenderer(30)
renderer.start(frame)
