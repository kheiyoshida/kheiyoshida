import { Position3D } from 'p5utils/src/3d'
import { CameraLookAhead, CameraZ, FloorLength } from '../../../config'
import { LightVariables } from '../../../domain/translate/light'
import { CameraMoveValues } from './types'
import { ScaffoldValues } from '../draw/scaffold'

export const cameraReset = (light: LightVariables) => {
  cameraWithLight([0, 0, CameraZ], [0, 0, CameraZ - CameraLookAhead], light)
}

export const moveCamera = (
  { zDelta, turnDelta, upDown }: CameraMoveValues,
  { path, floor, wall }: ScaffoldValues,
  light: LightVariables
) => {
  const finalX = turnDelta ? turnDelta * FloorLength * 2 : 0
  const size = path + floor
  const finalZ = CameraZ + (zDelta || 0) * -size
  const finalY = upDown ? upDown * wall : 0
  cameraWithLight([0, finalY, finalZ], [finalX, finalY, finalZ - CameraLookAhead], light)
}

const cameraWithLight = (
  cameraPosition: Position3D,
  directionalPosition: Position3D,
  light: LightVariables
) => {
  p.camera(...cameraPosition, ...directionalPosition)
}
