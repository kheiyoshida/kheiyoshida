import { getGL, resizeCanvas } from '../webgl'
import { buildGeometrySpecFromObj, ColorMaterial, MazeModel, renderScene, RenderUnit, Scene } from '../'

import vertShaderSource from './dev.vert?raw'
import fragShaderSource from './dev.frag?raw'

import objUrl from './cube.obj?url'
import { boxSize, getDeformedBox } from './geometries'
import { makeRenderer } from '../frame'
import { MaterialShader, SceneObject } from '../models'
import { toRadians } from '../utils/calc'
import { Color } from '../color'

const objSpec = await buildGeometrySpecFromObj(objUrl)

const gl = getGL()
gl.enable(gl.DEPTH_TEST)
resizeCanvas(window.innerWidth, window.innerHeight, window.innerWidth, window.innerHeight)

const shader = new MaterialShader(vertShaderSource, fragShaderSource)

const baseColor = new Color(0, 0.0, 0.0)

const unlitColor = baseColor.clone()
unlitColor.lightness = 0.0
unlitColor.saturation = 0.0

const lightColor = baseColor.clone()
lightColor.saturation = 0.0
lightColor.lightness = 0.5

const materialColor = baseColor.clone()
materialColor.lightness = 0.3

const material = new ColorMaterial(shader, {
  diffuse: materialColor.normalizedRGB,
  specular: materialColor.normalizedRGB,
  shininess: 1.0,
})

const boxMesh = new MazeModel(material, objSpec)

const unit1: RenderUnit = {
  objects: [new SceneObject(boxMesh)],
  box: getDeformedBox(0, 0, 0),
}

const unit2: RenderUnit = {
  objects: [new SceneObject(boxMesh)],
  box: getDeformedBox(boxSize, 0, boxSize),
}

unit1.objects[0].transform.scale = 0.9
unit2.objects[0].transform.scale = 0.9

let eyeX = 0
let eyeY = 0
let eyeZ = 3000

const resolution: [number, number] = [gl.canvas.width, gl.canvas.height]

function frame(frameCount: number) {
  const scene: Scene = {
    baseColor: unlitColor,
    units: [unit1, unit2],
    eye: {
      sight: 8000,
      fov: toRadians(60),
      position: [eyeX, eyeY, eyeZ],
      direction: 0,
      aspectRatio: window.innerWidth / window.innerHeight,
    },
    effect: {
      time: performance.now(),
      resolution: resolution,
      edge: {
        edgeRenderingLevel: 1.0,
      },
      // blur: {
      //   blurLevel: 1
      // },
      // distortion: {
      //   distortionLevel: 0.3
      // },
      // fade: {
      //   fadeLevel: 0.0
      // }
    },
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
