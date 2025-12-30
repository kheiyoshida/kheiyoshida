import { buildGeometrySpecFromObj, MaterialShader, Scene, SceneObject } from '../models'
import { getGL } from '../runtime/webgl'
import { ColorMaterial, MazeModel, RenderUnit } from '../'

import vertShaderSource from './dev.vert?raw'
import fragShaderSource from './dev.frag?raw'

import objUrl from './cube.obj?url'
import { boxSize, getDeformedBox } from './geometries'
import { toRadians } from '../utils/calc'
import { Color } from '../models/supporting/color'

const objSpec = await buildGeometrySpecFromObj(objUrl)

export const getDebugScene = (): Scene => {
  const gl = getGL()

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
    relativeColor: [0.1, 0.1, 0.1]
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

  const eyeX = 0
  const eyeY = 0
  const eyeZ = 3000

  const resolution: [number, number] = [gl.canvas.width, gl.canvas.height]

  return {
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
    },
  }
}
