import p5 from 'p5'
import { Position3D } from "../../3d/types"
import { calcAverageVector, calcPerpendicularVector, isInTheSameSide } from '../tools'
import { ShapeVertex } from '../types'

export const finalizeSurface = (
  surfaceVertices: ShapeVertex[],
  theOtherVertex: ShapeVertex
): void => {
  p.beginShape()
  p.normal(calcNormal(surfaceVertices, theOtherVertex))
  surfaceVertices.forEach(vectorVertex)
  p.endShape()
}

export const calcNormal = (
  surfaceVertices: ShapeVertex[],
  theOtherVertex: ShapeVertex
): p5.Vector => {
  const normal = calcPerpendicularVector(surfaceVertices)
  const surfaceCenter = calcAverageVector(surfaceVertices)
  const surfaceToTheOther = theOtherVertex.copy().sub(surfaceCenter)
  if (isInTheSameSide(normal, surfaceToTheOther)) {
    normal.mult(-1)
  }
  return normal
}

const vectorVertex = (v: ShapeVertex): void => {
  p.vertex(...(v.array() as Position3D))
}
