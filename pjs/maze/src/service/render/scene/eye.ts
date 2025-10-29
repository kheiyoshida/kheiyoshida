import { CameraZ, FOV, MaxVisibleLength, WallHeight } from '../../../config'
import { EyeMovementValues } from './types.ts'
import { Eye } from 'maze-gl'
import { toRadians } from 'utils'
import { ScaffoldParams } from '../../../integration/query/structure/scaffold.ts'
import { getConcreteLengths } from '../scaffold/values.ts'

const eyeElevation = WallHeight / 100

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

export const getMovementEye = ({ move, turn, descend }: EyeMovementValues, params: ScaffoldParams): Eye => {
  const { floor, path, wall } = getConcreteLengths(params)
  const size = path + floor
  const finalZ = CameraZ + (move || 0) * -size
  const finalY = eyeElevation - (descend || 0) * wall
  const direction = turn ? turn * 90 : 0
  return {
    ...defaultEye,
    position: [0, finalY, finalZ],
    direction,
  }
}
