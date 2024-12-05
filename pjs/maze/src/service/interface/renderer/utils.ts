import { logicalHeight, logicalWidth, wh, ww } from '../../../config'
import { PointSpec } from './types.ts'

export const roundArgs = <Args extends number[]>(...args: Args): Args => {
  return args.map(a => Math.floor(a)) as Args
}

export const physicalToLogicalX = (physicalX: number) => {
  return physicalX *  (logicalWidth / ww)
}

export const physicalToLogicalY = (physicalY: number) => {
  return physicalY *  (logicalHeight / wh)
}

export const physicalToLogicalPoint = (position: PointSpec): PointSpec => ({
  x: physicalToLogicalX(position.x),
  y: physicalToLogicalY(position.y),
})
