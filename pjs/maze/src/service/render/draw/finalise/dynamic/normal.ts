import { Position3D, averagePosition3ds, sumPosition3d } from 'p5utils/src/3d'
import { RenderPosition } from '../../../../../domain/translate/renderGrid/renderSpec'
import { ShapeCoordinates } from '../geometry/types'
import { RenderBlockCoords, getBlockCenter } from '../../scaffold'

type GetNormal = (blockCoords: RenderBlockCoords, modelCoords?: ShapeCoordinates) => Position3D

export const toCenterBlock = (side: RenderPosition): GetNormal =>
  side === RenderPosition.LEFT ? toRightBlock : toLeftBlock

export const toLeftBlock: GetNormal = ({ front, rear }) =>
  sumPosition3d(averagePosition3ds([front.bl, front.tl, rear.bl, rear.tl]), [-300, 0, 0])

export const toRightBlock: GetNormal = ({ front, rear }) =>
  sumPosition3d(averagePosition3ds([front.br, front.tr, rear.br, rear.tr]), [300, 0, 0])

export const toBlockCenter: GetNormal = (blockCoords) => getBlockCenter(blockCoords)

export const toFrontBlock: GetNormal = ({ front }) =>
  sumPosition3d(averagePosition3ds([front.bl, front.br, front.tl, front.tr]), [0, 0, 300])

export const toRearBlock: GetNormal = ({ rear }) =>
  sumPosition3d(averagePosition3ds([rear.bl, rear.br, rear.tl, rear.tr]), [0, 0, -300])

export const toBlockAbove: GetNormal = ({ front, rear }) => {
  const [x, y, z] = averagePosition3ds([front.tl, front.tr, rear.tl, rear.tr])
  return [x, y - 300, z]
}

export const toBlockBelow: GetNormal = ({ front, rear }) => {
  const [x, y, z] = averagePosition3ds([front.bl, front.br, rear.bl, rear.br])
  return [x, y + 300, z]
}
