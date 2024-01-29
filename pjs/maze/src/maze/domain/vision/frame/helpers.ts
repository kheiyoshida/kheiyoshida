import { getRandomMod } from 'p5utils/src/random'
import { Conf } from 'src/maze/config'
import { Frame } from '.'
import { DrawPoint } from '../draw/patterns/factory'

export const frameWidthAndHeight = (f: Frame): [number, number] => [
  f.tr[0] - f.tl[0],
  f.bl[1] - f.tl[1],
]

export const distortFramePosition = (
  [px, py]: DrawPoint,
  [w, h]: [number, number],
  distortion: number
) => [px + getRandomMod(w, distortion), py + getRandomMod(h, distortion)]

export const liftUpFramePosition = (
  [px, py]: DrawPoint,
  [w, h]: [number, number],
  up: number
) => [px, py - h * up]

/**
 * create [Width * Height] for specified layer info
 */
export const rectWH = (
  metaMagnify: number,
  magRate: number,
  w: number,
  h: number
): [number, number] => [w * metaMagnify * magRate, h * metaMagnify * magRate]

/**
 * get adjust value when width & height is differnt from the window values
 * @param w 
 * @param h 
 * @returns 
 */
export const adjustFramePosition = (
  w: number,
  h: number
): [aw: number, ah: number] => [(Conf.ww - w) / 2, (Conf.wh - h) / 2]
