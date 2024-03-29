import p5 from 'p5'
import { Position3D } from '../3d/types'
import { pushPop, shakeVector, shakeVector3D } from './utils'

export const drawLineBetweenVectors = (p1: p5.Vector, p2: p5.Vector) => {
  p.line(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z)
}

export const drawLineBetweenVectors2D = (p1: p5.Vector, p2: p5.Vector) => {
  p.line(p1.x, p1.y, p2.x, p2.y)
}

export const shakyLineBetweenVectors2D = (p1: p5.Vector, p2: p5.Vector, shake: number) => {
  drawLineBetweenVectors2D(shakeVector(p1, shake), shakeVector(p2, shake))
}

export const shakyLineBetweenVectors3D = (p1: p5.Vector, p2: p5.Vector, shake: number) => {
  drawLineBetweenVectors(shakeVector3D(p1, shake), shakeVector3D(p2, shake))
}

export function drawAtVectorPosition(v: p5.Vector, draw: () => void) {
  drawAtPosition3D(v.array() as Position3D, draw)
}

export function drawAtPosition3D(pos: Position3D, draw: () => void) {
  pushPop(() => {
    p.translate(...pos)
    draw()
  })
}
