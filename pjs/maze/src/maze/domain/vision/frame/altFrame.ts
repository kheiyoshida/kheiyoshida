import { Position } from '../../../utils/position'
import { Conf } from '../../../config'
import { Frame } from '.'
import { liftUpFramePosition, frameWidthAndHeight, distortFramePosition } from './helpers'

export type AltFrame = (frame: Frame) => Frame

export const upFrame =
  (up: number, frameWH?: [number, number]): AltFrame =>
  (f) =>
    Object.fromEntries(
      Object.entries(f).map(([k, v]) => [
        k,
        k === 'tl' || k === 'tr'
          ? liftUpFramePosition(v, frameWH || frameWidthAndHeight(f), up)
          : v,
      ])
    ) as Frame

export const narrowFrame =
  (rate: number): AltFrame =>
  (f) => {
    const add = (f.tr[0] - f.tl[0]) * -Math.abs(rate) * 0.5
    return {
      tl: [f.tl[0] - add, f.tl[1]],
      tr: [f.tr[0] + add, f.tr[1]],
      bl: [f.bl[0] - add, f.bl[1]],
      br: [f.br[0] + add, f.br[1]],
    }
  }

export const distortFrame =
  (disortion: number, frameWH?: [number, number]): AltFrame =>
  (f) =>
    Object.fromEntries(
      Object.entries(f).map(([k, v]) => [
        k,
        distortFramePosition(v, frameWH || frameWidthAndHeight(f), disortion),
      ])
    ) as Frame

export const assumeSecondFrame: AltFrame = (f) => {
  const frameHeight = f.bl[1] - f.tl[1]
  const secondFrameBottom = f.bl[1] + frameHeight
  return {
    tl: f.bl,
    tr: f.br,
    bl: [f.bl[0], secondFrameBottom],
    br: [f.br[0], secondFrameBottom],
  }
}

export const wallPictureFrame: AltFrame = (f) => {
  const originalHeight = f.bl[1] - f.tl[1]
  const originalWidth = f.tr[0] - f.tl[0]
  let width, height
  if (originalHeight > originalWidth) {
    width = originalWidth * Conf.pictureMagnify
    height = width
  } else {
    height = originalHeight * Conf.pictureMagnify
    width = height
  }
  const heightPadding = (originalHeight - height) * 0.5
  const widthPadding = (originalWidth - width) * 0.5
  return {
    tl: [f.tl[0] + widthPadding, f.tl[1] + heightPadding],
    tr: [f.tr[0] - widthPadding, f.tr[1] + heightPadding],
    bl: [f.bl[0] + widthPadding, f.bl[1] - heightPadding],
    br: [f.br[0] - widthPadding, f.br[1] - heightPadding],
  }
}

export const translateFrame =
  (trans: Position): AltFrame =>
  (f) => ({
    tl: [f.tl[0] + trans[0], f.tl[1] + trans[1]],
    tr: [f.tr[0] + trans[0], f.tr[1] + trans[1]],
    bl: [f.bl[0] + trans[0], f.bl[1] + trans[1]],
    br: [f.br[0] + trans[0], f.br[1] + trans[1]],
  })

export const thru: AltFrame = (f) => f

export const conditionalAlt =
  (alt: AltFrame) =>
  (doOrNot: boolean): AltFrame =>
    doOrNot ? alt : thru
