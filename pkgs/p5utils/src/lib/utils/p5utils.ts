import p5 from 'p5'
import { randomFloatBetween as randomBetween, randomIntBetween } from 'utils'

export const gridPoint = (unit = 100) => {
  for (let i = 0; i <= p.width; i += unit) {
    for (let l = 0; l <= p.height; l += unit) {
      p.point(i, l)
    }
  }
}

export const translateByRadius = (degree: number, radius: number) => {
  const v = p5.Vector.fromAngle(p.radians(degree), radius)
  p.translate(v)
}

export function randomColor(alpha = 255) {
  const [c1, c2, c3] = [...Array(3)].map((_) => randomBetween(0, 255))
  return p.color(c1, c2, c3, alpha)
}

/**
 * change color variables with delta values
 */
export function moveColor(c: p5.Color, r: number, g: number, b: number, a = 0): p5.Color {
  return p.color(p.red(c) + r, p.green(c) + g, p.blue(c) + b, p.alpha(c) + a)
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function pushPop(cb: Function) {
  p.push()
  cb()
  p.pop()
}

/**
 * create a vector that's in specified distance/angle
 * from the original vector
 * @param v
 * @param angle
 * @param len
 * @returns
 */
export function destVect(v: p5.Vector, angle: number, len: number) {
  return v.copy().add(p5.Vector.fromAngle(p.radians(angle), len))
}

export function vline(v1: p5.Vector, v2: p5.Vector) {
  p.line(v1.x, v1.y, v2.x, v2.y)
}

export function colorCopy(color: p5.Color) {
  return p.color(p.red(color), p.green(color), p.blue(color), p.alpha(color))
}

/**
 * convert degree into vector
 */
export const degree2Vector = (theta: number, phi: number, velocity: number): p5.Vector => {
  const rad1 = p.radians(theta)
  const rad2 = p.radians(phi)
  return p5.Vector.fromAngles(rad1, rad2, velocity)
}

/**
 * quickly register capture handler on click
 */
export const clickCapture = () => {
  p.mouseClicked = () => {
    p.saveCanvas(`${p.millis()}`, 'png')
  }
}

/**
 * randomize the vector's position
 * @param vec
 */
export const shakeVector = (vec: p5.Vector, shake: number) =>
  p.createVector(vec.x + randomIntBetween(-shake, shake), vec.y + randomIntBetween(-shake, shake))

export const shakeVector3D = (vec: p5.Vector, shake: number) =>
  p.createVector(
    vec.x + randomIntBetween(-shake, shake),
    vec.y + randomIntBetween(-shake, shake),
    vec.z + randomIntBetween(-shake, shake)
  )

/**
 * create x, y added vector
 */
export const createAddedVector = (root: p5.Vector, x: number, y: number) => {
  const added = root.copy()
  added.add(x, y)
  return added
}

/**
 * calculate the angle from a vector to another
 * @param from
 * @param to
 */
export const angleTowardsVector = (from: p5.Vector, to: p5.Vector) => {
  return to.copy().sub(from).heading()
}

export const fillScreen = () => {
  p.rect(0, 0, p.windowWidth, p.windowHeight)
}
