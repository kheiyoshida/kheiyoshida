import { getGL, resizeCanvas } from '../webgl'
import { buildGeometrySpecFromObj, ColorMaterial, Mesh, renderScene, RenderUnit, Scene, Vec3, Vector3D } from '../'

import vertShaderSource from './dev.vert?raw'
import fragShaderSource from './dev.frag?raw'

import objUrl from './cube.obj?url'
import { boxSize, getDeformedBox, halfBox } from './geometries'
import { makeRenderer } from '../frame'
import { MaterialShader, PointLightValues, SceneObject, SpotLightValues } from '../models'
import { toRadians } from '../utils/calc'
import { Color } from '../color'
import * as shaders from './shaders'

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
  objects: [new SceneObject(boxMesh)],
  box: getDeformedBox(0, 0, 0),
}

const unit2: RenderUnit = {
  objects: [new SceneObject(boxMesh)],
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
  position: [-400.0, 0.0, halfBox * 12.01], // forget the spotlight for now
  direction: calcDirectionalVector(180), // I don't know why this is inverted only in the dev environment

  ambient: [0.1, 0.1, 0.1],
  diffuse: [0.8, 0.8, 0.8],
  specular: Vec3.create(1.0),

  cutOff: 19, // 0.0
  outerCutOff: 30, // 1.0

  constant: 0.4, // Constant attenuation
  linear: 0.007, // Linear attenuation
  quadratic: 0.32, // Quadratic attenuation
}

unit1.objects[0].transform.scale = 0.9
unit2.objects[0].transform.scale = 0.9

let eyeX = 0
let eyeY = 0
let eyeZ = 3000

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
      position: [eyeX, eyeY, eyeZ],
      direction: 0,
      aspectRatio: window.innerWidth / window.innerHeight,
    },
    effect: {
      fogLevel: 0.0,
    },
    screenEffect: undefined,
  }

  renderScene(scene)
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'w') eyeZ -= 100
  if (e.key === 's') eyeZ += 100
  if (e.key === 'd') eyeX += 100
  if (e.key === 'a') eyeX -= 100
  if (e.key === 'e') eyeY += 100
  if (e.key === 'q') eyeY -= 100
})

const renderer = makeRenderer(30)
renderer.start(frame)
