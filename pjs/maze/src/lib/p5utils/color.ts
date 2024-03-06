import p5 from 'p5'
import { randomBetween } from '../random'

/**
 * generate random color, alpha can be inherited
 * @param original original color to copy alpha from
 * @returns new color
 */
export function randomColor(original?: p5.Color) {
  const [c1, c2, c3] = Array(3)
    .fill(0)
    .map((_) => randomBetween(0, 255))
  return original ? p.color(c1, c2, c3, p.alpha(original)) : p.color(c1, c2, c3)
}

export type ColorVector = [number, number, number]

export const randomColorVector = ([min, max]: [number, number]): ColorVector =>
  Array(3)
    .fill(0)
    .map((_) => randomBetween(min, max)) as ColorVector

/**
 * move color by vector value, alpha can be inherited
 * @param original original color to copy alpha from
 * @returns new color
 */
export function moveColor(original: p5.Color, colorVector: ColorVector) {
  const [c1, c2, c3] = colorVector.map((v) => randomBetween(0, v))
  return p.color(
    p.red(original) + c1,
    p.green(original) + c2,
    p.blue(original) + c3,
    p.alpha(original)
  )
}

export function colorCopy(color: p5.Color) {
  return p.color(p.red(color), p.green(color), p.blue(color), p.alpha(color))
}

/**
 * trnas color alpha by value
 * @param color original color
 * @param val alpha value, usually negative number
 * @param min minimum alpha
 * @returns same color object
 */
export const transColor = (color: p5.Color, val: number, min?: number): p5.Color => {
  const c = colorCopy(color)
  const newAlpha = p.alpha(c) + val
  if (min !== undefined && newAlpha < min) return c
  c.setAlpha(newAlpha)
  return c
}

type p5colorKeys = 'fill' | 'stroke' | 'background'

/**
 * apply color to p5 instance
 * @param key
 * @param color
 */
export const applyColor = (key: p5colorKeys, color: p5.Color) => {
  if (key === 'fill') {
    p.fill(color)
  } else if (key === 'stroke') {
    p.stroke(color)
  } else if (key === 'background') {
    p.background(color)
  }
}
