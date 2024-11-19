import { CameraZ, FOV } from '../../../config'
import { CameraMoveValues } from './types'
import { ScaffoldValues } from '../scaffold'
import { Eye } from 'maze-gl'
import { toRadians } from 'p5utils/src/3d'

const defaultEye: Eye = {
  sight: 8000,
  fov: toRadians(FOV),
  position: [0, 0, CameraZ],
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
    position: [0, 0, finalZ],
    direction,
  }
}
