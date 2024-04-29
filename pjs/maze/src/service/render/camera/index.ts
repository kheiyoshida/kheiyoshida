import { Position3D } from 'p5utils/src/3d'
import { CameraLookAhead, CameraZ, FloorLength } from '../../../config'
import { ScaffoldValues } from '../scaffold'
import { light } from './light'
import { CameraMoveValues } from './types'

export const cameraReset = (visibility = 1.0) => {
  cameraWithLight([0, 0, CameraZ], [0, 0, CameraZ - CameraLookAhead], visibility)
}

export const moveCamera = (
  { zDelta, turnDelta, upDown }: CameraMoveValues,
  { path, floor, wall }: ScaffoldValues
) => {
  const finalX = turnDelta ? turnDelta * FloorLength * 2 : 0
  const size = path + floor
  const finalZ = CameraZ + (zDelta || 0) * -size
  const finalY = upDown ? upDown * wall : 0
  cameraWithLight([0, finalY, finalZ], [finalX, finalY, finalZ - CameraLookAhead])
}

const cameraWithLight = (
  cameraPosition: Position3D,
  directionalPosition: Position3D,
  visibility?: number
) => {
  p.camera(...cameraPosition, ...directionalPosition)
  light(cameraPosition, directionalPosition, visibility)
}
