import p5 from 'p5'
import { randomIntBetween } from 'utils'

export function pushPop(cb: () => void) {
  p.push()
  cb()
  p.pop()
}

export function destVect(v: p5.Vector, angle: number, len: number) {
  return v.copy().add(p5.Vector.fromAngle(p.radians(angle), len))
}

export function vline(v1: p5.Vector, v2: p5.Vector) {
  p.line(v1.x, v1.y, v2.x, v2.y)
}

export const pointLine = (p1: number[], p2: number[]) => {
  p.line(p1[0], p1[1], p2[0], p2[1])
}

export const degree2Vector = (theta: number, phi: number, velocity: number): p5.Vector => {
  const rad1 = p.radians(theta)
  const rad2 = p.radians(phi)
  return p5.Vector.fromAngles(rad1, rad2, velocity)
}

export const clickCapture = () => {
  p.mouseClicked = () => {
    p.saveCanvas(`${p.millis()}`, 'png')
  }
}

export const shakeVector = (vec: p5.Vector, shake: number) =>
  p.createVector(vec.x + randomIntBetween(-shake, shake), vec.y + randomIntBetween(-shake, shake))

export const shakeVector3D = (vec: p5.Vector, shake: number) =>
  p.createVector(
    vec.x + randomIntBetween(-shake, shake),
    vec.y + randomIntBetween(-shake, shake),
    vec.z + randomIntBetween(-shake, shake)
  )

export const createAddedVector = (root: p5.Vector, x: number, y: number) => {
  const added = root.copy()
  added.add(x, y)
  return added
}

export const angleTowardsVector = (from: p5.Vector, to: p5.Vector) => {
  return to.copy().sub(from).heading()
}

export const fillScreen = () => {
  p.rect(0, 0, p.windowWidth, p.windowHeight)
}
