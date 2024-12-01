import { CameraZ, FOV, MaxVisibleLength, WallHeight } from '../../../config'
import { CameraMoveValues } from './types.ts'
import { ScaffoldValues } from '../scaffold'
import { Eye } from 'maze-gl'
import { toRadians } from 'utils'

const eyeElevation =WallHeight/100

const defaultEye: Eye = {
  sight: MaxVisibleLength,
  fov: toRadians(FOV),
  position: [0, eyeElevation, CameraZ],
  direction: 0,
  aspectRatio: window.innerWidth / window.innerHeight,
}

export const getDefaultEye = (): Eye => {
  return defaultEye
}

export const getMovementEye = (
  { move, turn }: CameraMoveValues,
  { path, floor }: ScaffoldValues
): Eye => {
  const size = path + floor
  const finalZ = CameraZ + (move || 0) * -size
  const direction = turn ? turn * 90 : 0
  return {
    ...defaultEye,
    position: [0, eyeElevation, finalZ],
    direction,
  }
}
