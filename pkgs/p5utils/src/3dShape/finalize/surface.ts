import p5 from 'p5'
import { Position3D } from '../../3d/types'
import { calcAverageVector, calcPerpendicularVector, isInTheSameSide } from '../tools'
import { ShapeVertex } from '../types'

type NormalDirectionOption = 'opposite' | 'same'

export const finalizeSurface = (
  surfaceVertices: ShapeVertex[],
  theOtherVertex: ShapeVertex,
  dir: NormalDirectionOption = 'opposite'
): void => {
  p.beginShape()
  p.normal(calcNormal(surfaceVertices, theOtherVertex, dir))
  surfaceVertices.forEach(vectorVertex)
  p.endShape()
}

/**
 * note: normal direction is on the opposite of the other vertex against surface by default
 *           |
 * normal <- | *
 *           |
 */
export const calcNormal = (
  surfaceVertices: ShapeVertex[],
  theOtherVertex: ShapeVertex,
  dir: NormalDirectionOption = 'opposite'
): p5.Vector => {
  const normal = calcPerpendicularVector(surfaceVertices)
  const surfaceCenter = calcAverageVector(surfaceVertices)
  const surfaceToTheOther = theOtherVertex.copy().sub(surfaceCenter)
  const makeOpposite = dir === 'opposite'
  if (isInTheSameSide(normal, surfaceToTheOther) === makeOpposite) {
    normal.mult(-1)
  }
  return normal
}

const vectorVertex = (v: ShapeVertex, i: number): void => {
  p.vertex(...(v.array() as Position3D), ...uv[i])
}

const uv = [
  [0, 0],
  [1, 0],
  [0.5, 1],
]
