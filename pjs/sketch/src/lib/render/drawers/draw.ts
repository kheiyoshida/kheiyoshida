import p5 from 'p5'
import { shakeVector, shakeVector3D } from 'src/lib/utils/p5utils'

export const drawLineBetweenVectors = (p1: p5.Vector, p2: p5.Vector) => {
  p.line(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z)
}

export const drawLineBetweenVectors2D = (p1: p5.Vector, p2: p5.Vector) => {
  p.line(p1.x, p1.y, p2.x, p2.y)
}

export const shakyLineBetweenVectors2D = (
  p1: p5.Vector,
  p2: p5.Vector,
  shake: number
) => {
  drawLineBetweenVectors2D(shakeVector(p1, shake), shakeVector(p2, shake))
}

export const shakyLineBetweenVectors3D = (
  p1: p5.Vector,
  p2: p5.Vector,
  shake: number
) => {
  drawLineBetweenVectors(shakeVector3D(p1, shake), shakeVector3D(p2, shake))
}
