import p5 from 'p5'
import { Position3D } from './types'

export const distanceBetweenPositions = (pos1: Position3D, pos2: Position3D) =>
  Math.sqrt(
    Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2) + Math.pow(pos1[2] - pos2[2], 2)
  )

export const vectorBetweenPositions = (v1: Position3D, v2: Position3D) =>
  new p5.Vector(v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2])

export const sumPosition3d = (...positions: Position3D[]) =>
  positions.reduce((p, c) => [p[0] + c[0], p[1] + c[1], p[2] + c[2]], [0, 0, 0])

export const divPosition3d = (position: Position3D, by: number) =>
  position.map((p) => p / by) as Position3D

export const multPosition3d = (position: Position3D, by: number) =>
  position.map((p) => p * by) as Position3D
