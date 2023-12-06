import { Frame } from '.'
import { adjustFramePosition } from './helpers'

export type CreateFrame = (
  w: number,
  h: number,
  [rectWidth, rectHeight]: [number, number]
) => Frame

/**
 * detemine frame's corners
 * it should be centered in the wh rectangle
 *
 * it
 *    /      w        \
 *   '----------------'
 *   |  x1        x2  |
 *   |y1 '--------'   |
 * h |   |        |   |
 *   |   |        |   |
 *   |y2 '--------'   |
 *   '----------------'
 * @param w
 * @param h
 * @param rectWH
 * @returns
 */
export const createFrame: CreateFrame = (
  w: number,
  h: number,
  [rectWidth, rectHeight]: [number, number]
): Frame => {
  const [aw, ah] = adjustFramePosition(w, h)
  const x1 = aw + (w - rectWidth) / 2
  const x2 = x1 + rectWidth
  const y1 = ah + (h - rectHeight) / 2
  const y2 = y1 + rectHeight
  return {
    tl: [x1, y1],
    tr: [x2, y1],
    bl: [x1, y2],
    br: [x2, y2],
  }
}

/**
 * create frame with fixed top height
 */
export const createRoofTopFrame: CreateFrame = (
  w: number,
  h: number,
  [rectWidth, rectHeight]: [number, number]
): Frame => {
  const [aw, ah] = adjustFramePosition(w, h)
  const x1 = aw + (w - rectWidth) / 2
  const x2 = x1 + rectWidth
  const y1 = ah + (h - rectHeight) / 2
  const y2 = y1 + rectHeight
  return {
    tl: [x1, 0],
    tr: [x2, 0],
    bl: [x1, y2],
    br: [x2, y2],
  }
}
